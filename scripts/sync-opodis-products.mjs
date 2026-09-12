import { mkdir, rm, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const SOURCE_ROOT = "https://opodispharma.com/";
const SHOP_URL = "https://opodispharma.com/index.php/shop/";
const OUTPUT_PATH = join(PROJECT_ROOT, "src", "data", "opodis-products.json");
const PRODUCTS_DIR = join(PROJECT_ROOT, "src", "static", "products");

const MAX_CONCURRENCY = 3;
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 15_000;
const BATCH_DELAY_MS = 250;
const SITE_HOSTS = new Set(["opodispharma.com", "www.opodispharma.com"]);
const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

const FIELD_LABELS = {
  ingredients: ["Thành phần"],
  activeIngredients: ["Thành phần có hoạt tính"],
  volume: ["Dung tích"],
  packaging: [
    "Quy cách đóng gói",
    "Quy cách sản phẩm",
    "Quy cách",
    "Đóng gói",
  ],
  uses: ["Công dụng"],
  directions: ["Hướng dẫn sử dụng", "Cách dùng"],
  warnings: ["Lưu ý"],
  advantages: ["Ưu điểm", "ƯU ĐIỂM CỦA SẢN PHẨM"],
  registrationNumber: ["Số CBMP", "CBMP", "Số ĐK", "SĐK"],
};

const ALL_FIELD_LABELS = Object.values(FIELD_LABELS)
  .flat()
  .sort((left, right) => right.length - left.length);

// Some product pages expose only WooCommerce taxonomy slugs on the product
// element while the breadcrumb contains the generic "Sản phẩm" label. These
// labels are the public taxonomy names used by the site for those slugs.
const CATEGORY_LABELS = new Map([
  ["san-pham", "Sản phẩm"],
  ["cham-soc-gia-dinh", "CHĂM SÓC GIA ĐÌNH"],
  ["cham-soc-me-va-be", "CHĂM SÓC MẸ VÀ BÉ"],
  ["tinh-dau", "TINH DẦU"],
  ["khu-khuan-sat-khuan", "KHỬ KHUẨN – SÁT KHUẨN"],
  ["khu-khuan-sat-khuan-tay", "KHỬ KHUẨN - SÁT KHUẨN TAY"],
  ["khu-khuan-sat-khuan-be-mat", "KHỬ KHUẨN - SÁT KHUẨN BỀ MẶT"],
]);

const REQUEST_HEADERS = {
  Accept: "text/html",
  "User-Agent": "Mozilla/5.0",
};

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
}

function decodeHtml(value) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    nbsp: " ",
    ndash: "–",
    laquo: "«",
    lt: "<",
    mdash: "—",
    quot: '"',
    rdquo: "”",
    reg: "®",
    rsquo: "’",
    trade: "™",
  };

  return value
    .replace(/&#x([0-9a-f]+);/gi, (match, code) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replace(/&#([0-9]+);/g, (match, code) =>
      String.fromCodePoint(Number.parseInt(code, 10))
    )
    .replace(
      /&([a-z]+);/gi,
      (match, name) => namedEntities[name.toLowerCase()] ?? match
    );
}

function normalizeText(value) {
  return decodeHtml(value)
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function textFromHtml(value) {
  return normalizeText(
    value
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<(br|hr)\b[^>]*>/gi, "\n")
      .replace(
        /<\/(article|dd|div|h[1-6]|li|ol|p|section|td|th|tr|ul)>/gi,
        "\n"
      )
      .replace(/<li\b[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  );
}

function cleanInlineText(value) {
  return textFromHtml(value).replace(/\s+/g, " ").trim();
}

function getAttribute(attributes, name) {
  const pattern = new RegExp(
    "\\b" +
      escapeRegExp(name) +
      "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))",
    "i"
  );
  const match = attributes.match(pattern);
  return decodeHtml(match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim() || null;
}

function getClassName(attributes) {
  return getAttribute(attributes, "class") ?? "";
}

function hasClass(attributes, className) {
  return getClassName(attributes)
    .split(/\s+/)
    .some((value) => value === className);
}

function extractTagContents(html, tagName) {
  const pattern = new RegExp(
    "<" + tagName + "\\b[^>]*>([\\s\\S]*?)<\\/" + tagName + ">",
    "gi"
  );
  return [...html.matchAll(pattern)].map((match) => ({
    attributes: match[0].slice(0, match[0].indexOf(">") + 1),
    content: match[1],
    index: match.index ?? 0,
  }));
}

function extractMatchingBlock(html, openingMatch) {
  const tagName = openingMatch[1];
  const openingEnd = (openingMatch.index ?? 0) + openingMatch[0].length;
  const tokenPattern = new RegExp("<\\/?"+ tagName + "\\b[^>]*>", "gi");
  tokenPattern.lastIndex = openingEnd;

  let depth = 1;
  let tokenMatch;

  while ((tokenMatch = tokenPattern.exec(html))) {
    const token = tokenMatch[0];
    if (/^<\//.test(token)) {
      depth -= 1;
    } else if (!/\/>$/.test(token)) {
      depth += 1;
    }

    if (depth === 0) {
      return html.slice(openingEnd, tokenMatch.index);
    }
  }

  return html.slice(openingEnd);
}

function extractBlocks(html, predicate) {
  const openingPattern = /<([a-z][\w:-]*)\b([^>]*)>/gi;
  const blocks = [];
  let openingMatch;

  while ((openingMatch = openingPattern.exec(html))) {
    const attributes = openingMatch[2];
    if (openingMatch[0].endsWith("/>") || !predicate(openingMatch[1], attributes)) {
      continue;
    }

    blocks.push({
      attributes,
      content: extractMatchingBlock(html, openingMatch),
      index: openingMatch.index ?? 0,
      tagName: openingMatch[1],
    });
  }

  return blocks;
}

function extractClassBlocks(html, classNames) {
  return extractBlocks(html, (tagName, attributes) =>
    classNames.some((className) => hasClass(attributes, className))
  );
}

function extractIdBlocks(html, ids) {
  return extractBlocks(html, (tagName, attributes) =>
    ids.includes(getAttribute(attributes, "id") ?? "")
  );
}

function extractMetaContent(html, names) {
  const wantedNames = new Set(names.map((name) => name.toLowerCase()));
  const tags = [...html.matchAll(/<meta\b([^>]*)>/gi)];

  for (const tag of tags) {
    const attributes = tag[1];
    const name = (
      getAttribute(attributes, "name") ??
      getAttribute(attributes, "property") ??
      getAttribute(attributes, "itemprop") ??
      ""
    ).toLowerCase();

    if (wantedNames.has(name)) {
      return getAttribute(attributes, "content");
    }
  }

  return null;
}

function normalizeSiteUrl(rawUrl, baseUrl) {
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(decodeHtml(rawUrl), baseUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function isAllowedSiteUrl(url) {
  try {
    return SITE_HOSTS.has(new URL(url).hostname.toLowerCase());
  } catch {
    return false;
  }
}

function normalizeProductUrl(rawUrl, baseUrl) {
  const url = normalizeSiteUrl(rawUrl, baseUrl);
  if (!url || !isAllowedSiteUrl(url)) {
    return null;
  }

  const parsed = new URL(url);
  if (!/^\/index\.php\/product\/[^/]+\/?$/i.test(parsed.pathname)) {
    return null;
  }

  parsed.search = "";
  parsed.pathname = parsed.pathname.replace(/\/+$/, "") + "/";
  return parsed.href;
}

function getProductId(productUrl) {
  const segments = new URL(productUrl).pathname.split("/").filter(Boolean);
  const productIndex = segments.findIndex(
    (segment) => segment.toLowerCase() === "product"
  );
  const sourceSlug = decodeURIComponent(
    segments[productIndex + 1] ?? ""
  ).toLowerCase();

  return sourceSlug
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isShopPageUrl(rawUrl, baseUrl) {
  const normalized = normalizeSiteUrl(rawUrl, baseUrl);
  if (!normalized || !isAllowedSiteUrl(normalized)) {
    return false;
  }

  const url = new URL(normalized);
  const path = url.pathname.replace(/\/+$/, "") + "/";
  if (path === "/index.php/shop/") {
    return true;
  }

  if (/^\/index\.php\/shop\/page\/\d+\/$/i.test(path)) {
    return true;
  }

  return ["page", "paged", "product-page"].some((key) =>
    url.searchParams.has(key)
  );
}

function extractAnchorLinks(html, baseUrl) {
  return [...html.matchAll(/<a\b([^>]*)>/gi)]
    .map((match) => normalizeSiteUrl(getAttribute(match[1], "href"), baseUrl))
    .filter(Boolean);
}

function extractProductLinks(html, baseUrl) {
  return [
    ...new Set(
      extractAnchorLinks(html, baseUrl)
        .map((url) => normalizeProductUrl(url, baseUrl))
        .filter(Boolean)
    ),
  ];
}

function extractPaginationLinks(html, baseUrl) {
  return [
    ...new Set(
      extractAnchorLinks(html, baseUrl).filter((url) =>
        isShopPageUrl(url, baseUrl)
      )
    ),
  ];
}

function extractAnchorLinksWithText(html, baseUrl) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      href: normalizeSiteUrl(getAttribute(match[1], "href"), baseUrl),
      text: cleanInlineText(match[2]),
    }))
    .filter((anchor) => anchor.href && anchor.text);
}

function parseJsonLd(html) {
  const values = [];
  const scripts = extractTagContents(html, "script");

  for (const script of scripts) {
    if (
      !/application\/ld\+json/i.test(script.attributes) ||
      !script.content.trim()
    ) {
      continue;
    }

    try {
      const parsed = JSON.parse(script.content.trim());
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      for (const entry of entries) {
        if (entry?.["@graph"] && Array.isArray(entry["@graph"])) {
          values.push(...entry["@graph"]);
        } else {
          values.push(entry);
        }
      }
    } catch {
      // A broken JSON-LD block should not prevent HTML parsing.
    }
  }

  return values;
}

function findStructuredProduct(jsonLd) {
  return jsonLd.find((entry) => {
    const type = entry?.["@type"];
    return Array.isArray(type)
      ? type.some((value) => String(value).toLowerCase() === "product")
      : String(type ?? "").toLowerCase() === "product";
  });
}

function getStructuredOffers(structuredProduct) {
  const offers = structuredProduct?.offers;
  if (Array.isArray(offers)) {
    return offers;
  }
  return offers ? [offers] : [];
}

function extractCanonicalUrl(html, baseUrl) {
  const links = [...html.matchAll(/<link\b([^>]*)>/gi)];

  for (const link of links) {
    const attributes = link[1];
    const rel = (getAttribute(attributes, "rel") ?? "").toLowerCase();
    if (!rel.split(/\s+/).includes("canonical")) {
      continue;
    }

    return normalizeSiteUrl(getAttribute(attributes, "href"), baseUrl);
  }

  return null;
}

function getImageUrlsFromSrcset(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function normalizeImageUrl(rawUrl, baseUrl) {
  const normalized = normalizeSiteUrl(rawUrl, baseUrl);
  if (!normalized) {
    return null;
  }

  const url = new URL(normalized);
  if (!SITE_HOSTS.has(url.hostname.toLowerCase())) {
    return null;
  }

  url.search = "";
  return url.href;
}

function isLikelyImageUrl(url) {
  const parsed = new URL(url);
  const extension = extname(parsed.pathname).toLowerCase();
  return (
    IMAGE_EXTENSIONS.has(extension) ||
    /\/wp-content\/uploads\//i.test(parsed.pathname)
  );
}

function isRejectedImage(url, context) {
  const value = (url + " " + context).toLowerCase();
  return /logo|favicon|tracking|pixel|sprite|gravatar|avatar|social-icon|site-icon/.test(
    value
  );
}

function scoreImageCandidate(url, context, attributes) {
  const value = (url + " " + context + " " + attributes).toLowerCase();
  let score = 0;

  if (
    /woocommerce-product-gallery__image|woocommerce-product-gallery|product-gallery|product-image|single-product/.test(
      value
    )
  ) {
    score += 10;
  }
  if (
    /wp-post-image|woocommerce-main-image|attachment-woocommerce_single/.test(
      value
    )
  ) {
    score += 6;
  }
  if (/gallery|large_image|full-size/.test(value)) {
    score += 3;
  }
  if (/related|upsell|cross-sell|recent|blog|post|footer|header|thumbnail/.test(value)) {
    score -= 8;
  }

  const width = Number.parseInt(getAttribute(attributes, "width") ?? "", 10);
  const height = Number.parseInt(getAttribute(attributes, "height") ?? "", 10);
  if (
    (Number.isFinite(width) && width <= 80) ||
    (Number.isFinite(height) && height <= 80)
  ) {
    score -= 10;
  }

  return score;
}

function extractImageCandidates(html, baseUrl, jsonLd) {
  const galleryHtml =
    extractClassBlocks(html, ["woocommerce-product-gallery__wrapper", "product-gallery-slider"])[0]?.content ??
    extractClassBlocks(html, ["woocommerce-product-gallery"])[0]?.content ??
    html;
  const sourceHtml = galleryHtml;
  const candidates = new Map();
  const addCandidate = (rawUrl, score, order, context) => {
    const url = normalizeImageUrl(rawUrl, baseUrl);
    if (
      !url ||
      !isLikelyImageUrl(url) ||
      isRejectedImage(url, context ?? "")
    ) {
      return;
    }

    const current = candidates.get(url);
    if (!current || score > current.score) {
      candidates.set(url, { order, score, url });
    }
  };

  for (const match of sourceHtml.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1];
    const index = match.index ?? 0;
    const context = sourceHtml.slice(
      Math.max(0, index - 900),
      index + match[0].length + 500
    );
    const urls = [
      getAttribute(attributes, "data-large_image"),
      getAttribute(attributes, "data-src"),
      getAttribute(attributes, "data-lazy-src"),
      getAttribute(attributes, "data-original"),
      getAttribute(attributes, "src"),
      ...getImageUrlsFromSrcset(getAttribute(attributes, "data-srcset")),
      ...getImageUrlsFromSrcset(getAttribute(attributes, "srcset")),
    ].filter(Boolean);
    const score = scoreImageCandidate(urls[0] ?? "", context, attributes);

    for (const url of urls) {
      addCandidate(url, score, index, context);
    }
  }

  for (const match of sourceHtml.matchAll(/<a\b([^>]*)>/gi)) {
    const attributes = match[1];
    const href = getAttribute(attributes, "href");
    if (!href || !/\.(avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(href)) {
      continue;
    }

    const index = match.index ?? 0;
    const context = sourceHtml.slice(Math.max(0, index - 700), index + 300);
    addCandidate(
      href,
      scoreImageCandidate(href, context, attributes) + 1,
      index,
      context
    );
  }

  const structuredProduct = findStructuredProduct(jsonLd);
  const structuredImages = Array.isArray(structuredProduct?.image)
    ? structuredProduct.image
    : [structuredProduct?.image].filter(Boolean);
  for (const image of structuredImages) {
    addCandidate(image, 5, -1, "");
  }

  addCandidate(extractMetaContent(html, ["og:image"]), 4, -2, "");

  return [...candidates.values()]
    .filter((candidate) => candidate.score >= 0)
    .sort((left, right) => right.score - left.score || left.order - right.order)
    .map((candidate) => candidate.url)
    .slice(0, 20);
}

function extractAccordionSections(html) {
  return extractClassBlocks(html, ["accordion-item"])
    .map((block) => {
      const titleBlock = extractClassBlocks(block.content, [
        "accordion-title",
      ])[0];
      const contentBlock = extractClassBlocks(block.content, [
        "accordion-content",
      ])[0];
      const title =
        extractTagContents(titleBlock?.content ?? "", "span")
          .map((entry) => cleanInlineText(entry.content))
          .find(Boolean) ?? cleanInlineText(titleBlock?.content ?? "");

      return {
        title,
        value: cleanInlineText(contentBlock?.content ?? ""),
      };
    })
    .filter((section) => section.title && section.value);
}

function normalizeLabel(value) {
  return cleanInlineText(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[:：-]$/, "")
    .trim();
}

function getAccordionValue(sections, labels) {
  const wantedLabels = new Set(labels.map(normalizeLabel));
  return (
    sections.find((section) => wantedLabels.has(normalizeLabel(section.title)))
      ?.value ?? null
  );
}

function extractInlineLabeledValue(text, labels) {
  const labelPattern = labels
    .slice()
    .sort((left, right) => right.length - left.length)
    .map((label) => escapeRegExp(label))
    .join("|");
  const stopLabels = [
    "Thành phần",
    "Thành phần có hoạt tính",
    "Dung tích",
    "Công dụng",
    "Hướng dẫn sử dụng",
    "Cách dùng",
    "Lưu ý",
    "Số CBMP",
    "CBMP",
    "Số ĐK",
    "SĐK",
    "SDK",
  ]
    .filter((label) => !labels.includes(label))
    .sort((left, right) => right.length - left.length)
    .map((label) => escapeRegExp(label))
    .join("|");
  const pattern = new RegExp(
    "(?:" +
      labelPattern +
      ")\\s*(?::|：)?\\s*([\\s\\S]*?)(?=\\s+(?:" +
      stopLabels +
      ")\\s*(?::|：|-|$)|(?:" +
      stopLabels +
      ")\\s*(?::|：|-|$)|$)",
    "i"
  );
  const match = text.match(pattern);
  return cleanInlineText(match?.[1] ?? "") || null;
}

function extractRegistrationNumber(text) {
  const labels = ["Số CBMP", "CBMP", "Số ĐK", "SĐK", "SDK"]
    .sort((left, right) => right.length - left.length)
    .map((label) => escapeRegExp(label))
    .join("|");
  const match = text.match(
    new RegExp(
      "(?:" +
        labels +
        ")\\s*[:：-]?\\s*([A-Z0-9]+(?:[-/][A-Z0-9]+)+)",
      "i"
    )
  );
  return match?.[1] ?? null;
}

function extractFirstTextByClass(html, classNames) {
  return (
    extractClassBlocks(html, classNames)
      .map((block) => cleanInlineText(block.content))
      .find(Boolean) ?? null
  );
}

function extractDescriptionHtml(html) {
  const idBlocks = extractIdBlocks(html, ["tab-description", "description"]);
  const classBlocks = extractClassBlocks(html, [
    "woocommerce-Tabs-panel--description",
    "product-description",
    "product-content",
    "entry-content",
  ]);

  return (
    [...idBlocks, ...classBlocks]
      .map((block) => block.content)
      .find((content) => cleanInlineText(content)) ?? ""
  );
}

function extractDetailText(html, descriptionHtml, shortDescriptionHtml) {
  const detailBlocks = [
    ...extractIdBlocks(html, ["tab-description", "description"]),
    ...extractClassBlocks(html, [
      "woocommerce-Tabs-panel",
      "woocommerce-product-details__short-description",
      "product-description",
      "product-content",
      "entry-content",
      "product_meta",
    ]),
  ];

  const pieces = [
    shortDescriptionHtml,
    descriptionHtml,
    ...detailBlocks.map((block) => block.content),
  ]
    .map((value) => textFromHtml(value))
    .filter(Boolean);

  return [...new Set(pieces)].join("\n");
}

function extractLabeledValue(text, labels) {
  const labelPattern = labels
    .slice()
    .sort((left, right) => right.length - left.length)
    .map((label) => escapeRegExp(label))
    .join("|");
  const allLabelPattern = ALL_FIELD_LABELS.map((label) => escapeRegExp(label)).join("|");
  const linePattern = new RegExp(
    "^\\s*(?:" + labelPattern + ")\\s*(?::|：|-)?\\s*(.*)$",
    "i"
  );
  const nextLabelPattern = new RegExp(
    "^\\s*(?:" + allLabelPattern + ")\\s*(?::|：|-|$)",
    "i"
  );
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(linePattern);
    if (!match) {
      continue;
    }

    const values = [];
    if (match[1].trim()) {
      values.push(match[1].trim());
    }

    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
      if (nextLabelPattern.test(lines[nextIndex])) {
        break;
      }
      values.push(lines[nextIndex]);
    }

    const value = cleanInlineText(values.join(" "));
    if (value) {
      return value;
    }
  }

  return null;
}

function parseNumericPrice(value) {
  if (!value) {
    return null;
  }

  const numericText = cleanInlineText(String(value))
    .replace(/[^\d,.-]/g, "")
    .replace(/(?!^)-/g, "");
  if (!/\d/.test(numericText)) {
    return null;
  }

  const separators = [...numericText.matchAll(/[.,]/g)].map(
    (match) => match.index ?? -1
  );
  if (!separators.length) {
    const number = Number(numericText);
    return Number.isFinite(number) ? number : null;
  }

  const lastSeparator = separators[separators.length - 1];
  const decimalDigits = numericText.length - lastSeparator - 1;
  let normalized = numericText;

  if (separators.length > 1 || decimalDigits === 3) {
    normalized = numericText.replace(/[.,]/g, "");
  } else {
    normalized = numericText.replace(",", ".");
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function extractPrice(html, jsonLd) {
  const structuredProduct = findStructuredProduct(jsonLd);
  const structuredOffer = getStructuredOffers(structuredProduct).find(
    (offer) => parseNumericPrice(offer?.price) !== null
  );
  const candidates = [
    structuredOffer?.price,
    extractMetaContent(html, ["product:price:amount", "og:price:amount"]),
    ...extractClassBlocks(html, [
      "price",
      "woocommerce-Price-amount",
      "amount",
    ]).map((block) => cleanInlineText(block.content)),
  ];

  for (const candidate of candidates) {
    const price = parseNumericPrice(candidate);
    if (price !== null) {
      const currency =
        structuredOffer?.priceCurrency ??
        extractMetaContent(html, [
          "product:price:currency",
          "og:price:currency",
        ]) ??
        (/[₫đ]|\bVND\b/i.test(String(candidate)) ? "VND" : null);
      return { currency, price };
    }
  }

  return { currency: null, price: null };
}

function extractName(html, structuredProduct, productId) {
  const heading = extractTagContents(html, "h1")
    .map((entry) => cleanInlineText(entry.content))
    .find(Boolean);
  const title = cleanInlineText(
    (extractTagContents(html, "title")[0]?.content ?? "").replace(
      /\s*(?:–|-|—)\s*Opodis Pharma\s*$/i,
      ""
    )
  );

  return (
    heading ||
    cleanInlineText(structuredProduct?.name ?? "") ||
    extractMetaContent(html, ["og:title"]) ||
    title ||
    productId.toUpperCase()
  );
}

function categoryLabelFromSlug(slug) {
  return (
    CATEGORY_LABELS.get(slug) ??
    slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function extractProductCategorySlugs(html) {
  const productBlocks = extractBlocks(
    html,
    (tagName, attributes) =>
      hasClass(attributes, "product") &&
      /^product-/i.test(getAttribute(attributes, "id") ?? "")
  );
  const className = getClassName(productBlocks[0]?.attributes ?? "");

  return [
    ...new Set(
      [...className.matchAll(/(?:^|\s)product_cat-([a-z0-9-]+)/gi)].map(
        (match) => match[1].toLowerCase()
      )
    ),
  ];
}

function extractCategories(html, structuredProduct, baseUrl) {
  const values = [];
  const category = structuredProduct?.category;
  if (Array.isArray(category)) {
    values.push(...category);
  } else if (category) {
    values.push(category);
  }

  values.push(
    ...extractProductCategorySlugs(html).map((slug) => categoryLabelFromSlug(slug))
  );

  for (const block of extractClassBlocks(html, [
    "posted_in",
    "product_meta",
    "breadcrumb",
    "breadcrumbs",
    "product-breadcrumb-container",
  ])) {
    values.push(
      ...extractAnchorLinksWithText(block.content, baseUrl)
        .filter((anchor) => /\/product-category\//i.test(anchor.href))
        .map((anchor) => anchor.text)
    );
  }

  const cleanedValues = [
    ...new Set(
      values.map((value) => cleanInlineText(String(value))).filter(Boolean)
    ),
  ];
  const specificValues = cleanedValues.filter(
    (value) => normalizeLabel(value) !== normalizeLabel("Sản phẩm")
  );
  return specificValues.length ? specificValues : cleanedValues;
}

function parseProductPage(html, sourceUrl) {
  const jsonLd = parseJsonLd(html);
  const structuredProduct = findStructuredProduct(jsonLd);
  const productId = getProductId(sourceUrl);
  const canonicalUrl = extractCanonicalUrl(html, sourceUrl) ?? sourceUrl;
  const shortDescriptionHtml =
    extractClassBlocks(html, [
      "woocommerce-product-details__short-description",
      "product-short-description",
    ])[0]?.content ?? "";
  const descriptionHtml = extractDescriptionHtml(html);
  const detailText = extractDetailText(
    html,
    descriptionHtml,
    shortDescriptionHtml
  );
  const accordionSections = extractAccordionSections(html);
  const categories = extractCategories(html, structuredProduct, sourceUrl);
  const price = extractPrice(html, jsonLd);
  const shortDescription = cleanInlineText(shortDescriptionHtml);
  const accordionPackaging = getAccordionValue(
    accordionSections,
    FIELD_LABELS.packaging
  );
  const inlinePackaging = extractInlineLabeledValue(
    shortDescription,
    FIELD_LABELS.packaging
  );
  const packaging =
    accordionPackaging ??
    inlinePackaging ??
    (shortDescription &&
    new RegExp(
      "(?:^|\\s)(?:" +
        FIELD_LABELS.packaging.map(escapeRegExp).join("|") +
        ")\\s*(?:[:：-]|$)",
      "i"
    ).test(shortDescription)
      ? null
      : extractLabeledValue(detailText, FIELD_LABELS.packaging));
  const registrationText = [shortDescription, detailText].filter(Boolean).join("\n");
  const activeIngredients =
    getAccordionValue(accordionSections, FIELD_LABELS.activeIngredients) ??
    extractLabeledValue(detailText, FIELD_LABELS.activeIngredients);

  return {
    id: productId,
    sourceUrl,
    canonicalUrl,
    name: extractName(html, structuredProduct, productId),
    categories,
    category: categories[0] ?? "",
    price: price.price,
    currency: price.currency,
    galleryImageUrls: extractImageCandidates(html, sourceUrl, jsonLd),
    shortDescription:
      shortDescription ||
      extractMetaContent(html, ["description", "og:description"]) ||
      "",
    description: textFromHtml(descriptionHtml) || shortDescription,
    volume:
      getAccordionValue(accordionSections, FIELD_LABELS.volume) ??
      extractLabeledValue(detailText, FIELD_LABELS.volume),
    packaging,
    ingredients:
      getAccordionValue(accordionSections, FIELD_LABELS.ingredients) ??
      extractLabeledValue(detailText, FIELD_LABELS.ingredients),
    activeIngredients,
    uses:
      getAccordionValue(accordionSections, FIELD_LABELS.uses) ??
      extractLabeledValue(detailText, FIELD_LABELS.uses),
    directions:
      getAccordionValue(accordionSections, FIELD_LABELS.directions) ??
      extractLabeledValue(detailText, FIELD_LABELS.directions),
    warnings:
      getAccordionValue(accordionSections, FIELD_LABELS.warnings) ??
      extractLabeledValue(detailText, FIELD_LABELS.warnings),
    advantages:
      getAccordionValue(accordionSections, FIELD_LABELS.advantages) ??
      extractLabeledValue(detailText, FIELD_LABELS.advantages),
    registrationNumber: extractRegistrationNumber(registrationText),
  };
}

async function fetchResponse(url, responseType) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: REQUEST_HEADERS,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status + " " + response.statusText);
      }

      if (responseType === "arrayBuffer") {
        return {
          contentType: response.headers.get("content-type") ?? "",
          data: await response.arrayBuffer(),
        };
      }

      return {
        contentType: response.headers.get("content-type") ?? "",
        data: await response.text(),
      };
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await sleep(400 * (attempt + 1));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(
    "Request failed after " +
      (MAX_RETRIES + 1) +
      " attempts: " +
      url +
      " (" +
      (lastError?.message ?? "unknown error") +
      ")"
  );
}

async function fetchHtml(url) {
  const response = await fetchResponse(url, "text");
  return response.data;
}

async function discoverProductUrls() {
  const queue = [SHOP_URL];
  const visitedPages = new Set();
  const productUrls = new Set();
  const failedPages = [];

  while (queue.length) {
    const batch = [];
    while (queue.length && batch.length < MAX_CONCURRENCY) {
      const pageUrl = queue.shift();
      if (visitedPages.has(pageUrl)) {
        continue;
      }
      visitedPages.add(pageUrl);
      batch.push(pageUrl);
    }

    const results = await Promise.all(
      batch.map(async (pageUrl) => {
        try {
          return { html: await fetchHtml(pageUrl), pageUrl };
        } catch (error) {
          failedPages.push({
            reason: error.message,
            type: "shop",
            url: pageUrl,
          });
          return null;
        }
      })
    );

    for (const result of results.filter(Boolean)) {
      for (const productUrl of extractProductLinks(result.html, result.pageUrl)) {
        productUrls.add(productUrl);
      }

      for (const pageUrl of extractPaginationLinks(result.html, result.pageUrl)) {
        if (!visitedPages.has(pageUrl) && !queue.includes(pageUrl)) {
          queue.push(pageUrl);
        }
      }
    }

    if (queue.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return {
    failedPages,
    productUrls: [...productUrls],
  };
}

function getImageExtension(imageUrl, contentType) {
  const extension = extname(new URL(imageUrl).pathname).toLowerCase();
  if (IMAGE_EXTENSIONS.has(extension)) {
    return extension.slice(1);
  }

  const mimeToExtension = {
    "image/avif": "avif",
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/webp": "webp",
  };
  return (
    mimeToExtension[contentType.split(";")[0].trim().toLowerCase()] ?? "jpg"
  );
}

async function downloadProductImages(productId, imageUrls) {
  if (!imageUrls.length) {
    return [];
  }

  const productDirectory = join(PRODUCTS_DIR, productId);
  await rm(productDirectory, { recursive: true, force: true });
  await mkdir(productDirectory, { recursive: true });
  const downloaded = [];

  // Product pages are fetched in batches of three. Keeping image downloads
  // sequential here makes the total request concurrency stay at three.
  for (let index = 0; index < imageUrls.length; index += 1) {
    const imageUrl = imageUrls[index];
    try {
      const response = await fetchResponse(imageUrl, "arrayBuffer");
      if (
        response.contentType &&
        !response.contentType.toLowerCase().startsWith("image/")
      ) {
        throw new Error("Unexpected content type " + response.contentType);
      }

      const extension = getImageExtension(imageUrl, response.contentType);
      const fileName =
        downloaded.length === 0
          ? "main." + extension
          : String(downloaded.length).padStart(2, "0") + "." + extension;
      const filePath = join(productDirectory, fileName);
      await writeFile(filePath, Buffer.from(response.data));
      downloaded.push("src/static/products/" + productId + "/" + fileName);
    } catch (error) {
      console.warn(
        "Image download failed: " + imageUrl + " (" + error.message + ")"
      );
    }

    if (index + 1 < imageUrls.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return downloaded;
}

async function parseProducts(productUrls) {
  const products = [];
  const failedPages = [];

  for (let index = 0; index < productUrls.length; index += MAX_CONCURRENCY) {
    const batch = productUrls.slice(index, index + MAX_CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (sourceUrl) => {
        try {
          const html = await fetchHtml(sourceUrl);
          const product = parseProductPage(html, sourceUrl);
          const localImages = await downloadProductImages(
            product.id,
            product.galleryImageUrls
          );

          return {
            ...product,
            galleryImages: localImages,
            image: localImages[0] ?? null,
            galleryImageUrls: undefined,
          };
        } catch (error) {
          failedPages.push({
            reason: error.message,
            type: "product",
            url: sourceUrl,
          });
          return null;
        }
      })
    );

    products.push(...results.filter(Boolean));
    if (index + MAX_CONCURRENCY < productUrls.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return { failedPages, products };
}

function toSnapshotProduct(product) {
  const { galleryImageUrls, ...snapshotProduct } = product;
  return snapshotProduct;
}

function printReport(discoveredCount, products, failedPages) {
  const count = (predicate) => products.filter(predicate).length;
  console.log("Discovered product URLs: " + discoveredCount);
  console.log("Parsed successfully: " + products.length);
  console.log("Failed: " + failedPages.length);
  console.log(
    "Products with images: " + count((product) => Boolean(product.image))
  );
  console.log(
    "Products without images: " + count((product) => !product.image)
  );
  console.log(
    "Products with price: " + count((product) => product.price !== null)
  );
  console.log(
    "Products without price: " + count((product) => product.price === null)
  );
  console.log(
    "Products with registration number: " +
      count((product) => Boolean(product.registrationNumber))
  );
  console.log(
    "Products with ingredients: " +
      count((product) => Boolean(product.ingredients || product.activeIngredients))
  );
  console.log(
    "Products with uses: " + count((product) => Boolean(product.uses))
  );
  console.log(
    "Products with directions: " +
      count((product) => Boolean(product.directions))
  );
  console.log(
    "Products with warnings: " + count((product) => Boolean(product.warnings))
  );

  console.log("\nFailed pages:");
  if (!failedPages.length) {
    console.log("None");
    return;
  }

  for (const failure of failedPages) {
    console.log("- [" + failure.type + "] " + failure.url);
    console.log("  " + failure.reason);
  }
}

async function main() {
  console.log("Discovering products from " + SHOP_URL);
  const discovery = await discoverProductUrls();

  if (!discovery.productUrls.length) {
    throw new Error("No product URLs discovered; snapshot was not written.");
  }

  console.log("Parsing " + discovery.productUrls.length + " product pages");
  const parsed = await parseProducts(discovery.productUrls);
  if (!parsed.products.length) {
    throw new Error("No product pages parsed; snapshot was not written.");
  }

  const failedPages = [...discovery.failedPages, ...parsed.failedPages];
  const snapshot = {
    source: SOURCE_ROOT,
    syncedAt: new Date().toISOString(),
    products: parsed.products.map(toSnapshotProduct),
  };

  await mkdir(join(PROJECT_ROOT, "src", "data"), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  printReport(discovery.productUrls.length, parsed.products, failedPages);
  console.log("\nSnapshot: " + OUTPUT_PATH);
}

main().catch((error) => {
  console.error("Sync failed: " + error.message);
  process.exitCode = 1;
});
