#!/usr/bin/env python3
"""
Serves dist/ with directory index.html fallback — mirrors GitHub Pages behaviour.
Usage: python3 serve-dist.py [port]
"""
import http.server, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
ROOT = os.path.join(os.path.dirname(__file__), 'dist')


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        # Strip query string for path resolution
        path = self.path.split('?')[0].split('#')[0]

        # Try the path as-is first (files: .css, .js, .png, etc.)
        fs_path = os.path.join(ROOT, path.lstrip('/'))
        if os.path.isfile(fs_path):
            return super().do_GET()

        # Directory → serve index.html from that directory
        if os.path.isdir(fs_path):
            index = os.path.join(fs_path, 'index.html')
            if os.path.isfile(index):
                self.path = path.rstrip('/') + '/index.html'
                return super().do_GET()

        # Clean URL without trailing slash → redirect to /path/
        if not path.endswith('/') and os.path.isfile(os.path.join(ROOT, path.lstrip('/'), 'index.html')):
            self.send_response(301)
            self.send_header('Location', path + '/')
            self.end_headers()
            return

        # Fallback: root index.html (SPA catch-all)
        self.path = '/index.html'
        super().do_GET()

    def log_message(self, fmt, *args):
        print(f'  {self.address_string()} {fmt % args}')


print(f'Serving dist/ at http://localhost:{PORT}')
print('Ctrl-C to stop\n')
http.server.HTTPServer(('', PORT), Handler).serve_forever()
