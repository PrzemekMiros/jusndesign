const normalizeStem = (stem) => {
  if (!stem) {
    return "";
  }
  return stem.replace(/(\.en|\.pl)$/, "");
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

const getFallbackUrl = (url, targetLang) => {
  if (!url) {
    return targetLang === "pl" ? "/pl/" : "/";
  }
  if (targetLang === "pl") {
    return url.startsWith("/pl/") ? url : `/pl${url}`;
  }
  return url.replace(/^\/pl\//, "/");
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
  langPrefix: (data) => (resolveLang(data) === "pl" ? "/pl" : ""),
  langSwitch: (data) => {
    const currentUrl = data.page && data.page.url ? data.page.url : "/";
    const enUrl = findLangUrl(data, "en") || getFallbackUrl(currentUrl, "en");
    const plUrl = findLangUrl(data, "pl") || getFallbackUrl(currentUrl, "pl");
    return {
      en: enUrl,
      pl: plUrl,
    };
  },
  permalink: (data) => {
    if (data.permalink === false) {
      return false;
    }

    if (typeof data.permalink !== "string") {
      return data.permalink;
    }

    if (data.permalink.startsWith("/pl/")) {
      return data.permalink;
    }

    const resolvedLang = resolveLang(data);

    if (resolvedLang === "pl") {
      if (data.permalink.startsWith("/")) {
        return `/pl${data.permalink}`;
      }
      return `/pl/${data.permalink}`;
    }

    if (
      resolvedLang === "en" &&
      data.page &&
      data.page.inputPath &&
      /[\\\/]page[\\\/]categories[\\\/]/.test(data.page.inputPath) &&
      data.permalink.startsWith("/produkty/")
    ) {
      return data.permalink.replace("/produkty/", "/products/");
    }

    return data.permalink;
  },
};
