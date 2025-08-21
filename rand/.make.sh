#!/bin/bash

R='[update,recite]'
# J() { deno run --quiet --allow-read --allow-env=UGLIFY_BUG_REPORT npm:uglify-js --compress top_retain="$R",passes=2 --mangle toplevel,reserved="$R" "$@"; }
J() { deno run --quiet --allow-read --allow-env=UGLIFY_BUG_REPORT npm:uglify-js --compress top_retain="$R",passes=10 "$@"; }
C() { deno run --quiet --allow-read --allow-env=HTTP_PROXY,http_proxy npm:clean-css-cli "$@"; }
M() { perl -CSAD ../.minify.pl "$@"; }
A() { perl -CSAD -nE 'while(s/<<!!(?!cat )(.*?)>>/`$1`/ge){} print' "$@"; }
P() { perl -CSAD -nE 'while(s/<<!!(.*?)>>/`$1`/ge){} print' "$@"; }

# .minify.pl minifies HTML, but the transformations it applies are bad for SVG and JS.
# It can be made to be more context-sensitive, but it's much better to separate them
#   both into their files and not minify them at all.
# Therefore the preprocesser was split into the non-including preprocesser ($A),
#   and after minification the usual (now including only, for html) preprocesser ($P)
#   is called.
# All of that concerns only index.html, because it needs .minify.pl too;
#   other files using the preprocesser are unaffected.

>..f.min.css  C .style.css
>..s.min.css  C .style.css .style-s.css

>..f.min.js   J .common.js .f.js 
>..s.min.js   J .common.js .z.js .s.js ../.lzma-d-min.js 

# ^ lzma-d-min.js from LZMA-JS by Nathan Rugg; v2.3.0; License: MIT.
# https://github.com/LZMA-JS/LZMA-JS/blob/master/src/lzma-d-min.js

A .F.html | M | P > f/index.html
A .S.html | M | P > s/index.html

rm -f ..{f,s}.min.{js,css}

