// .eleventy.js
const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const quotes = require("./src/_data/quotes.json");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // ------------------------------------
  // Markdown-It (replace Eleventy default)
  // ------------------------------------
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink()
  });

  eleventyConfig.setLibrary("md", md);
 // ------------------------------------
  // syntaxHighlight
  // ------------------------------------
eleventyConfig.addPlugin(syntaxHighlight);

  // ------------------------------------
  // pluginSitemap
  // ------------------------------------

eleventyConfig.addPlugin(pluginSitemap, {
        sitemap: {
          hostname: "https://zenblog12505.netlify.app/", // Replace with your actual domain
        },
      });

  //
  // ----------------------------
  // Quote Formatter (Reusable)
  // ----------------------------
  //
  eleventyConfig.addFilter("formatQuote", function (q) {
    if (!q) return "";
    const quote = q.quote || "";
    const author = q.author ? `— ${q.author}` : "";
    return `
      <blockquote class="quote-block">
        <p>${quote}</p>
        <cite>${author}</cite>
      </blockquote>
    `;
  });

  //
  // ----------------------------
  // Shortcode: Random Quote
  // ----------------------------
  //
  eleventyConfig.addShortcode("randomQuote", function () {
    const list = quotes.quotes || quotes;  // supports {quotes:[...]} or [...]
    if (!Array.isArray(list) || list.length === 0) return "";

    const randomIndex = Math.floor(Math.random() * list.length);
    const q = list[randomIndex];

    return `
      <blockquote class="quote-block">
        <p>${q.quote}</p>
        <cite>— ${q.author}</cite>
      </blockquote>
    `;
  });


  // ------------------------------------
  // Responsive image shortcode (respimg)
  // Usage: {% respimg "/images/Bodhidharma.jpg", "Alt text", "(max-width: 1200px) 100vw, 1200px" %}
  // ------------------------------------
  eleventyConfig.addNunjucksAsyncShortcode("respimg", async function(src, alt = "", sizes = "(max-width: 1200px) 100vw, 1200px") {
    // Normalize source: if user passed "/images/..." treat it as ./src/images/...
    const fullSrc = src && src.startsWith("/") ? `./src${src}` : src;

    try {
      let metadata = await Image(fullSrc, {
        widths: [400, 800, 1200],
        formats: ["avif", "webp", "jpeg"],
        urlPath: "cls",
        outputDir: "./_site/images/",
      });

      let imageAttributes = {
        alt,
        sizes,
        class: "img-fluid",
        loading: "lazy",
        decoding: "async"
      };

      return Image.generateHTML(metadata, imageAttributes);
    } catch (err) {
      // Graceful fallback: console error and return plain <img>
      console.error(`[eleventy] respimg error for "${src}":`, err);
      // If src was normalized, use the public URL path so browser can still load it from /images/...
      const publicSrc = src && src.startsWith("/") ? src : src;
      return `<img src="${publicSrc}" alt="${alt}" class="img-fluid" loading="lazy" decoding="async">`;
    }
  });

  // ------------------------------------
  // Simple cover shortcode
  // Usage: {% cover "/images/foo.jpg", "Alt text" %}
  // ------------------------------------
  eleventyConfig.addShortcode("cover", function(src, alt = "") {
    return `<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;display:block;margin:auto;">`;
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
  // - blog: all markdown files in src/blog
  // - zen: subset with tag "禅" or "Zen"
  // ------------------------------------
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .filter(item => item.data && item.inputPath) // safety
      .sort((a, b) => {
        // Ensure date exists and compare
        const da = a.date ? new Date(a.date) : new Date(0);
        const db = b.date ? new Date(b.date) : new Date(0);
        return db - da;
      });
  });


  eleventyConfig.addCollection("zen", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .filter(post =>
        post.data &&
        post.data.tags &&
        (post.data.tags.includes("禅") || post.data.tags.includes("Zen"))
      );
  });

  // ------------------------------------
  // Global data
  // ------------------------------------
  eleventyConfig.addGlobalData("now", new Date());

  // ------------------------------------
  // Passthrough copy (static assets)
  // ------------------------------------
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/images");
    // Copy the whole icons folder to the output root (keeps path /assets/icons/...)
  eleventyConfig.addPassthroughCopy({ "src/assets/icons": "assets/icons" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({"src/googlea3296d9d51a1c824.html": "googlea3296d9d51a1c824.html"});

  // ------------------------------------
  // Optional: server options (uncomment if needed)
  // ------------------------------------
  // eleventyConfig.setServerOptions({
  //   port: 8080,
  //   host: "0.0.0.0",
  //   showAllHosts: true
  // });

  // ------------------------------------
  // Directory structure and template engines
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
