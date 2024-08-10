define get_reserved
push @a, /\bon\w+="([^"]+)\(/; END { printf "[%s]\n", join ",", uniq sort "tv", @a }
endef

R=$(shell perl -MList::Util=uniq -nle '$(get_reserved)' .index.html)
J=deno run --quiet --allow-read --allow-env=UGLIFY_BUG_REPORT npm:uglify-js --compress top_retain=$R,passes=10 --mangle toplevel,reserved=$R
C=deno run --quiet --allow-read --allow-env=HTTP_PROXY,http_proxy npm:clean-css-cli
M=perl -CSAD .minify.pl
A=perl -CSAD -nE 'while(s/<<!!(?!cat )(.*?)>>/`$$1`/ge){} print'
P=perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print'

# .minify.pl minifies HTML, but the transformations it applies are bad for SVG and JS.
# It can be made to be more context-sensitive, but it's much better to separate them
#   both into their files and not minify them at all.
# Therefore the preprocesser was split into the non-including preprocesser ($A),
#   and after minification the usual (now including only, for html) preprocesser ($P)
#   is called.
# All of that concerns only index.html, because it needs .minify.pl too;
#   other files using the preprocesser are unaffected.

index.html: .index.html .scripts.gen.min.js style.min.css .minify.pl
	$A "$<" | $M | $P > "$@"

%.min.css: %.css
	$C "$<" > "$@"
	# cat "$<" > "$@"

%.min.js: %.js
	$J "$<" > "$@"

%.gen.js: %.js
	$P "$<" > "$@"

a.gen.js: a.js .index.html
	$P "$<" > a.gen.js

.scripts.gen.min.js: .scripts.js a.gen.js mappings.js tafsir.js search.js tajlorligilumi.js data.gen.js versligilumi.js res/confetti.min.js javascript.js z.js
	$P "$<" | perl -CDAS -pe 's/const +say += +console\.log//' | $J | perl -pe 's/;?\s*\Z//' > "$@"
	# $P "$<" > "$@"

.PHONEY: clean

clean:
	rm -f index.html a.gen.js data.gen.js scripts.min.js style.min.css .scripts.gen.min.js
