const { DateTime } = require("luxon");
module.exports = function (eleventyConfig) {
   // Add a date filter you can use in Nunjucks: {{ myDate | date("yyyy") }}
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-LL-dd") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });
  // Limit filter to return a subset of array items
  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  // Create blog collection
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

 // Zen subset (based on tags)
  eleventyConfig.addCollection("zen", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").filter(post =>
      post.data.tags && (post.data.tags.includes("禅") || post.data.tags.includes("Zen"))
    );
  });
  // Pass "now" into all templates as a global data value
  eleventyConfig.addGlobalData("now", new Date());
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy('src/admin');
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images"); // Assuming images are in a folder

  // ✅ Change localhost and port
  // eleventyConfig.setServerOptions({
  //   port: 80,      // default 8080 → change to 80
  //   host: "localhost", // can also be "0.0.0.0" to allow LAN access
  //   showAllHosts: true,
  // });
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
