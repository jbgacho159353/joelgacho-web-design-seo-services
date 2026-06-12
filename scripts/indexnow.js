#!/usr/bin/env node
/**
 * IndexNow ping — notifies Bing (and other IndexNow-enabled engines, which
 * feed ChatGPT search) that a URL was published or updated.
 *
 * Usage (run AFTER the page is live on jgdigitalhub.com — the search engine
 * verifies the key file on the deployed site when it processes the ping):
 *
 *   npm run indexnow -- /blog/new-post.html
 *   npm run indexnow -- /blog/post-one.html /blog/post-two.html
 *   npm run indexnow -- https://jgdigitalhub.com/blog/new-post.html
 *
 * A 200 or 202 response means the ping was accepted.
 */
const SITE = 'https://jgdigitalhub.com';
const KEY = '094e11074cad94fe297ab3d6afebb0ef'; // must match /<KEY>.txt at the site root

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: npm run indexnow -- /blog/your-post.html [more-urls...]');
  process.exit(1);
}

(async () => {
  let failed = false;
  for (const arg of args) {
    const url = arg.startsWith('http') ? arg : SITE + (arg.startsWith('/') ? arg : '/' + arg);
    const ping = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${KEY}`;
    try {
      const res = await fetch(ping);
      const ok = res.status === 200 || res.status === 202;
      console.log(`${ok ? 'OK' : 'FAIL'} ${res.status} ${res.statusText} - ${url}`);
      if (!ok) failed = true;
    } catch (e) {
      console.log(`FAIL (network) - ${url}: ${e.message}`);
      failed = true;
    }
  }
  process.exit(failed ? 1 : 0);
})();
