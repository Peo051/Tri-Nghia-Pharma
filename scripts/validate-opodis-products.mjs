import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const SNAPSHOT_PATH = join(
  PROJECT_ROOT,
  "src",
  "data",
  "opodis-products.json"
);
const ASSET_MANIFEST_PATH = join(
  PROJECT_ROOT,
  "src",
  "data",
  "opodis-assets.json"
);
const RAW_PRODUCTS_DIR = join(PROJECT_ROOT, "src", "static", "products");
const PRODUCTION_PRODUCTS_DIR = join(
  PROJECT_ROOT,
  "src",
  "static",
  "products-app"
);

const RAW_ROOT = "src/static/products/";
const PRODUCTION_ROOT = "src/static/products-app/";
const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);
const ARRAY_FIELDS = ["categories", "galleryImages"];
const RICH_FIELDS = [
  "ingredients",
  "activeIngredients",
  "uses",
  "directions",
  "warnings",
  "advantages",
];
const MAX_GALLERY_IMAGES = 3;
const MAX_SINGLE_PRODUCTION_BYTES = 1024 * 1024;
const TARGET_PRODUCTION_BYTES = 6 * 1024 * 1024;
const MAX_PRODUCTION_BYTES = 6.5 * 1024 * 1024;

function normalizePath(value) {
  return value.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
}

function isForbiddenPath(value) {
  return (
    /^[a-zA-Z]:[\\/]/.test(value) ||
    /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(value) ||
    /^file:/i.test(value)
  );
}

function projectRelativePath(value, expectedRoot) {
  if (typeof value !== "string" || isForbiddenPath(value)) {
    return null;
  }

  const normalized = normalizePath(value).replace(/^\/+/, "");
  const rootWithoutSrc = expectedRoot.replace(/^src\//, "");

  if (normalized.startsWith(expectedRoot)) {
    return normalized;
  }

  if (normalized.startsWith(rootWithoutSrc)) {
    return `src/${normalized}`;
  }

  return null;
}

function toProjectFilePath(value, expectedRoot) {
  const relativePath = projectRelativePath(value, expectedRoot);
  return relativePath
    ? join(PROJECT_ROOT, ...relativePath.split("/"))
    : null;
}

async function fileExists(filePath) {
  if (!filePath) {
    return false;
  }

  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function listImageFiles(directory) {
  const files = [];

  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listImageFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      const fileStats = await stat(entryPath);
      files.push({
        bytes: fileStats.size,
        path: normalizePath(relative(PROJECT_ROOT, entryPath)),
      });
    }
  }

  return files;
}

function printList(label, values) {
  console.log(`${label}: ${values.length ? values.join(", ") : "None"}`);
}

function formatMiB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

function collectLargestFile(files) {
  return [...files].sort((left, right) => right.bytes - left.bytes)[0] ?? null;
}

function validateSnapshotProducts(products, failures) {
  const ids = products.map((product) => product.id);
  const duplicateIds = [
    ...new Set(ids.filter((id, index) => ids.indexOf(id) !== index)),
  ];
  const categories = [
    ...new Set(
      products
        .flatMap((product) =>
          Array.isArray(product.categories)
            ? product.categories
            : [product.category]
        )
        .filter((category) => typeof category === "string")
        .map((category) => category.trim())
        .filter(Boolean)
    ),
  ].sort((left, right) => left.localeCompare(right, "vi"));

  if (!products.length) {
    failures.push("product count is zero");
  }

  if (duplicateIds.length) {
    failures.push(`duplicate product ids: ${duplicateIds.join(", ")}`);
  }

  for (const product of products) {
    if (!product.id || !product.name?.trim()) {
      failures.push(`missing id or name: ${product.id ?? "unknown"}`);
    }

    if (
      typeof product.id !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id)
    ) {
      failures.push(`${product.id ?? "unknown"}: id is not URL-safe`);
    }

    for (const field of ["sourceUrl", "canonicalUrl"]) {
      try {
        const url = new URL(product[field]);
        if (url.protocol !== "https:") {
          failures.push(`${product.id}: ${field} is not https`);
        }
      } catch {
        failures.push(`${product.id}: invalid ${field}`);
      }
    }

    if (product.price !== null && typeof product.price !== "number") {
      failures.push(`${product.id}: price is not number|null`);
    }

    for (const field of ARRAY_FIELDS) {
      if (!Array.isArray(product[field])) {
        failures.push(`${product.id}: ${field} is not an array`);
      } else if (product[field].some((value) => typeof value !== "string")) {
        failures.push(`${product.id}: ${field} contains a non-string value`);
      }
    }

    if (product.image !== null && typeof product.image !== "string") {
      failures.push(`${product.id}: image is not string|null`);
    }

    for (const field of RICH_FIELDS) {
      if (
        product[field] !== null &&
        typeof product[field] !== "string" &&
        !Array.isArray(product[field])
      ) {
        failures.push(`${product.id}: invalid ${field} type`);
      }
    }
  }

  return { duplicateIds, categories };
}

async function validateRawAssets(products, failures) {
  const galleryEntries = products.flatMap((product) =>
    Array.isArray(product.galleryImages)
      ? product.galleryImages.map((path) => ({ path, product: product.id }))
      : []
  );
  const mainEntries = products
    .filter((product) => typeof product.image === "string" && product.image)
    .map((product) => ({ path: product.image, product: product.id }));
  const missingMainAssets = [];
  const missingGalleryAssets = [];

  for (const entry of mainEntries) {
    const filePath = toProjectFilePath(entry.path, RAW_ROOT);
    if (!filePath) {
      failures.push(`${entry.product}: invalid raw main image path`);
      missingMainAssets.push(entry.path);
      continue;
    }

    if (!(await fileExists(filePath))) {
      missingMainAssets.push(entry.path);
    }
  }

  for (const entry of galleryEntries) {
    const filePath = toProjectFilePath(entry.path, RAW_ROOT);
    if (!filePath) {
      failures.push(`${entry.product}: invalid raw gallery image path`);
      missingGalleryAssets.push(entry.path);
      continue;
    }

    if (!(await fileExists(filePath))) {
      missingGalleryAssets.push(entry.path);
    }
  }

  return {
    galleryEntries,
    mainEntries,
    missingMainAssets,
    missingGalleryAssets,
  };
}

async function validateProductionAssets(products, manifest, failures) {
  const entries = Array.isArray(manifest?.products) ? manifest.products : [];
  const entriesById = new Map();
  const productionPaths = new Set();
  const missingMainAssets = [];
  const missingGalleryAssets = [];
  const productionMainEntries = [];
  const productionGalleryEntries = [];

  if (manifest?.productionRoot !== PRODUCTION_ROOT) {
    failures.push(`manifest productionRoot must be ${PRODUCTION_ROOT}`);
  }

  for (const entry of entries) {
    if (!entry?.id || entriesById.has(entry.id)) {
      failures.push(
        `invalid or duplicate production manifest id: ${entry?.id ?? "unknown"}`
      );
      continue;
    }
    entriesById.set(entry.id, entry);
  }

  for (const product of products) {
    const entry = entriesById.get(product.id);
    if (!entry) {
      failures.push(`${product.id}: missing production asset manifest entry`);
      continue;
    }

    const mainPath = toProjectFilePath(entry.main, PRODUCTION_ROOT);
    const mainEntry = { path: entry.main, product: product.id };
    productionMainEntries.push(mainEntry);
    if (!mainPath) {
      failures.push(`${product.id}: invalid production main image path`);
      missingMainAssets.push(entry.main);
    } else {
      productionPaths.add(mainPath);
      if (!(await fileExists(mainPath))) {
        missingMainAssets.push(entry.main);
      }
    }

    if (!Array.isArray(entry.gallery)) {
      failures.push(`${product.id}: production gallery is not an array`);
      continue;
    }

    if (entry.gallery.length > MAX_GALLERY_IMAGES) {
      failures.push(
        `${product.id}: production gallery has ${entry.gallery.length} images (max ${MAX_GALLERY_IMAGES})`
      );
    }

    if (
      !Array.isArray(entry.sourceGallery) ||
      entry.sourceGallery.length !== entry.gallery.length
    ) {
      failures.push(`${product.id}: sourceGallery and gallery lengths do not match`);
    }

    entry.gallery.forEach((path) => {
      productionGalleryEntries.push({ path, product: product.id });
    });
    for (const galleryPath of entry.gallery) {
      const galleryFilePath = toProjectFilePath(
        galleryPath,
        PRODUCTION_ROOT
      );
      if (!galleryFilePath) {
        failures.push(`${product.id}: invalid production gallery image path`);
        missingGalleryAssets.push(galleryPath);
        continue;
      }

      productionPaths.add(galleryFilePath);
      if (!(await fileExists(galleryFilePath))) {
        missingGalleryAssets.push(galleryPath);
      }
    }

    if (!toProjectFilePath(entry.sourceMain, RAW_ROOT)) {
      failures.push(`${product.id}: invalid sourceMain path in manifest`);
    }
    if (
      Array.isArray(entry.sourceGallery) &&
      entry.sourceGallery.some((path) => !toProjectFilePath(path, RAW_ROOT))
    ) {
      failures.push(`${product.id}: invalid sourceGallery path in manifest`);
    }
  }

  for (const productId of entriesById.keys()) {
    if (!products.some((product) => product.id === productId)) {
      failures.push(`${productId}: production manifest has no matching product`);
    }
  }

  if (
    productionPaths.size !==
    productionMainEntries.length + productionGalleryEntries.length
  ) {
    failures.push("production manifest contains duplicate asset paths");
  }

  const productionFiles = await listImageFiles(PRODUCTION_PRODUCTS_DIR);
  const totalBytes = productionFiles.reduce((total, file) => total + file.bytes, 0);
  const largestFile = collectLargestFile(productionFiles);

  if (totalBytes > MAX_PRODUCTION_BYTES) {
    failures.push(
      `production assets exceed 6.5 MiB: ${formatMiB(totalBytes)}`
    );
  }

  if (largestFile && largestFile.bytes > MAX_SINGLE_PRODUCTION_BYTES) {
    failures.push(
      `largest production file exceeds 1 MiB: ${largestFile.path} (${largestFile.bytes} bytes)`
    );
  }

  return {
    missingMainAssets,
    missingGalleryAssets,
    productionFiles,
    totalBytes,
    largestFile,
    productionMainEntries,
    productionGalleryEntries,
  };
}

async function main() {
  const failures = [];
  const snapshot = JSON.parse(await readFile(SNAPSHOT_PATH, "utf8"));
  const manifest = JSON.parse(await readFile(ASSET_MANIFEST_PATH, "utf8"));
  const products = Array.isArray(snapshot.products) ? snapshot.products : [];
  const { duplicateIds, categories } = validateSnapshotProducts(
    products,
    failures
  );
  const raw = await validateRawAssets(products, failures);
  const production = await validateProductionAssets(
    products,
    manifest,
    failures
  );
  const rawFiles = await listImageFiles(RAW_PRODUCTS_DIR);
  const rawTotalBytes = rawFiles.reduce((total, file) => total + file.bytes, 0);
  const rawLargestFile = collectLargestFile(rawFiles);

  console.log(`Products loaded: ${products.length}`);
  console.log(
    `Raw main images resolved: ${raw.mainEntries.length - raw.missingMainAssets.length}`
  );
  console.log(`Raw gallery entries: ${raw.galleryEntries.length}`);
  console.log(
    `Raw gallery images resolved: ${raw.galleryEntries.length - raw.missingGalleryAssets.length}`
  );
  console.log(
    `Production main images resolved: ${production.productionMainEntries.length - production.missingMainAssets.length}`
  );
  console.log(
    `Production gallery entries: ${production.productionGalleryEntries.length}`
  );
  console.log(
    `Production gallery images resolved: ${production.productionGalleryEntries.length - production.missingGalleryAssets.length}`
  );
  printList("Missing raw main assets", raw.missingMainAssets);
  printList("Missing raw gallery assets", raw.missingGalleryAssets);
  printList("Missing production main assets", production.missingMainAssets);
  printList(
    "Missing production gallery assets",
    production.missingGalleryAssets
  );
  printList("Duplicate product IDs", duplicateIds);
  console.log("Categories: " + (categories.length ? categories.join(" | ") : "None"));
  console.log(
    "Products with registration number: " +
      products.filter((product) => Boolean(product.registrationNumber)).length
  );
  console.log(
    "Products with ingredients: " +
      products.filter((product) =>
        Boolean(product.ingredients || product.activeIngredients)
      ).length
  );
  console.log(
    "Products with uses: " + products.filter((product) => Boolean(product.uses)).length
  );
  console.log(
    "Products with directions: " +
      products.filter((product) => Boolean(product.directions)).length
  );
  console.log(
    "Products with warnings: " +
      products.filter((product) => Boolean(product.warnings)).length
  );

  console.log("\nRAW:");
  console.log(`- file count: ${rawFiles.length}`);
  console.log(`- total: ${formatMiB(rawTotalBytes)}`);
  console.log(
    `- largest: ${rawLargestFile?.path ?? "None"} (${rawLargestFile ? formatMiB(rawLargestFile.bytes) : "0 B"})`
  );

  console.log("\nPRODUCTION:");
  console.log(`- file count: ${production.productionFiles.length}`);
  console.log(`- total: ${formatMiB(production.totalBytes)}`);
  console.log(
    `- largest: ${production.largestFile?.path ?? "None"} (${production.largestFile ? formatMiB(production.largestFile.bytes) : "0 B"})`
  );
  console.log(
    `- target <= 6 MiB: ${production.totalBytes <= TARGET_PRODUCTION_BYTES ? "PASS" : "WARN"}`
  );

  console.log("\nValidation:");
  if (failures.length) {
    console.log("FAIL");
    for (const failure of failures) {
      console.log("- " + failure);
    }
    process.exitCode = 1;
  } else {
    console.log("PASS");
  }
}

main().catch((error) => {
  console.error("Validation failed: " + error.message);
  process.exitCode = 1;
});
