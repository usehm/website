# usehm.dev

The website and documentation for [Hm](https://github.com/mirzakhany/hm), served by a Cloudflare Worker with static assets.

```sh
npm install
npm run dev        # build, watch, and serve dist/ on http://localhost:4321
npm run preview    # build and run it in the Workers runtime (wrangler dev)
npm run deploy     # build and deploy with wrangler
npm run sync-docs  # copy docs/rpc.md and docs/events.md from ../hm
```

## Layout

| Path | What |
|---|---|
| `src/home.mjs` | The landing page |
| `src/docs.mjs` | The docs page template (sidebar, table of contents, pager) |
| `src/layout.mjs` | Shared `<head>`, nav, footer, icons and site settings |
| `content/docs/*.md` | Docs pages. Front matter: `title`, `description`, `section`, `order` |
| `public/` | Copied as is: CSS, JS, images, `_headers`, `_redirects` |
| `scripts/build.mjs` | Builds `dist/`: pages, `search.json`, `sitemap.xml`, `404.html` |
| `wrangler.jsonc` | The Worker: serves `dist/`, custom domains `usehm.dev` and `www.usehm.dev` |

Docs sections are listed in `scripts/build.mjs` (`sections`); a page's `section` must be one of them.

## Screenshots and video

Screenshots live in `public/img/` and are real captures of the app at 2x. To show a demo video on the landing page, add `public/media/demo.mp4` (H.264, ideally under 10 MB); the build picks it up and puts it above the terminal demo.

## Deploying

The first time:

1. `npx wrangler login`
2. Make sure the `usehm.dev` zone is on the same Cloudflare account (the `routes` in `wrangler.jsonc` attach the domains). Remove `routes` to deploy to `*.workers.dev` only.
3. `npm run deploy`

From CI, `.github/workflows/deploy.yml` deploys on every push to `main`. It needs the `CLOUDFLARE_API_TOKEN` (with the "Edit Cloudflare Workers" template) and `CLOUDFLARE_ACCOUNT_ID` repository secrets.

To redirect `www.usehm.dev` to the apex, add a redirect rule in the Cloudflare dashboard (Rules → Redirect Rules); `_redirects` only handles paths.
