# Deployment

## Netlify

[`netlify.toml`](../netlify.toml) holds the build command, the Node version, caching and security headers, so nothing needs to be filled in on the Netlify side.

1. Push the project to GitHub. The `.gitignore` already leaves out `node_modules`, `dist` and the generated files.
2. In Netlify: **Add new site, Import an existing project**, pick the repository and click **Deploy**.
3. Custom domain: **Domain management, Add a domain**, then set it as the primary domain.
4. Run **Deploys, Trigger deploy, Clear cache and deploy site**. Canonical links, the sitemap and the RSS feed are written at build time with the site's main address, so they need one new build after the domain changes.
5. In Google Search Console, add the site and submit `https://yourdomain.com/sitemap.xml`.

What Netlify does by itself:

- The site address comes from Netlify's `URL` variable. It is `your-site.netlify.app` first and the custom domain once it is the primary one.
- Deploy previews and branch deploys get `noindex, nofollow`, so Google does not list test copies next to the real site.
- Missing addresses show the `404.html` page.
- Cover WebP files are made during the build, so only the JPG is committed.

Dragging the `dist` folder onto Netlify also works, but the address then has to be set by hand: `SITE_URL=https://yourdomain.com npm run build`, then upload `dist`.

## Other hosts

Set the address in one of two ways:

- Edit `DEFAULT_URL` at the top of [`src/data/site.js`](../src/data/site.js) (no slash at the end), or
- Set `SITE_URL` on the host, for example `SITE_URL=https://yourdomain.com`.

Upload the `dist/` folder.

## Site address

| Variable | Effect |
| --- | --- |
| `SITE_URL` | Sets the site address (highest priority) |
| `URL` | Set by Netlify. Used when `SITE_URL` is not set |
| `CONTEXT` | Set by Netlify. Anything other than `production` makes every page `noindex, nofollow` |

The build stops with a clear message while the placeholder `https://example.com` is still in place. For a local test build, run `SITE_URL=http://localhost:4173 npm run build`.
