#!/usr/bin/env node
/**
 * build.js — Pre-renders HTML pages for SEO
 *
 * Generates dist/ with:
 *   dist/index.html                    root (Getting Started, pre-rendered)
 *   dist/docs/{slug}/index.html        one page per doc
 *   dist/blog/index.html               blog index
 *   dist/blog/{slug}/index.html        one page per published article
 *   dist/sitemap.xml
 *   dist/robots.txt
 *
 * Static assets (css/, js/, img/, docs/, articles/) are copied to dist/.
 *
 * Uses only Node.js built-ins. Downloads marked.js 9.1.6 from CDN once
 * and caches it in .build-cache/.
 */
'use strict';

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const vm    = require('vm');

const ROOT        = __dirname;
const DIST        = path.join(ROOT, 'dist');
const CACHE       = path.join(ROOT, '.build-cache');
const SITE        = 'https://read.tunnelmesh.io';
const MARKED_URL  = 'https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js';
const MARKED_FILE = path.join(CACHE, 'marked.min.js');

// ── Doc manifest (mirrors DOC_SECTIONS in js/app.js) ──────────
const ALL_DOCS = [
  { id: 'GETTING_STARTED',       slug: 'getting-started',  title: 'Quick Start Guide' },
  { id: 'ADMIN',                  slug: 'admin',            title: 'Admin Guide' },
  { id: 'USER_IDENTITY',          slug: 'user-identity',    title: 'User Identity & RBAC' },
  { id: 'WIREGUARD',              slug: 'wireguard',        title: 'WireGuard Integration' },
  { id: 'INTERNAL_PACKET_FILTER', slug: 'packet-filter',    title: 'Internal Packet Filter' },
  { id: 'S3_STORAGE',             slug: 's3-storage',       title: 'S3-Compatible Storage' },
  { id: 'NFS',                    slug: 'nfs',              title: 'NFS File Sharing' },
  { id: 'DOCKER',                 slug: 'docker',           title: 'Docker Deployment' },
  { id: 'CLOUD_DEPLOYMENT',       slug: 'cloud-deployment', title: 'Cloud Deployment' },
  { id: 'CLI',                    slug: 'cli',              title: 'CLI Reference' },
  { id: 'BENCHMARKING',           slug: 'benchmarking',     title: 'Benchmarking' },
];

// ── Helpers ────────────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function firstParagraph(html) {
  const m = html.match(/<p>([\s\S]*?)<\/p>/);
  return m ? stripTags(m[1]).slice(0, 160) : '';
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00')
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close(() => { try { fs.unlinkSync(dest); } catch {} });
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => {
      try { fs.unlinkSync(dest); } catch {}
      reject(err);
    });
  });
}

function cpDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) cpDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

// ── Load + configure marked.js ─────────────────────────────────
async function loadMarked() {
  fs.mkdirSync(CACHE, { recursive: true });
  if (!fs.existsSync(MARKED_FILE)) {
    process.stdout.write('  Downloading marked.js 9.1.6 … ');
    await download(MARKED_URL, MARKED_FILE);
    console.log('OK');
  }
  const src = fs.readFileSync(MARKED_FILE, 'utf8');
  const ctx = {};
  vm.runInNewContext(src, ctx);
  const marked = ctx.marked;

  // Custom renderer: heading IDs + GitHub-style callouts
  marked.use({
    renderer: {
      heading(text, level, raw) {
        return `<h${level} id="${slugify(raw)}">${text}</h${level}>\n`;
      },
      blockquote(quote) {
        const m = quote.match(
          /^\s*<p>\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]\n?([\s\S]*?)<\/p>\s*$/i
        );
        if (!m) return `<blockquote>${quote}</blockquote>\n`;
        const type  = m[1].toUpperCase();
        const label = type.charAt(0) + type.slice(1).toLowerCase();
        const body  = m[2].trim();
        return `<div class="callout ${type.toLowerCase()}">\n` +
          `  <div class="callout-title"><span>${label}</span></div>\n` +
          `  <div class="callout-body"><p>${body}</p></div>\n` +
          `</div>\n`;
      },
    },
  });

  return marked;
}

// ── HTML template ─────────────────────────────────────────────
let _tpl = null;
function getTemplate() {
  if (_tpl) return _tpl;
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  // Make local asset references root-relative so subdirectory pages work
  html = html
    .replace(/href="css\//g,  'href="/css/')
    .replace(/href="img\//g,  'href="/img/')
    .replace(/src="img\//g,   'src="/img/')
    .replace(/src="js\//g,    'src="/js/');
  _tpl = html;
  return _tpl;
}

function buildPage({ title, description, canonical, prerendered, articleHtml, blogHtml }) {
  let html = getTemplate();

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);

  // <meta name="description">
  const desc = esc(description || '');
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${desc}">`
  );

  // Canonical + OG (before </head>)
  const headExtra = [
    `  <link rel="canonical" href="${canonical}">`,
    `  <meta property="og:title" content="${esc(title)}">`,
    `  <meta property="og:description" content="${desc}">`,
    `  <meta property="og:url" content="${canonical}">`,
    `  <meta property="og:type" content="website">`,
  ].join('\n');
  html = html.replace('</head>', `${headExtra}\n</head>`);

  // Pre-rendered article content (docs view)
  if (articleHtml != null) {
    html = html.replace(
      /<article id="doc-article"[^>]*>[\s\S]*?<\/article>/,
      `<article id="doc-article" class="doc-article" aria-live="polite">${articleHtml}</article>`
    );
  }

  // Pre-rendered blog content (blog view)
  if (blogHtml != null) {
    html = html.replace(
      /<main class="blog-main"[^>]*>[\s\S]*?<\/main>/,
      `<main class="blog-main" id="blog-main" aria-live="polite">${blogHtml}</main>`
    );
  }

  // window.__PRERENDERED marker (before </body>)
  const prScript = `<script>window.__PRERENDERED = ${JSON.stringify(prerendered)};</script>`;
  html = html.replace('</body>', `${prScript}\n</body>`);

  return html;
}

// ── Doc pages ─────────────────────────────────────────────────
async function buildDocs(marked) {
  console.log('\n  Docs:');
  for (const doc of ALL_DOCS) {
    const mdPath = path.join(ROOT, 'docs', `${doc.id}.md`);
    if (!fs.existsSync(mdPath)) {
      console.log(`    [skip] ${doc.id}.md not found`);
      continue;
    }
    const md          = fs.readFileSync(mdPath, 'utf8');
    const articleHtml = marked.parse(md);
    const desc        = firstParagraph(articleHtml);
    const canonical   = `${SITE}/docs/${doc.slug}/`;

    const html = buildPage({
      title: `${doc.title} — TunnelMesh Docs`,
      description: desc,
      canonical,
      prerendered: { type: 'doc', id: doc.id },
      articleHtml,
    });

    writeFile(path.join(DIST, 'docs', doc.slug, 'index.html'), html);
    console.log(`    /docs/${doc.slug}/`);
  }
}

// ── Blog pages ────────────────────────────────────────────────
function buildBlogIndexHtml(articles) {
  if (articles.length === 0) {
    return `<div class="blog-index">
  <div class="blog-header">
    <h1>Blog</h1>
    <p>Engineering notes, release announcements, and deep-dives from the TunnelMesh team.</p>
  </div>
  <div class="blog-empty"><h2>No articles yet</h2></div>
</div>`;
  }
  const cards = articles.map(a => `
  <a class="blog-card" href="/blog/${a.slug}/">
    <div class="blog-card-meta">
      <span class="blog-card-date">${formatDate(a.date)}</span>
      ${a.author ? `<span class="blog-card-author">${esc(a.author)}</span>` : ''}
    </div>
    <h2>${esc(a.title)}</h2>
    ${a.excerpt ? `<p>${esc(a.excerpt)}</p>` : ''}
    <span class="blog-card-read">Read article</span>
  </a>`).join('');

  return `<div class="blog-index">
  <div class="blog-header">
    <h1>Blog</h1>
    <p>Engineering notes, release announcements, and deep-dives from the TunnelMesh team.</p>
  </div>
  <div class="blog-grid">${cards}
  </div>
</div>`;
}

function buildBlogArticleHtml(meta, contentHtml) {
  return `<div class="blog-article-wrap">
  <a class="blog-back" href="/blog/">&#8592; All articles</a>
  <div class="blog-article-meta">
    <span class="meta-date">${formatDate(meta.date)}</span>
    ${meta.author ? `<span>· ${esc(meta.author)}</span>` : ''}
  </div>
  <div class="blog-article-content" id="blog-article-inner">${contentHtml}</div>
</div>`;
}

async function buildBlog(marked) {
  console.log('\n  Blog:');
  const manifestPath = path.join(ROOT, 'articles', 'manifest.json');
  if (!fs.existsSync(manifestPath)) return [];

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const articles  = (manifest.articles || []).filter(a => !a.draft);

  // Blog index
  const indexHtml = buildBlogIndexHtml(articles);
  writeFile(
    path.join(DIST, 'blog', 'index.html'),
    buildPage({
      title:       'Blog — TunnelMesh',
      description: 'Engineering notes, release announcements, and deep-dives from the TunnelMesh team.',
      canonical:   `${SITE}/blog/`,
      prerendered: { type: 'blog-index' },
      blogHtml:    indexHtml,
    })
  );
  console.log('    /blog/');

  // Individual articles
  for (const meta of articles) {
    const mdPath = path.join(ROOT, 'articles', `${meta.slug}.md`);
    if (!fs.existsSync(mdPath)) continue;

    const md          = fs.readFileSync(mdPath, 'utf8');
    const stripped    = md.replace(/^---[\s\S]*?---\n/, '');
    const contentHtml = marked.parse(stripped);
    const desc        = meta.excerpt || firstParagraph(contentHtml);
    const canonical   = `${SITE}/blog/${meta.slug}/`;
    const blogHtml    = buildBlogArticleHtml(meta, contentHtml);

    writeFile(
      path.join(DIST, 'blog', meta.slug, 'index.html'),
      buildPage({
        title:       `${meta.title} — TunnelMesh Blog`,
        description: desc,
        canonical,
        prerendered: { type: 'blog-article', slug: meta.slug },
        blogHtml,
      })
    );
    console.log(`    /blog/${meta.slug}/`);
  }

  return articles;
}

// ── Sitemap ───────────────────────────────────────────────────
function buildSitemap(articles) {
  const today   = new Date().toISOString().slice(0, 10);
  const docUrls = ALL_DOCS.map(d =>
    `  <url><loc>${SITE}/docs/${d.slug}/</loc><lastmod>${today}</lastmod></url>`
  );
  const blogUrls = articles.map(a =>
    `  <url><loc>${SITE}/blog/${a.slug}/</loc><lastmod>${a.date || today}</lastmod></url>`
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${SITE}/</loc><lastmod>${today}</lastmod></url>`,
    `  <url><loc>${SITE}/blog/</loc><lastmod>${today}</lastmod></url>`,
    ...docUrls,
    ...blogUrls,
    '</urlset>',
    '',
  ].join('\n');
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log('Building dist/ …\n');

  // Clean dist/
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const marked = await loadMarked();

  await buildDocs(marked);
  const articles = await buildBlog(marked);

  // Root index = Getting Started (different canonical: SITE + '/')
  const gsDoc = ALL_DOCS[0];
  const gsMd  = fs.readFileSync(path.join(ROOT, 'docs', `${gsDoc.id}.md`), 'utf8');
  const gsHtml = marked.parse(gsMd);
  writeFile(
    path.join(DIST, 'index.html'),
    buildPage({
      title:       `${gsDoc.title} — TunnelMesh Docs`,
      description: firstParagraph(gsHtml),
      canonical:   `${SITE}/`,
      prerendered: { type: 'doc', id: gsDoc.id },
      articleHtml: gsHtml,
    })
  );
  console.log('\n  /  (root)');

  // sitemap + robots
  writeFile(path.join(DIST, 'sitemap.xml'), buildSitemap(articles));
  writeFile(
    path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`
  );
  console.log('  /sitemap.xml');
  console.log('  /robots.txt');

  // Static assets
  console.log('\n  Static assets:');
  for (const dir of ['css', 'js', 'img', 'docs', 'articles']) {
    cpDir(path.join(ROOT, dir), path.join(DIST, dir));
    console.log(`    ${dir}/`);
  }
  for (const file of ['CNAME']) {
    const src = path.join(ROOT, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST, file));
      console.log(`    ${file}`);
    }
  }

  console.log('\nDone  →  dist/\n');
}

main().catch(err => { console.error(err); process.exit(1); });
