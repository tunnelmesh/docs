# TunnelMesh Docs

Source for the TunnelMesh documentation site, served at **[read.tunnelmesh.io](https://read.tunnelmesh.io)**.

Pure static site — no npm, no build step required for local editing.

## Local development

| Command | What it does |
|---------|-------------|
| `make serve` | Serves source at **http://localhost:8080** — no build, changes visible on refresh |
| `make build` | Pre-renders all pages to `dist/` (requires Node.js 18+) |
| `make preview` | Builds then serves `dist/` at **http://localhost:8081** — identical to production |
| `make install-hooks` | Installs the pre-commit lint hook (run once after cloning) |

`make serve` is the fastest loop for editing content. Use `make preview` to verify the full build before pushing.

---

## How the site works

The site is a single-page app (`index.html` + `js/app.js`) with hash-based routing for interactive use. For SEO, `build.js` pre-renders every doc and blog page to a clean URL at build time:

```
dist/
├── index.html                    # Getting Started (root)
├── docs/
│   ├── getting-started/index.html
│   ├── cli/index.html
│   └── …                         # one directory per doc
├── blog/
│   ├── index.html                # blog index
│   └── welcome/index.html        # one directory per article
├── sitemap.xml
└── robots.txt
```

Each pre-rendered page contains the full rendered content (indexed by search engines) and a `window.__PRERENDERED` marker. When JavaScript loads, the SPA detects this marker and hydrates the page — adding syntax highlighting, copy buttons, and the interactive sidebar — without a visible re-render.

`build.js` uses only Node.js built-ins. It downloads marked.js 9.1.6 from the CDN once and caches it in `.build-cache/` (gitignored).

---

## Publishing to GitHub Pages

Every push to `main` triggers GitHub Actions, which runs `node build.js` and deploys `dist/` to the `gh-pages` branch. The site updates within ~60 seconds.

### First-time setup

#### 1. Create the GitHub repository

```bash
git remote add origin git@github.com:tunnelmesh/tunnelmesh-docs.git
git push -u origin main
```

#### 2. Enable GitHub Pages from the `gh-pages` branch

1. Go to **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Set branch to `gh-pages`, folder to `/ (root)` and click **Save**

GitHub Actions creates the `gh-pages` branch automatically on the first push to `main`.

#### 3. Configure DNS

| Type  | Name   | Value                  |
|-------|--------|------------------------|
| CNAME | `read` | `tunnelmesh.github.io` |

#### 4. Set the custom domain in GitHub

1. **Settings → Pages → Custom domain**: enter `read.tunnelmesh.io` and click **Save**
2. Once DNS is verified, tick **Enforce HTTPS**

---

## Adding content

### New doc page

1. Create `docs/MYPAGE.md`
2. Add an entry to `DOC_SECTIONS` in `js/app.js`:
   ```js
   { id: 'MYPAGE', slug: 'my-page', title: 'Page Title' }
   ```
3. Add the same entry to `ALL_DOCS` in `build.js`

The pre-commit hook will block the commit if either registration is missing.

Images go in `docs/images/` and are referenced as `images/filename.png`.

### New blog post

1. Create `articles/my-post.md`
2. Add an entry to `articles/manifest.json`:
   ```json
   {
     "slug": "my-post",
     "title": "Post Title",
     "date": "2026-01-01",
     "author": "Author Name",
     "excerpt": "One sentence shown on the blog index."
   }
   ```

Set `"draft": true` to hide a post from the index while keeping it accessible at its URL.

Images go in `articles/images/`.
