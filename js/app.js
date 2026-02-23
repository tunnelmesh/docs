/* ─────────────────────────────────────────────────────────────
   TunnelMesh Docs — App
   ───────────────────────────────────────────────────────────── */

// ── Doc sections / TOC manifest ──────────────────────────────
const DOC_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>`,
    docs: [
      { id: 'GETTING_STARTED', title: 'Quick Start Guide' },
    ]
  },
  {
    id: 'configuration',
    title: 'Configuration',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
    </svg>`,
    docs: [
      { id: 'ADMIN',         title: 'Admin Guide' },
      { id: 'USER_IDENTITY', title: 'User Identity & RBAC' },
    ]
  },
  {
    id: 'networking',
    title: 'Networking',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="4" r="2"/>
      <circle cx="4" cy="20" r="2"/>
      <circle cx="20" cy="20" r="2"/>
      <path d="M12 6v4m-6.3 8.5 5.3-4.5m5.3 4.5-5.3-4.5"/>
      <circle cx="12" cy="13" r="2"/>
    </svg>`,
    docs: [
      { id: 'WIREGUARD',              title: 'WireGuard Integration' },
      { id: 'INTERNAL_PACKET_FILTER', title: 'Internal Packet Filter' },
    ]
  },
  {
    id: 'storage',
    title: 'Storage',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>`,
    docs: [
      { id: 'S3_STORAGE', title: 'S3-Compatible Storage' },
      { id: 'NFS',        title: 'NFS File Sharing' },
    ]
  },
  {
    id: 'deployment',
    title: 'Deployment',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="17"/>
      <line x1="9" y1="14" x2="15" y2="14"/>
    </svg>`,
    docs: [
      { id: 'DOCKER',           title: 'Docker Deployment' },
      { id: 'CLOUD_DEPLOYMENT', title: 'Cloud Deployment' },
    ]
  },
  {
    id: 'reference',
    title: 'Reference',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>`,
    docs: [
      { id: 'CLI',          title: 'CLI Reference' },
      { id: 'BENCHMARKING', title: 'Benchmarking' },
    ]
  },
];

// Flat ordered list of all docs for prev/next
const ALL_DOCS = DOC_SECTIONS.flatMap(s => s.docs);

// ── SVG icon helpers ──────────────────────────────────────────
const ICONS = {
  chevronLeft:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  link:         `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  copy:         `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check:        `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  arrowLeft:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  externalLink: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  pen:          `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
};

// ── Callout (GitHub-style admonitions) ────────────────────────
const CALLOUTS = {
  NOTE: {
    label: 'Note',
    cssVar: '--callout-note',
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  },
  IMPORTANT: {
    label: 'Important',
    cssVar: '--callout-important',
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  WARNING: {
    label: 'Warning',
    cssVar: '--callout-warning',
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  TIP: {
    label: 'Tip',
    cssVar: '--callout-tip',
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><path d="M12 6a6 6 0 0 1 6 6c0 2.4-1.4 4.5-3.5 5.6V20a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-2.4C7.4 16.5 6 14.4 6 12a6 6 0 0 1 6-6z"/><line x1="10" y1="22" x2="14" y2="22"/></svg>`,
  },
  CAUTION: {
    label: 'Caution',
    cssVar: '--callout-caution',
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  },
};

// ── Slug helper ───────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ── App state ─────────────────────────────────────────────────
const state = {
  currentView: 'docs',
  currentDocId: null,
  currentBlogSlug: null,
  blogManifest: null,
  tocObserver: null,
};

// ── Theme ─────────────────────────────────────────────────────
function loadTheme() {
  const saved = localStorage.getItem('tm-docs-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateHljsTheme(saved);
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('tm-docs-theme', next);
  updateHljsTheme(next);
}

function updateHljsTheme(theme) {
  const link = document.getElementById('hljs-theme');
  if (!link) return;
  if (theme === 'light') {
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/one-light.min.css';
  } else {
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/monokai.min.css';
  }
}

// ── Sidebar ───────────────────────────────────────────────────
function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  nav.innerHTML = DOC_SECTIONS.map((section, si) => `
    <div class="sidebar-section">
      <div class="sidebar-section-title">
        ${section.icon}
        ${section.title}
      </div>
      <ul class="sidebar-docs">
        ${section.docs.map(doc => `
          <li>
            <a class="sidebar-doc-link"
               data-doc="${doc.id}"
               href="#/docs/${doc.id}"
               title="${doc.title}">
              ${doc.title}
            </a>
          </li>
        `).join('')}
      </ul>
    </div>
    ${si < DOC_SECTIONS.length - 1 ? '<hr class="sidebar-sep">' : ''}
  `).join('');
}

function setActiveSidebarLink(docId) {
  document.querySelectorAll('.sidebar-doc-link').forEach(link => {
    link.classList.toggle('active', link.dataset.doc === docId);
  });
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── View switching ────────────────────────────────────────────
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('hidden', v.id !== `view-${viewId}`);
    v.classList.toggle('active', v.id === `view-${viewId}`);
  });

  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === viewId);
  });

  state.currentView = viewId;
}

// ── Markdown rendering ────────────────────────────────────────
function configureMarked() {
  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      // Headings with stable IDs and anchor links
      heading(text, level, raw) {
        const id = slugify(raw || text);
        return `<h${level} id="${id}">${text}<a class="heading-anchor" href="#${id}" aria-label="Link to section">${ICONS.link}</a></h${level}>\n`;
      },
      // External links open in new tab
      link(href, title, text) {
        const isExternal = typeof href === 'string' &&
          (href.startsWith('http://') || href.startsWith('https://'));
        const ext = isExternal ? ` ${ICONS.externalLink}` : '';
        return `<a href="${href || ''}"${title ? ` title="${title}"` : ''}${isExternal ? ' target="_blank" rel="noopener"' : ''}>${text}${ext}</a>`;
      },
      // GitHub-style callout admonitions: > [!NOTE], > [!IMPORTANT], etc.
      blockquote(quote) {
        const match = quote.match(/^<p>\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\][ \t]?\n?/i);
        if (match) {
          const type = match[1].toUpperCase();
          const def = CALLOUTS[type];
          // Strip the [!TYPE] tag from the first paragraph
          const body = quote.replace(/^<p>\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\][ \t]?\n?/i, '<p>');
          return `<div class="callout callout-${type.toLowerCase()}">` +
            `<div class="callout-header">${def.icon}<span class="callout-label">${def.label}</span></div>` +
            `<div class="callout-body">${body}</div>` +
            `</div>\n`;
        }
        return `<blockquote>${quote}</blockquote>\n`;
      },
    }
  });
}

function postProcess(html) {
  // Wrap pre>code blocks and add copy buttons + language labels
  const div = document.createElement('div');
  div.innerHTML = html;

  div.querySelectorAll('pre code').forEach(code => {
    const pre = code.parentElement;
    const lang = [...code.classList]
      .find(c => c.startsWith('language-'))
      ?.replace('language-', '') || '';

    if (lang) {
      const label = document.createElement('span');
      label.className = 'code-lang';
      label.textContent = lang;
      pre.appendChild(label);
    }

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = `${ICONS.copy} Copy`;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(code.textContent || '').then(() => {
        btn.innerHTML = `${ICONS.check} Copied`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `${ICONS.copy} Copy`;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
    pre.appendChild(btn);
  });

  return div.innerHTML;
}

// ── Page TOC ──────────────────────────────────────────────────
function buildPageTOC() {
  const article = document.getElementById('doc-article');
  const tocNav = document.getElementById('page-toc-nav');
  if (!article || !tocNav) return;

  const headings = article.querySelectorAll('h2, h3, h4');
  if (headings.length === 0) {
    document.getElementById('page-toc').style.display = 'none';
    return;
  }
  document.getElementById('page-toc').style.display = '';

  tocNav.innerHTML = [...headings].map(h => {
    const level = h.tagName.toLowerCase();
    const id = h.id;
    const text = h.textContent.replace(/\s*#\s*$/, '').trim();
    return `<a class="toc-entry toc-${level}" href="#${id}">${text}</a>`;
  }).join('');

  // Observe headings for active highlight
  if (state.tocObserver) state.tocObserver.disconnect();

  const entries = tocNav.querySelectorAll('.toc-entry');
  state.tocObserver = new IntersectionObserver(
    (obs) => {
      obs.forEach(entry => {
        if (entry.isIntersecting) {
          entries.forEach(e => e.classList.remove('active'));
          const active = tocNav.querySelector(`[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-64px 0px -70% 0px', threshold: 0 }
  );

  headings.forEach(h => state.tocObserver.observe(h));
}

// ── Pagination ────────────────────────────────────────────────
function buildPagination(docId) {
  const el = document.getElementById('doc-pagination');
  if (!el) return;

  const idx = ALL_DOCS.findIndex(d => d.id === docId);
  const prev = idx > 0 ? ALL_DOCS[idx - 1] : null;
  const next = idx < ALL_DOCS.length - 1 ? ALL_DOCS[idx + 1] : null;

  el.innerHTML = `
    ${prev ? `
      <a class="pag-prev" href="#/docs/${prev.id}">
        ${ICONS.arrowLeft}
        <span>
          <span class="pag-label">Previous</span>
          <span class="pag-title">${prev.title}</span>
        </span>
      </a>
    ` : '<span></span>'}
    ${next ? `
      <a class="pag-next" href="#/docs/${next.id}">
        <span>
          <span class="pag-label">Next</span>
          <span class="pag-title">${next.title}</span>
        </span>
        ${ICONS.chevronRight}
      </a>
    ` : ''}
  `;
}

// ── Load a doc ────────────────────────────────────────────────
async function loadDoc(docId) {
  // Validate
  const docDef = ALL_DOCS.find(d => d.id === docId);
  if (!docDef) {
    docId = ALL_DOCS[0].id;
  }

  state.currentDocId = docId;
  showView('docs');

  const article = document.getElementById('doc-article');
  article.innerHTML = `<div class="doc-loading"><div class="loading-spinner"></div><span>Loading…</span></div>`;

  setActiveSidebarLink(docId);
  buildPagination(docId);

  try {
    const res = await fetch(`docs/${docId}.md`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();
    const html = marked.parse(md);
    article.innerHTML = postProcess(html);

    // Syntax highlight
    article.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block);
    });

    buildPageTOC();
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Handle in-page anchor if present
    const hash = window.location.hash;
    if (hash.length > 1 && !hash.startsWith('#/')) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }

    document.title = `${docDef?.title || docId} — TunnelMesh Docs`;
  } catch (err) {
    article.innerHTML = `
      <div style="padding: 2rem 0; color: var(--text-muted);">
        <h2 style="color: var(--heading); margin-bottom: 0.5rem;">Could not load document</h2>
        <p>Run a local web server to view docs: <code>python3 -m http.server 8000</code></p>
        <p style="margin-top: 0.5rem; font-size: 0.82rem; opacity: 0.6;">Error: ${err.message}</p>
      </div>
    `;
  }
}

// ── Blog ──────────────────────────────────────────────────────
async function loadBlogManifest() {
  if (state.blogManifest) return state.blogManifest;
  try {
    const res = await fetch('articles/manifest.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.blogManifest = await res.json();
    return state.blogManifest;
  } catch {
    state.blogManifest = { articles: [] };
    return state.blogManifest;
  }
}

async function showBlogIndex() {
  showView('blog');
  document.title = 'Blog — TunnelMesh Docs';
  const main = document.getElementById('blog-main');
  main.innerHTML = `<div class="doc-loading"><div class="loading-spinner"></div><span>Loading…</span></div>`;

  const manifest = await loadBlogManifest();
  const articles = manifest.articles || [];

  if (articles.length === 0) {
    main.innerHTML = `
      <div class="blog-index">
        <div class="blog-header">
          <h1>${ICONS.pen} &nbsp;Blog</h1>
          <p>Engineering notes, release announcements, and deep-dives from the TunnelMesh team.</p>
        </div>
        <div class="blog-empty">
          <h2>No articles yet</h2>
          <p>Add markdown files to the <code>articles/</code> directory and register them in <code>articles/manifest.json</code>.</p>
        </div>
      </div>
    `;
    return;
  }

  main.innerHTML = `
    <div class="blog-index">
      <div class="blog-header">
        <h1>${ICONS.pen} &nbsp;Blog</h1>
        <p>Engineering notes, release announcements, and deep-dives from the TunnelMesh team.</p>
      </div>
      <div class="blog-grid">
        ${articles.map(a => `
          <a class="blog-card" href="#/blog/${a.slug}">
            <div class="blog-card-meta">
              <span class="blog-card-date">${formatDate(a.date)}</span>
              ${a.author ? `<span class="blog-card-author">${a.author}</span>` : ''}
            </div>
            <h2>${a.title}</h2>
            ${a.excerpt ? `<p>${a.excerpt}</p>` : ''}
            <span class="blog-card-read">${ICONS.chevronRight} Read article</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

async function showBlogArticle(slug) {
  showView('blog');
  const main = document.getElementById('blog-main');
  main.innerHTML = `<div class="doc-loading"><div class="loading-spinner"></div><span>Loading…</span></div>`;

  const manifest = await loadBlogManifest();
  const meta = (manifest.articles || []).find(a => a.slug === slug);

  try {
    const res = await fetch(`articles/${slug}.md`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();

    // Strip frontmatter if present
    const stripped = md.replace(/^---[\s\S]*?---\n/, '');
    const html = marked.parse(stripped);
    const processed = postProcess(html);

    document.title = `${meta?.title || slug} — TunnelMesh Blog`;

    main.innerHTML = `
      <div class="blog-article-wrap">
        <a class="blog-back" href="#/blog">
          ${ICONS.arrowLeft} All articles
        </a>
        ${meta ? `
          <div class="blog-article-meta">
            <span class="meta-date">${formatDate(meta.date)}</span>
            ${meta.author ? `<span>· ${meta.author}</span>` : ''}
          </div>
        ` : ''}
        <div class="blog-article-content">
          ${processed}
        </div>
      </div>
    `;

    main.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
    window.scrollTo({ top: 0, behavior: 'instant' });
  } catch (err) {
    main.innerHTML = `
      <div class="blog-article-wrap">
        <a class="blog-back" href="#/blog">${ICONS.arrowLeft} All articles</a>
        <p style="color: var(--text-muted); padding: 2rem 0;">Could not load article: ${err.message}</p>
      </div>
    `;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Router ────────────────────────────────────────────────────
function handleRoute() {
  const raw = window.location.hash;

  // In-page anchor clicks (heading links, page TOC) — let the browser
  // scroll naturally, don't re-route.
  if (raw && !raw.startsWith('#/')) return;

  const hash = raw || '#/docs/GETTING_STARTED';

  if (hash.startsWith('#/blog/')) {
    const slug = hash.replace('#/blog/', '');
    state.currentBlogSlug = slug;
    showBlogArticle(slug);

  } else if (hash.startsWith('#/blog')) {
    state.currentBlogSlug = null;
    showBlogIndex();
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === 'blog');
    });

  } else {
    const docId = hash.replace('#/docs/', '') || 'GETTING_STARTED';
    loadDoc(docId);
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === 'docs');
    });
  }
}

// ── Init ──────────────────────────────────────────────────────
function init() {
  loadTheme();
  configureMarked();
  buildSidebar();

  // Nav tab clicks
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      if (view === 'docs') {
        const docId = state.currentDocId || 'GETTING_STARTED';
        window.location.hash = `#/docs/${docId}`;
      } else if (view === 'blog') {
        window.location.hash = '#/blog';
      }
    });
  });

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Hamburger
  document.getElementById('hamburger').addEventListener('click', openSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

  // Sidebar link delegation
  document.getElementById('sidebar-nav').addEventListener('click', e => {
    const link = e.target.closest('.sidebar-doc-link');
    if (link) closeSidebar();
  });

  // Router
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
