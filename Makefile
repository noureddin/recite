R=$(shell perl -nle 'push @a, /\bon\w+="([^"]+)\(\)/; END { printf "[%s]\n", join ",", sort @a }' .index.html)
J=deno run --quiet --allow-read npm:uglify-js -c passes=5 -m toplevel,reserved=$R
C=deno run --quiet --allow-read npm:clean-css-cli
M=perl -CSAD minify.pl
P=perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print'


index.html: .index.html a.js data.js scripts.min.js style.min.css
	$P "$<" | $M > "$@"

%.min.css: %.css
	$C "$<" > "$@"

%.min.js: %.js
	$J "$<" > "$@"

%.js: .%.js
	$P "$<" > "$@"

scripts.min.js: .scripts.js a.js data.js *.js
	$P "$<" | perl -CDAS -pe 's/const +say += +console\.log//' | $J > "$@"

.PHONEY: clean

clean:
	rm -f index.html a.js data.js scripts.min.js style.min.css
