# vim: ts=4 sw=4 noexpandtab
SHELL := /bin/bash
LICENSE_SHORT := "/*! jQuery Placeholder Enhanced 1.6.9 | @tdecs | under the MIT license */"
BIN := ./node_modules/.bin
INPUT := ./js/jquery.placeholder-enhanced.js
OUTPUT := ./js/jquery.placeholder-enhanced.min.js

build:
	@rm ${OUTPUT}
	@echo ${LICENSE_SHORT} > ${OUTPUT}
	@node ${BIN}/uglifyjs ${INPUT} -c -m --comments >> ${OUTPUT}

lint:
	@node ${BIN}/jshint ${INPUT}

.PHONY: lint
