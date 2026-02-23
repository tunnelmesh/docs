.PHONY: serve build

serve:
	python3 -m http.server 8080 --directory .

build:
	node build.js
