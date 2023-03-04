// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Vijayakrishna's Blog";
export const SITE_DESCRIPTION =
  "Welcome to my blog! I write about developer tools and developer experience related topics";
export const TWITTER_HANDLE = "@reactporiyaalar";
export const MY_NAME = "Vijay Krish";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
