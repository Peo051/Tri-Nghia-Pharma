const productAssetModules = import.meta.glob(
  "../static/products/**/*.{jpg,jpeg,png,webp,avif,gif,svg}",
  {
    eager: true,
    import: "default",
    query: "?url",
  }
) as Record<string, string>;

function normalizeAssetPath(value: string): string | null {
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
  const marker = "static/products/";
  const markerIndex = normalized.indexOf(marker);

  if (markerIndex < 0) {
    return null;
  }

  return normalized.slice(markerIndex);
}

const productAssetsByPath = new Map<string, string>();

for (const [path, url] of Object.entries(productAssetModules)) {
  const normalizedPath = normalizeAssetPath(path);
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

  const normalizedPath = normalizeAssetPath(path);
  const resolved = normalizedPath
    ? productAssetsByPath.get(normalizedPath) ?? null
    : null;

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
