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
const PRODUCTS_DIR = join(PROJECT_ROOT, "src", "static", "products");
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

function snapshotFilePath(value) {
  if (typeof value !== "string" || isForbiddenPath(value)) {
    return null;
  }

  const normalized = normalizePath(value).replace(/^\/+/, "");
  const relativePath = normalized.startsWith("src/")
    ? normalized
    : normalized.startsWith("static/")
      ? `src/${normalized}`
      : null;

  if (!relativePath?.startsWith("src/static/products/")) {
    return null;
  }

  return join(PROJECT_ROOT, ...relativePath.split("/"));
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

  for (const entry of await readdir(directory, { withFileTypes: true })) {
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

async function main() {
  const snapshot = JSON.parse(await readFile(SNAPSHOT_PATH, "utf8"));
  const products = Array.isArray(snapshot.products) ? snapshot.products : [];
  const failures = [];
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
  const galleryEntries = products.flatMap((product) =>
    Array.isArray(product.galleryImages)
      ? product.galleryImages.map((path) => ({ path, product: product.id }))
      : []
  );
  const mainEntries = products
    .filter((product) => typeof product.image === "string" && product.image)
    .map((product) => ({ path: product.image, product: product.id }));
  const missingGalleryAssets = [];
  const missingMainAssets = [];

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

    if (typeof product.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id)) {
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

  for (const entry of mainEntries) {
    if (isForbiddenPath(entry.path) || !snapshotFilePath(entry.path)) {
      failures.push(`${entry.product}: invalid main image path`);
      missingMainAssets.push(entry.path);
      continue;
    }

    if (!(await fileExists(snapshotFilePath(entry.path)))) {
      missingMainAssets.push(entry.path);
    }
  }

  for (const entry of galleryEntries) {
    if (isForbiddenPath(entry.path) || !snapshotFilePath(entry.path)) {
      failures.push(`${entry.product}: invalid gallery image path`);
      missingGalleryAssets.push(entry.path);
      continue;
    }

    if (!(await fileExists(snapshotFilePath(entry.path)))) {
      missingGalleryAssets.push(entry.path);
    }
  }

  const imageFiles = await listImageFiles(PRODUCTS_DIR);
  const totalBytes = imageFiles.reduce((total, file) => total + file.bytes, 0);
  const largestFiles = [...imageFiles]
    .sort((left, right) => right.bytes - left.bytes)
    .slice(0, 10);

  console.log("Products loaded: " + products.length);
  console.log(
    "Main images resolved: " + (mainEntries.length - missingMainAssets.length)
  );
  console.log("Gallery images in snapshot: " + galleryEntries.length);
  console.log(
    "Gallery images resolved: " +
      (galleryEntries.length - missingGalleryAssets.length)
  );
  printList("Missing main assets", missingMainAssets);
  printList("Missing gallery assets", missingGalleryAssets);
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
  console.log("\nAsset size:");
  console.log("Total image files: " + imageFiles.length);
  console.log("Total MB: " + (totalBytes / (1024 * 1024)).toFixed(2));
  console.log(
    "Average bytes/image: " +
      (imageFiles.length ? Math.round(totalBytes / imageFiles.length) : 0)
  );
  console.log("Largest files:");
  for (const file of largestFiles) {
    console.log(`- ${file.path}: ${file.bytes} bytes`);
  }

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
