---
title: "My Third Blog Post"
date: 2025-09-12
tags: posts
layout: layouts/post.njk
image: "/images/article-3.jpg"
excerpt: "The third post covers more advanced topics in our series."
eleventyExcludeFromCollections: true
---

This is the content of the Third post.

```js
function hello(name) {
  console.log(`Hello, ${name}`);
}
```
```html
Hello world
```

`.env`
> `.env` should remain unchanged, reads from the single expected

```js
- `url` - should remain unchanged, reads from the single expected `.env` value of `URL`
- `siteName` - your "brand" if you will, appended to the `<title>` tag, shown in the `sitenav`, displayed in the "hero" for the `home` layout, in the footer by the copyright, and as the identifier throughout the RSS feed
- `siteDescription` - used in the "description" meta tag, and below the `siteName` on the `home` layout
- `authorName` - Used in the RSS feed, intended to be your full name
- `twitterUsername` - without the "@", this value is used for the Twitter meta tags, and for the URL of the icon link in the footer
```