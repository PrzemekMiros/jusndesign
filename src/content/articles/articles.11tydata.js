const normalizeSlug = (slug = "") => slug.replace(/\.(en|pl)$/, "");

module.exports = {
  layout: "layouts/article.njk",
  eleventyComputed: {
    title: (data) =>
      data.title ||
      ((data.lang || "pl") === "en"
        ? `Article ${data.page.fileSlug}`
        : `Artykul ${data.page.fileSlug}`),
    description: (data) =>
      data.description ||
      data.title ||
      ((data.lang || "pl") === "en"
        ? `Article ${data.page.fileSlug}`
        : `Artykul ${data.page.fileSlug}`),
    thumbnail: (data) =>
      data.thumbnail || data.articleImage || "/assets/img/opengraph.png",
    permalink: (data) =>
      (data.lang || "pl") === "en"
        ? `/en/guide/${normalizeSlug(data.page.fileSlug)}/`
        : `/poradnik/${normalizeSlug(data.page.fileSlug)}/`,
  },
};
