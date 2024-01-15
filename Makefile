define get_reserved
push @a, /\bon\w+="([^"]+)\(/; END { printf "[%s]\n", join ",", uniq sort @a }
endef

R=$(shell perl -MList::Util=uniq -nle '$(get_reserved)' .index.html)
J=deno run --quiet --allow-read npm:uglify-js --compress top_retain=$R,passes=5 --mangle toplevel,reserved=$R
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

index.html: .index.html .scripts.gen.min.js style.min.css minify.pl
	$A "$<" | $M | $P > "$@"

%.min.css: %.css
	$C "$<" > "$@"

%.min.js: %.js
	$J "$<" > "$@"

%.gen.js: %.js
	$P "$<" > "$@"

.scripts.gen.min.js: .scripts.js .g.js a.gen.js mappings.js tajlorligilumi.js data.gen.js versligilumi.js res/confetti.min.js javascript.js res/jszip-utils.min.js z.js
	$P "$<" | perl -CDAS -pe 's/const +say += +console\.log//' | $J > "$@"

.g.js: .g.ts .g.sh
	bash .g.sh

.PHONEY: clean

clean:
	rm -f index.html a.js data.js scripts.min.js style.min.css
