module.exports = {
  lang: (data) => data.lang || "en",
  langPrefix: (data) => ((data.lang || "en") === "pl" ? "/pl" : ""),
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

    if (data.lang === "pl") {
      if (data.permalink.startsWith("/")) {
        return `/pl${data.permalink}`;
      }
      return `/pl/${data.permalink}`;
    }

    return data.permalink;
  },
};
