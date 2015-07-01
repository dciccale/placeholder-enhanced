# vim: ts=4 sw=4 noexpandtab
SHELL  := /bin/bash

build:
	@node ./node_modules/.bin/uglifyjs ./js/jquery.placeholder-enhanced.js -c -m -o ./js/jquery.placeholder-enhanced.min.js

lint:
	@node ./node_modules/.bin/jshint ./js/jquery.placeholder-enhanced.js

.PHONY: lint
