const normalizeStem = (stem) => {
  if (!stem) {
    return "";
  }
  return stem.replace(/(\.en|\.pl)$/, "");
};

const SITE_URL = "https://jusndesigneurope.com";
const SITE_NAME = "JUSN Design Europe";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const cleanText = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value.toString().replace(/\s+/g, " ").trim() || undefined;
};

const absoluteUrl = (url) => {
  if (!url) {
    return undefined;
  }
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const compact = (value) => {
  if (Array.isArray(value)) {
    const items = value.map(compact).filter((item) => item !== undefined);
    return items.length ? items : undefined;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, compact(item)])
      .filter(([, item]) => item !== undefined);
    return entries.length ? Object.fromEntries(entries) : undefined;
  }

  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return value;
};

const getCanonicalUrl = (data) => absoluteUrl((data.page && data.page.url) || "/");

const getIsoDate = (date) => {
  if (!date) {
    return undefined;
  }
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const toNumber = (value) => {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const getRatingValue = (review) => (
  toNumber(review && (review.ratingValue || review.rating || review.ocena))
);

const getAggregateRatingSchema = (aggregateRating, productReviews) => {
  if (aggregateRating) {
    const ratingValue = toNumber(aggregateRating.ratingValue || aggregateRating.rating);
    const reviewCount = toNumber(aggregateRating.reviewCount || aggregateRating.ratingCount);

    if (ratingValue && reviewCount) {
      return {
        "@type": "AggregateRating",
        ratingValue,
        reviewCount,
        bestRating: toNumber(aggregateRating.bestRating) || 5,
        worstRating: toNumber(aggregateRating.worstRating) || 1,
      };
    }
  }

  const ratings = (productReviews || [])
    .map(getRatingValue)
    .filter((rating) => rating !== undefined);

  if (!ratings.length) {
    return undefined;
  }

  const ratingValue = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  return {
    "@type": "AggregateRating",
    ratingValue: Number(ratingValue.toFixed(1)),
    reviewCount: ratings.length,
    bestRating: 5,
    worstRating: 1,
  };
};

const getReviewSchema = (review) => {
  const ratingValue = getRatingValue(review);

  if (!review || !ratingValue || !review.author) {
    return undefined;
  }

  return {
    "@type": "Review",
    author: {
      "@type": "Person",
      name: cleanText(review.author),
    },
    datePublished: getIsoDate(review.datePublished || review.date),
    reviewBody: cleanText(review.reviewBody || review.body || review.text || review.review),
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: toNumber(review.bestRating) || 5,
      worstRating: toNumber(review.worstRating) || 1,
    },
  };
};

const getBreadcrumbSchema = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.url),
  })),
});

const getOrganizationSchema = () => ({
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/assets/img/logo/logo.png"),
  email: "contact@jusndesigneurope.com",
  telephone: "+48 606 234 775",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Warka",
    postalCode: "05-660",
    addressCountry: "PL",
  },
});

const getWebsiteSchema = () => ({
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {
    "@id": ORGANIZATION_ID,
  },
});

const getWebPageSchema = (data) => ({
  "@type": "WebPage",
  "@id": `${getCanonicalUrl(data)}#webpage`,
  url: getCanonicalUrl(data),
  name: cleanText(data.title),
  description: cleanText(data.description),
  inLanguage: data.lang || "pl",
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
});

const getProductSchema = (data) => {
  const images = [data.productImage, ...(data.galleryImages || [])]
    .map(absoluteUrl)
    .filter(Boolean);
  const installation = data.installation || data.Installation;
  const productReviews = Array.isArray(data.productReviews) ? data.productReviews : [];
  const review = productReviews.map(getReviewSchema).filter(Boolean);
  const aggregateRating = getAggregateRatingSchema(data.aggregateRating, productReviews);
  const additionalProperty = [
    data.material && {
      "@type": "PropertyValue",
      name: data.lang === "en" ? "Material" : "Material",
      value: cleanText(data.material),
    },
    data.process && {
      "@type": "PropertyValue",
      name: data.lang === "en" ? "Production process" : "Proces produkcji",
      value: cleanText(data.process),
    },
    data.capacityStatic && {
      "@type": "PropertyValue",
      name: data.lang === "en" ? "Static load capacity" : "Nosnosc statyczna",
      value: cleanText(data.capacityStatic),
    },
    data.capacityDynamic && {
      "@type": "PropertyValue",
      name: data.lang === "en" ? "Dynamic load capacity" : "Nosnosc dynamiczna",
      value: cleanText(data.capacityDynamic),
    },
    data.weight && {
      "@type": "PropertyValue",
      name: data.lang === "en" ? "Weight" : "Waga",
      value: cleanText(data.weight),
    },
    installation && installation.method && {
      "@type": "PropertyValue",
      name: data.lang === "en" ? "Installation" : "Montaz",
      value: cleanText(installation.method),
    },
  ].filter(Boolean);

  return {
    "@type": "Product",
    "@id": `${getCanonicalUrl(data)}#product`,
    name: cleanText(data.title),
    description: cleanText(data.description),
    image: images,
    sku: data.page && data.page.fileSlug,
    brand: {
      "@type": "Brand",
      name: cleanText(data.brand) || "JUSN",
    },
    manufacturer: {
      "@id": ORGANIZATION_ID,
    },
    category: data.categories && data.categories.length ? data.categories.join(", ") : undefined,
    additionalProperty,
    aggregateRating,
    review,
    offers: data.price
      ? {
          "@type": "Offer",
          url: getCanonicalUrl(data),
          priceCurrency: "PLN",
          price: data.price.toString(),
          availability: "https://schema.org/InStock",
          seller: {
            "@id": ORGANIZATION_ID,
          },
        }
      : undefined,
  };
};

const getArticleSchema = (data) => {
  const published = getIsoDate(data.date);

  return {
    "@type": "Article",
    "@id": `${getCanonicalUrl(data)}#article`,
    mainEntityOfPage: {
      "@id": `${getCanonicalUrl(data)}#webpage`,
    },
    headline: cleanText(data.title),
    description: cleanText(data.description),
    image: absoluteUrl(data.thumbnail || data.articleImage || "/assets/img/opengraph.png"),
    datePublished: published,
    dateModified: published,
    inLanguage: data.lang || "pl",
    author: {
      "@type": "Person",
      name: "Ernest",
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
};

const buildStructuredData = (data) => {
  const layout = data.layout || "";
  const lang = data.lang || "pl";
  const isProduct = layout.includes("product");
  const isArticle = layout.includes("article");
  const graph = [
    getOrganizationSchema(),
    getWebsiteSchema(),
    getWebPageSchema(data),
  ];

  if (isProduct) {
    graph.push(getBreadcrumbSchema([
      { name: lang === "en" ? "Home" : "Strona glowna", url: lang === "en" ? "/en/" : "/" },
      { name: lang === "en" ? "Offer" : "Oferta", url: lang === "en" ? "/en/offer/" : "/oferta/" },
      { name: cleanText(data.title), url: (data.page && data.page.url) || "/" },
    ]));
    graph.push(getProductSchema(data));
  }

  if (isArticle) {
    graph.push(getBreadcrumbSchema([
      { name: lang === "en" ? "Home" : "Strona glowna", url: lang === "en" ? "/en/" : "/" },
      { name: lang === "en" ? "Guide" : "Poradnik", url: lang === "en" ? "/en/guide/" : "/poradnik/" },
      { name: cleanText(data.title), url: (data.page && data.page.url) || "/" },
    ]));
    graph.push(getArticleSchema(data));
  }

  return compact({
    "@context": "https://schema.org",
    "@graph": graph,
  });
};

const resolveLang = (data) => {
  if (data.lang) {
    return data.lang;
  }
  const stem = data.page && data.page.filePathStem ? data.page.filePathStem : "";
  if (stem.endsWith(".pl")) {
    return "pl";
  }
  if (stem.endsWith(".en")) {
    return "en";
  }
  return "en";
};

const stripEnPrefix = (url) => url.replace(/^\/en(\/|$)/, "/");
const ensureEnPrefix = (url) => {
  if (!url) {
    return "/en/";
  }
  if (url === "/en") {
    return "/en/";
  }
  if (url.startsWith("/en/")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `/en${url}`;
  }
  return `/en/${url}`;
};

const stripPlPrefix = (url) => url.replace(/^\/pl(\/|$)/, "/");

const getFallbackUrl = (url, targetLang) => {
  if (!url) {
    return targetLang === "pl" ? "/" : "/en/";
  }
  if (targetLang === "pl") {
    return stripEnPrefix(url);
  }
  return ensureEnPrefix(stripPlPrefix(url));
};

const findLangUrl = (data, targetLang) => {
  const baseStem = normalizeStem(data.page && data.page.filePathStem);
  if (!baseStem || !data.collections || !data.collections.all) {
    return null;
  }
  const match = data.collections.all.find((item) => {
    const itemLang = item.data && item.data.lang ? item.data.lang : "en";
    const itemStem = normalizeStem(item.page && item.page.filePathStem);
    return itemLang === targetLang && itemStem === baseStem;
  });
  return match ? match.url : null;
};

module.exports = {
  lang: (data) => resolveLang(data),
  langPrefix: (data) => (resolveLang(data) === "pl" ? "" : "/en"),
  langSwitch: (data) => {
    const currentUrl = data.page && data.page.url ? data.page.url : "/";
    const enUrl = findLangUrl(data, "en") || getFallbackUrl(currentUrl, "en");
    const plUrl = findLangUrl(data, "pl") || getFallbackUrl(currentUrl, "pl");
    return {
      en: enUrl,
      pl: plUrl,
    };
  },
  structuredData: (data) => buildStructuredData(data),
  permalink: (data) => {
    if (data.permalink === false) {
      return false;
    }

    if (typeof data.permalink !== "string") {
      return data.permalink;
    }

    if (data.permalink === "/robots.txt" || data.permalink === "/sitemap.xml") {
      return data.permalink;
    }

    const resolvedLang = resolveLang(data);

    if (resolvedLang === "pl") {
      if (data.permalink.startsWith("/pl")) {
        return stripPlPrefix(data.permalink);
      }
      return data.permalink.startsWith("/") ? data.permalink : `/${data.permalink}`;
    }

    if (
      resolvedLang === "en" &&
      data.page &&
      data.page.inputPath &&
      /[\\\/]page[\\\/]categories[\\\/]/.test(data.page.inputPath) &&
      data.permalink.startsWith("/produkty/")
    ) {
      return ensureEnPrefix(data.permalink.replace("/produkty/", "/products/"));
    }

    return ensureEnPrefix(data.permalink);
  },
};
