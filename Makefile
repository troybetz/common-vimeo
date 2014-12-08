BIN = node_modules/.bin

setup:
	npm install
	mkdir example/build

test/bundle.js: test/*-test.js
	$(BIN)/watchify -p proxyquireify/plugin $^ -o $@

example: example/build/bundle.js example/build/bundle.css

example/build/bundle.js: example/example.js
	$(BIN)/browserify $^ > $@

example/build/bundle.css: example/example.css
	$(BIN)/autoprefixer $^ -o $@

clean:
	rm -rf node_modules example/build

.PHONY: setup example clean
