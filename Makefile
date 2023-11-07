R=$(shell perl -nle 'push @a, /\bon\w+="([^"]+)\(\)/; END { printf "[%s]\n", join ",", sort @a }' .index.html)
J=deno run --quiet --allow-read npm:uglify-js -c passes=5 -m toplevel,reserved=$R
C=deno run --quiet --allow-read npm:clean-css-cli
M=perl -CSAD minify.pl
P=perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$$1`/ge){} print'
H=perl -CSAD -MDigest::file=digest_file_base64 -p \
  -e 'sub hash(_) { digest_file_base64($$_[0], "SHA-1") =~ tr[+/][-_]r }' \
  -e 's{(<script src="|<link [^<>]+ href=")([^"<>]+\.[^/]+)(?=")}{ "$$1$$2?h=" . hash($$2) }ge'


index.html: .index.html a.js data.js scripts.min.js style.min.css
	$P "$<" | $M | $H > "$@"

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
