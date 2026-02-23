.PHONY: serve build preview install-hooks

# Serve the source directly (hash routing, no pre-render needed)
serve:
	python3 -m http.server 8080 --directory .

# Build pre-rendered dist/
build:
	node build.js

# Build then serve dist/ on 8081 — previews exactly what GitHub Pages will serve
# (separate port so it can run alongside 'make serve')
preview: build
	python3 -m http.server 8081 --directory dist

install-hooks:
	cp hooks/pre-commit .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit
	@echo "Git hooks installed."
