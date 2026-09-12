import opodisAssetManifest from "@/data/opodis-assets.json";

const productAssetModules = import.meta.glob(
  "../static/products-app/**/*.{webp,jpg,jpeg,png,avif,gif,svg}",
  {
    eager: true,
    import: "default",
    query: "?url",
  }
) as Record<string, string>;

interface AssetManifestProduct {
  sourceMain: string;
  sourceGallery: string[];
  main: string;
  gallery: string[];
}

interface AssetManifest {
  products: AssetManifestProduct[];
}

function normalizeAssetPath(value: string, marker: string): string | null {
  const trimmed = value.trim();

  if (
    !trimmed ||
    /^[a-zA-Z]:[\\/]/.test(trimmed) ||
    /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(trimmed)
  ) {
    return null;
  }

  const normalized = trimmed
    .replace(/\\/g, "/")
    .replace(/\/{2,}/g, "/");
  const markerIndex = normalized.indexOf(marker);

  if (markerIndex < 0) {
    return null;
  }

  return normalized.slice(markerIndex);
}

const productAssetsByPath = new Map<string, string>();
const sourceToProductionPath = new Map<string, string>();

const assetManifest = opodisAssetManifest as AssetManifest;

for (const product of assetManifest.products) {
  const sourcePaths = [product.sourceMain, ...product.sourceGallery];
  const productionPaths = [product.main, ...product.gallery];

  sourcePaths.forEach((sourcePath, index) => {
    const normalizedSourcePath = normalizeAssetPath(
      sourcePath,
      "static/products/"
    );
    const normalizedProductionPath = normalizeAssetPath(
      productionPaths[index] ?? "",
      "static/products-app/"
    );

    if (normalizedSourcePath && normalizedProductionPath) {
      sourceToProductionPath.set(
        normalizedSourcePath,
        normalizedProductionPath
      );
    }
  });
}

for (const [path, url] of Object.entries(productAssetModules)) {
  const normalizedPath = normalizeAssetPath(path, "static/products-app/");
  if (normalizedPath) {
    productAssetsByPath.set(normalizedPath, url);
  }
}

const reportedMissingAssets = new Set<string>();

function reportMissingAsset(path: string) {
  if (reportedMissingAssets.has(path)) {
    return;
  }

  reportedMissingAssets.add(path);
  console.warn(`[product-assets] Missing local asset: ${path}`);
}

function resolveAsset(path: string): string | null {
  if (typeof path !== "string") {
    return null;
  }

  const normalizedProductionPath = normalizeAssetPath(
    path,
    "static/products-app/"
  );
  const normalizedSourcePath = normalizeAssetPath(
    path,
    "static/products/"
  );
  const productionPath =
    normalizedProductionPath ??
    (normalizedSourcePath
      ? sourceToProductionPath.get(normalizedSourcePath) ?? null
      : null);

  // Raw gallery entries beyond the three selected production images are
  // intentionally omitted from the app bundle, so they are not missing
  // runtime assets and should not produce warnings.
  if (!productionPath) {
    return null;
  }

  const resolved = productAssetsByPath.get(productionPath) ?? null;

  if (!resolved) {
    reportMissingAsset(path);
  }

  return resolved;
}

export function resolveProductAsset(path: string): string | null {
  return resolveAsset(path);
}

export function resolveProductGallery(paths: string[]): string[] {
  if (!Array.isArray(paths)) {
    return [];
  }

  const resolved = paths
    .map((path) => resolveAsset(path))
    .filter((url): url is string => Boolean(url));

  return [...new Set(resolved)];
}
