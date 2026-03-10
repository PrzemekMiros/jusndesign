const Image = require("@11ty/eleventy-img");
const path = require("path");

module.exports = async function productThumb(src, alt, className = "thumb-image rounded-md") {
  if (!alt) {
    throw new Error(`Missing \`alt\` on productThumb from: ${src}`);
  }

  const inputSrc = src.startsWith("/") ? path.join("src", src) : src;

  const stats = await Image(inputSrc, {
    widths: [200, 400],
    formats: ["webp", "jpeg"],
    urlPath: "/content/products/img/",
    outputDir: "./public/content/products/img/",
    sharpOptions: {
      jpeg: { quality: 72, mozjpeg: true },
      webp: { quality: 72 },
    },
  });

  const jpeg = stats.jpeg[0];
  const webpSrcset = stats.webp.map((image) => `${image.url} ${image.width}w`).join(", ");
  const jpegSrcset = stats.jpeg.map((image) => `${image.url} ${image.width}w`).join(", ");

  return `<picture>
    <source type="image/webp" srcset="${webpSrcset}" sizes="200px">
    <img
      loading="lazy"
      decoding="async"
      src="${jpeg.url}"
      srcset="${jpegSrcset}"
      sizes="200px"
      width="${jpeg.width}"
      height="${jpeg.height}"
      alt="${alt}"
      class="${className}">
  </picture>`;
};
