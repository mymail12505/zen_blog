// .eleventy.js
const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {

  // ------------------------------------
  // Responsive image shortcode
  // ------------------------------------
  eleventyConfig.addNunjucksAsyncShortcode("respimg", async function(src, alt) {
    let metadata = await Image(src, {
      widths: [400, 800, 1200],
      formats: ["webp", "jpeg"],
      urlPath: "/images/",
      outputDir: "./_site/images/"
    });

    let imageAttributes = {
      alt,
      sizes: "(max-width: 800px) 100vw, 800px",
      loading: "lazy",
      decoding: "async"
    };

    return Image.generateHTML(metadata, imageAttributes);
  });

  // ------------------------------------
  // Filters
  // ------------------------------------
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-LL-dd") =>
    DateTime.fromJSDate(dateObj).toFormat(format)
  );

  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  // ------------------------------------
  // Collections
  // ------------------------------------
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("zen", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .filter(post =>
        post.data.tags &&
        (post.data.tags.includes("禅") || post.data.tags.includes("Zen"))
      );
  });

  // ------------------------------------
  // Global data
  // ------------------------------------
  eleventyConfig.addGlobalData("now", new Date());

  // ------------------------------------
  // Passthrough
  // ------------------------------------
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/images");

  // ------------------------------------
  // Optional: override local server defaults
  // ------------------------------------
  // eleventyConfig.setServerOptions({
  //   port: 80,
  //   host: "0.0.0.0",
  //   showAllHosts: true
  // });

  // ------------------------------------
  // Directory structure
  // ------------------------------------
  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};
