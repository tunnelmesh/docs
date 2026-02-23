# TunnelMesh Docs

Source for the TunnelMesh documentation site, served at **[read.tunnelmesh.io](https://read.tunnelmesh.io)**.

Built as a pure static site — no npm, no dependencies. Open `index.html` in a browser via a local web server.

```bash
make serve        # http://localhost:8080
```

---

## Publishing to GitHub Pages

The site is built by `build.js` (Node.js built-ins only — no npm) and deployed from the `gh-pages` branch. Every push to `main` triggers the GitHub Actions workflow, which builds pre-rendered HTML for SEO and publishes it automatically within ~60 seconds.

### First-time setup

#### 1. Create the GitHub repository

Create a new repository on GitHub (e.g. `tunnelmesh/tunnelmesh-docs`) and push this repo to it:

```bash
git remote add origin git@github.com:tunnelmesh/tunnelmesh-docs.git
git push -u origin main
```

#### 2. Enable GitHub Pages from the `gh-pages` branch

1. Go to **Settings → Pages** in the repository
2. Under **Source**, select **Deploy from a branch**
3. Set branch to `gh-pages`, folder to `/ (root)`
4. Click **Save**

GitHub Actions will create the `gh-pages` branch on the first push to `main`.

#### 3. Configure DNS

Add a `CNAME` record with your DNS provider:

| Type  | Name   | Value                  |
|-------|--------|------------------------|
| CNAME | `read` | `tunnelmesh.github.io` |

TTL of 300–3600 is fine. GitHub Pages handles HTTPS automatically via Let's Encrypt once the DNS record propagates (usually a few minutes, up to an hour).

#### 4. Set the custom domain in GitHub

1. Go to **Settings → Pages**
2. Under **Custom domain**, enter `read.tunnelmesh.io`
3. Click **Save** — GitHub will verify the DNS record
4. Once verified, tick **Enforce HTTPS**

The site is now live at **[https://read.tunnelmesh.io](https://read.tunnelmesh.io)**.

---

## Local build

```bash
make build        # Generates dist/  (requires Node.js 18+)
make serve        # Serves source at http://localhost:8080
```

The build script (`build.js`) pre-renders every doc and blog page to clean URLs so search engines can index them without executing JavaScript. It downloads marked.js from the CDN once and caches it in `.build-cache/`.

---

## Content

### Documentation

Markdown files live in `docs/`. Edit them directly — this repo is the source of truth.

```
docs/
├── GETTING_STARTED.md
├── ADMIN.md
├── CLI.md
├── CLOUD_DEPLOYMENT.md
├── DOCKER.md
├── BENCHMARKING.md
├── S3_STORAGE.md
├── WIREGUARD.md
├── USER_IDENTITY.md
├── INTERNAL_PACKET_FILTER.md
└── NFS.md
```

To add a new doc page, drop a `.md` file in `docs/` and register it in both:
- `DOC_SECTIONS` in `js/app.js` (add `id`, `slug`, `title` to the right section)
- `ALL_DOCS` in `build.js` (same `id`, `slug`, `title`)

Images for docs go in `docs/images/` and are referenced as `images/filename.png`.

### Blog

Blog posts are markdown files in `articles/`. Register each post in `articles/manifest.json`:

```json
{
  "slug": "my-post",
  "title": "Post Title",
  "date": "2026-01-01",
  "author": "Author Name",
  "excerpt": "One sentence shown on the blog index."
}
```

Set `"draft": true` to hide a post from the index while keeping it accessible at its direct URL for review.

Images for blog posts go in `articles/images/`.
