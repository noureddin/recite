index.html: .index.html a.js data.js *.js *.css
	perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print' "$<" > "$@"

%.js: .%.js
	perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print' "$<" > "$@"

.PHONEY: clean

clean:
	rm -f index.html a.js data.js
