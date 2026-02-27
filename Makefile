.PHONY: serve build preview install-hooks

# Serve the source directly (hash routing, no pre-render needed)
serve:
	python3 -m http.server 8080 --directory .

# Build pre-rendered dist/
build:
	node build.js

# Build then serve dist/ — mirrors GitHub Pages (clean URLs, index.html fallback)
preview: build
	python3 serve-dist.py 8084

install-hooks:
	cp hooks/pre-commit .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit
	@echo "Git hooks installed."
