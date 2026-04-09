const Image = require("@11ty/eleventy-img");
const path = require("path");

/**
 * Generates responsive images for guide list cards.
 * Keeps files small while matching the card width on desktop (~360px)
 * and providing larger sources for retina screens.
 */
module.exports = async function guideCardImage(src, alt = "") {
  if (!src) {
    return "";
  }

  const inputPath = /^https?:\/\//i.test(src)
    ? src
    : path.join("src", src.replace(/^\//, ""));

  const stats = await Image(inputPath, {
    widths: [320, 480, 640, 800, 1024],
    formats: ["webp", "jpeg"],
    urlPath: "/content/articles/img/generated/",
    outputDir: "./public/content/articles/img/generated/",
    sharpJpegOptions: { quality: 82, progressive: true },
    sharpWebpOptions: { quality: 80 },
  });

  return Image.generateHTML(stats, {
    alt: alt || "Zdjęcie do artykułu",
    loading: "lazy",
    decoding: "async",
    sizes:
      "(min-width: 1200px) 360px, (min-width: 992px) 320px, (min-width: 768px) 45vw, 90vw",
    class: "guide-card-img",
  });
};
