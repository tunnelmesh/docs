.PHONY: serve build install-hooks

serve:
	python3 -m http.server 8080 --directory .

build:
	node build.js

install-hooks:
	cp hooks/pre-commit .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit
	@echo "Git hooks installed."
