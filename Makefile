more_reserved= tv #debug_uthm debug_uthm_raw

define get_reserved
push @a, /\bon\w+="([^"]+)\(/; END { printf "[%s]\n", join ",", uniq sort qw[ $(more_reserved) ], @a }
endef

R=$(shell perl -MList::Util=uniq -nle '$(get_reserved)' .index.html)
J=deno run --quiet --allow-read --allow-env=UGLIFY_BUG_REPORT npm:uglify-js --compress top_retain=$R,passes=10 --mangle toplevel,reserved=$R
J=deno run --quiet --allow-read --allow-env=UGLIFY_BUG_REPORT npm:uglify-js --compress top_retain=$R
C=deno run --quiet --allow-read --allow-env=HTTP_PROXY,http_proxy npm:clean-css-cli
M=perl -CSAD .minify.pl
A=perl -CSAD -nE 'while(s/<<!!(?!cat )(.*?)>>/`$$1`/ge){} print'
P=perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print'

# TODO: the following comment and the described (still followed!) behavior is now mostly obsolete.
# .minify.pl minifies HTML, but the transformations it applies are bad for SVG and JS.
# It can be made to be more context-sensitive, but it's much better to separate them
#   both into their files and not minify them at all.
# Therefore the preprocesser was split into the non-including preprocesser ($A),
#   and after minification the usual (now including only, for html) preprocesser ($P)
#   is called.
# All of that concerns only index.html, because it needs .minify.pl too;
#   other files using the preprocesser are unaffected.

index.html: .index.html _scripts.min.js _style.min.css .minify.pl meta.sh res/qaris res/tafasir processhelp.pl help.xmd res/*.svg
	$A "$<" | $M | $P > "$@"

_style.min.css: style.css
	$C "$<" > "$@"

# %.min.js: %.js
# 	$J "$<" > "$@"

_scripts.min.js: scripts.jsx [^_]*.js res/*.js .index.html res/suar-names #res/[ui].zst
	$P "$<" | $J | perl -pe 's/;?\s*\Z//' > "$@"
	# $P "$<" > "$@"

.PHONEY: clean

clean:
	rm -f index.html _style.min.css _scripts.min.js
