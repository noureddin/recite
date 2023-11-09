R=$(shell perl -nle 'push @a, /\bon\w+="([^"]+)\(\)/; END { printf "[%s]\n", join ",", sort @a }' .index.html)
J=deno run --quiet --allow-read npm:uglify-js -c passes=5 -m toplevel,reserved=$R
C=deno run --quiet --allow-read npm:clean-css-cli
M=perl -CSAD minify.pl
A=perl -CSAD -nE 'while(s/<<!!(?!cat )(.*?)>>/`$$1`/ge){} print'
P=perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print'

# minify.pl minifies HTML, but the transformations it applies are bad for SVG and JS.
# It can be made to be more context-sensitive, but it's much better to separate them
#   both into their files and not minify them at all.
# Therefore the preprocesser was split into the non-including preprocesser ($A),
#   and after minification the usual (now including only, for html) preprocesser ($P)
#   is called.
# All of that concerns only index.html, because it needs minify.pl too;
#   other files using the preprocesser are unaffected.

index.html: .index.html a.js data.js scripts.min.js style.min.css minify.pl
	$A "$<" | $M | $P > "$@"

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
