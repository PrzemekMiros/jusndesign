# AEO: discovery and content negotiation

## Implemented

- Root `src/.htaccess` is copied to `public/.htaccess` for the existing FTP deployment. The existing `src/static/.htaccess` applies only to `/static/` and is preserved.
- HTTP `Link` headers advertise real public resources: `/llms.txt`, `/sitemap.xml`, and the homepage Markdown alternative (PL/EN).
- After every Eleventy build, `scripts/build-discovery.cjs` generates `/index.md` and `/en/index.md` from the rendered homepage main content, plus Apache type maps. Source changes therefore update both representations. No extra public API is invented.
- Requests to `/` and `/en/` containing `Accept: text/markdown` use Apache content negotiation. HTML is preferred when client qualities are equal; an explicit Markdown-only request gets Markdown. Native negotiation respects `q=0`. Both HTML and Markdown responses vary on `Accept` to avoid mixing cached representations. Other pages remain HTML.
- `robots.txt`: `search=yes, ai-input=yes, ai-train=no` allows indexing and use in generated answers, while declining model training. These are declared preferences, not access controls.

## Hosting requirements and release verification

Apache 2.4 or compatible hosting must support `.htaccess`, `AllowOverride FileInfo`, `mod_headers`, `mod_mime`, `mod_negotiation`, and `mod_rewrite`. If an existing root `.htaccess` is managed outside this repository, merge its redirects/security rules with this file before release. Do not overwrite unrelated hosting rules. CDN caches must respect `Vary: Accept` (or bypass cache for negotiated requests). Purge old homepage/robots caches after release.

Run `npm run build`, then deploy through the existing GitHub Actions FTP workflow. No DNS changes are made by that workflow. An Eleventy development server does not execute Apache configuration.

Run `node scripts/verify-aeo.cjs https://jusndesigneurope.com` after deployment. It checks the homepage in both languages, MIME types, Link and Vary headers, q=0, HTML preference, and reachability of advertised resources. Then repeat the original external AEO scan. The script can also run against an Apache staging origin. There is no claim of a passing live scan until these checks run on the deployed host.

## Other findings in the supplied scan

| Check | Applicability / next step |
| --- | --- |
| DNS-AID and DNSSEC | Requires DNS provider access and a real agent service to advertise. Do not publish fictional `_agents` endpoints. DNSSEC must be enabled with matching registrar DS records. |
| API Catalog | No public API is implemented here; `contactForm.php` is a website form handler. Add a catalog only when a supported public API and documentation exist. |
| OAuth/OIDC, protected resource, auth.md registration | No agent login/registration or OAuth authorization server exists. Do not publish fabricated issuer/token/JWKS endpoints. |
| MCP Server Card, A2A Agent Card | No corresponding runtime exists. A JSON card alone would falsely advertise capabilities. |
| Agent Skills index | No executable agent skills are distributed by this site. |
| WebMCP | No WebMCP tools are implemented. A separate functional integration would be needed; do not expose the contact form as unattended message sending merely to pass a scan. |
| ARD and Poppy | Optional discovery protocols, not implemented in this change. Assess against the current specifications before adopting them. |

These checks are not all prerequisites for a product website. Mark inapplicable service checks as N/A where the scanner permits it.

References: [Web Linking (RFC 8288)](https://www.rfc-editor.org/info/rfc8288/), [Apache content negotiation](https://httpd.apache.org/docs/2.4/content-negotiation.html), [Content Signals](https://contentsignals.org/).
