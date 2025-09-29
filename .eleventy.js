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

  // Pass "now" into all templates as a global data value
  eleventyConfig.addGlobalData("now", new Date());
  eleventyConfig.addPassthroughCopy("src/css");
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
