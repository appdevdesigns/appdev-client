REPORTER = dot

test:

		@NODE_ENV=test mocha-phantomjs \
	-R $(REPORTER) \
	test/test-all.html 
	

.PHONY:test