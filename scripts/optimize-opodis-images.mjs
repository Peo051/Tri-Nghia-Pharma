import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const SNAPSHOT_PATH = join(
  PROJECT_ROOT,
  "src",
  "data",
  "opodis-products.json"
);
const RAW_PRODUCTS_DIR = join(PROJECT_ROOT, "src", "static", "products");
const PRODUCTION_PRODUCTS_DIR = join(
  PROJECT_ROOT,
  "src",
  "static",
  "products-app"
);
const MANIFEST_PATH = join(
  PROJECT_ROOT,
  "src",
  "data",
  "opodis-assets.json"
);

const MAX_GALLERY_IMAGES = 3;
const MAX_SINGLE_FILE_BYTES = 1024 * 1024;
const TARGET_TOTAL_BYTES = 6 * 1024 * 1024;
const MAX_TOTAL_BYTES = 6.5 * 1024 * 1024;

// These per-file targets leave enough room for the complete production tree to
// stay below the 6 MiB target even when every product has three gallery files.
const MAIN_TARGET_BYTES = 96 * 1024;
const GALLERY_TARGET_BYTES = 52 * 1024;

const PYTHON_PROCESSOR = String.raw`
import json
import os
import sys
from io import BytesIO

from PIL import Image, ImageOps


QUALITY_STEPS = (84, 78, 72, 66, 60, 54, 48, 42, 36, 30)


def resize_without_upscale(image, max_dimension):
    width, height = image.size
    current_max = max(width, height)
    if current_max <= max_dimension:
        return image

    scale = max_dimension / current_max
    size = (
        max(1, round(width * scale)),
        max(1, round(height * scale)),
    )
    return image.resize(size, Image.Resampling.LANCZOS)


def encode_webp(image, quality):
    buffer = BytesIO()
    image.save(
        buffer,
        format="WEBP",
        quality=quality,
        method=6,
        exact=True,
    )
    return buffer.getvalue()


def optimize_image(job):
    source_path = job["sourcePath"]
    output_path = job["outputPath"]
    target_bytes = job["targetBytes"]
    max_dimension = job["maxDimension"]

    with Image.open(source_path) as source:
        image = ImageOps.exif_transpose(source)
        image.load()
        has_alpha = "A" in image.getbands()
        image = image.convert("RGBA" if has_alpha else "RGB")

        best_data = None
        best_quality = None
        best_image = image

        for _ in range(10):
            for quality in QUALITY_STEPS:
                data = encode_webp(image, quality)
                if best_data is None or len(data) < len(best_data):
                    best_data = data
                    best_quality = quality
                    best_image = image

                if len(data) <= target_bytes:
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    with open(output_path, "wb") as output:
                        output.write(data)
                    return {
                        "bytes": len(data),
                        "width": image.width,
                        "height": image.height,
                        "quality": quality,
                        "targetBytes": target_bytes,
                    }

            current_max = max(image.size)
            if current_max <= 320:
                break

            next_max = max(320, round(current_max * 0.82))
            if next_max >= current_max:
                break
            image = resize_without_upscale(image, next_max)

        if best_data is None:
            raise RuntimeError("Pillow did not produce an encoded image")

        if len(best_data) > 1024 * 1024:
            raise RuntimeError(
                f"Could not reduce image below 1 MiB: {source_path} ({len(best_data)} bytes)"
            )

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "wb") as output:
            output.write(best_data)

        return {
            "bytes": len(best_data),
            "width": best_image.width,
            "height": best_image.height,
            "quality": best_quality,
            "targetBytes": target_bytes,
            "targetMiss": True,
        }


def main():
    jobs = json.load(sys.stdin)
    results = []
    for job in jobs:
        result = optimize_image(job)
        results.append({"id": job["id"], "role": job["role"], **result})
    print(json.dumps(results))


if __name__ == "__main__":
    main()
`;

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

function normalizePath(value) {
  return value.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
}

function toRawRelativePath(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = normalizePath(value).replace(/^\/+/, "");
  if (normalized.startsWith("src/static/products/")) {
    return normalized;
  }

  if (normalized.startsWith("static/products/")) {
    return `src/${normalized}`;
  }

  return null;
}

function toProductionRelativePath(productId, fileName) {
  return `src/static/products-app/${productId}/${fileName}`;
}

async function fileExists(filePath) {
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

function formatMiB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

function runPython(command, args, jobs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, [...args, "-c", PYTHON_PROCESSOR], {
      cwd: PROJECT_ROOT,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.once("error", reject);
    child.once("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `${command} Pillow processor failed with code ${code}: ${
              stderr.trim() || stdout.trim() || "unknown error"
            }`
          )
        );
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(
          new Error(
            `Could not parse Pillow processor output: ${error.message}`
          )
        );
      }
    });

    child.stdin.end(JSON.stringify(jobs));
  });
}

async function processWithPillow(jobs) {
  const candidates =
    process.platform === "win32"
      ? [
          { command: "python", args: [] },
          { command: "py", args: ["-3"] },
        ]
      : [
          { command: "python3", args: [] },
          { command: "python", args: [] },
        ];
  let lastError;

  for (const candidate of candidates) {
    try {
      return await runPython(candidate.command, candidate.args, jobs);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Python with Pillow was not found");
}

async function main() {
  const snapshot = JSON.parse(await readFile(SNAPSHOT_PATH, "utf8"));
  const products = Array.isArray(snapshot.products) ? snapshot.products : [];

  if (!products.length) {
    throw new Error("No products found in the Opodis snapshot");
  }

  const rawFiles = await listImageFiles(RAW_PRODUCTS_DIR);
  const rawTotalBytes = rawFiles.reduce((total, file) => total + file.bytes, 0);
  const jobs = [];
  const manifestProducts = [];

  for (const product of products) {
    const sourceMain = toRawRelativePath(product.image);
    if (!sourceMain) {
      throw new Error(`${product.id}: missing or invalid main image path`);
    }

    const gallerySources = [
      ...(Array.isArray(product.galleryImages) ? product.galleryImages : []),
    ]
      .map(toRawRelativePath)
      .filter((path) => path && path !== sourceMain);
    const uniqueGallerySources = [...new Set(gallerySources)].slice(
      0,
      MAX_GALLERY_IMAGES
    );
    const sourcePaths = [sourceMain, ...uniqueGallerySources];

    for (const sourcePath of sourcePaths) {
      if (!(await fileExists(join(PROJECT_ROOT, ...sourcePath.split("/")))) ) {
        throw new Error(`${product.id}: raw asset does not exist: ${sourcePath}`);
      }
    }

    const mainPath = toProductionRelativePath(product.id, "main.webp");
    const galleryPaths = uniqueGallerySources.map((_, index) =>
      toProductionRelativePath(
        product.id,
        `${String(index + 1).padStart(2, "0")}.webp`
      )
    );

    jobs.push({
      id: product.id,
      role: "main",
      sourcePath: join(PROJECT_ROOT, ...sourceMain.split("/")),
      outputPath: join(PROJECT_ROOT, ...mainPath.split("/")),
      targetBytes: MAIN_TARGET_BYTES,
      maxDimension: 1400,
    });
    uniqueGallerySources.forEach((sourcePath, index) => {
      jobs.push({
        id: product.id,
        role: "gallery",
        sourcePath: join(PROJECT_ROOT, ...sourcePath.split("/")),
        outputPath: join(
          PROJECT_ROOT,
          ...galleryPaths[index].split("/")
        ),
        targetBytes: GALLERY_TARGET_BYTES,
        maxDimension: 1000,
      });
    });

    manifestProducts.push({
      id: product.id,
      sourceMain,
      sourceGallery: uniqueGallerySources,
      main: mainPath,
      gallery: galleryPaths,
    });
  }

  await rm(PRODUCTION_PRODUCTS_DIR, { recursive: true, force: true });
  await mkdir(PRODUCTION_PRODUCTS_DIR, { recursive: true });

  const results = await processWithPillow(jobs);
  const productionFiles = await listImageFiles(PRODUCTION_PRODUCTS_DIR);
  const productionTotalBytes = productionFiles.reduce(
    (total, file) => total + file.bytes,
    0
  );
  const largestProductionFile = [...productionFiles].sort(
    (left, right) => right.bytes - left.bytes
  )[0];
  const targetMisses = results.filter((result) => result.targetMiss);

  if (targetMisses.length) {
    console.warn(
      `Warning: ${targetMisses.length} image(s) could not reach their role target.`
    );
  }

  if (largestProductionFile?.bytes > MAX_SINGLE_FILE_BYTES) {
    throw new Error(
      `Production file exceeds 1 MiB: ${largestProductionFile.path} (${largestProductionFile.bytes} bytes)`
    );
  }

  if (productionTotalBytes > MAX_TOTAL_BYTES) {
    throw new Error(
      `Production assets exceed 6.5 MiB: ${formatMiB(productionTotalBytes)}`
    );
  }

  const manifest = {
    source: "https://opodispharma.com/",
    generatedAt: new Date().toISOString(),
    rawArchive: "src/static/products/",
    productionRoot: "src/static/products-app/",
    products: manifestProducts,
  };
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log("Pillow processor: PASS");
  console.log(`Products processed: ${products.length}`);
  console.log(`Raw files: ${rawFiles.length}`);
  console.log(`Raw total: ${formatMiB(rawTotalBytes)}`);
  console.log(`Production files: ${productionFiles.length}`);
  console.log(`Production total: ${formatMiB(productionTotalBytes)}`);
  console.log(
    `Reduction: ${((1 - productionTotalBytes / rawTotalBytes) * 100).toFixed(2)}%`
  );
  console.log(
    `Largest production file: ${largestProductionFile?.path ?? "None"} (${largestProductionFile ? formatMiB(largestProductionFile.bytes) : "0 B"})`
  );
  console.log(
    `Target total <= 6 MiB: ${productionTotalBytes <= TARGET_TOTAL_BYTES ? "PASS" : "WARN"}`
  );
}

main().catch((error) => {
  console.error(`Image optimization failed: ${error.message}`);
  process.exitCode = 1;
});
