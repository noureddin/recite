#!/bin/bash

p='perl -CDAS -Mutf8'

R='[update,recite]'
# J() { deno run --quiet --allow-read --allow-env=UGLIFY_BUG_REPORT npm:uglify-js --compress top_retain="$R",passes=2 --mangle toplevel,reserved="$R" "$@"; }
JS_MINI()  { deno run --quiet --allow-read --allow-env=UGLIFY_BUG_REPORT npm:uglify-js --compress top_retain="$R",passes=10 "$@"; }
CSS_MINI() { deno run --quiet --allow-read --allow-env=HTTP_PROXY,http_proxy npm:clean-css-cli "$@"; }
H_MINI() { $p ../.minify.pl; }
H_PRE()  { $p -pe 'while(s/(<[a-z0-9]+[^<>]* [a-z-]+=)"([^ <>="\x27`]+)"(?=[ >])/$1$2/g){}' "$@"; }
H_INC()  { $p -pe 'while(s/<<!!(?!cat )(.*?)>>/`$1`/ge){}'; }
H_POST() { $p -pe 'while(s/<<!!(.*?)>>/`$1`/ge){}'; }

>..f.min.css  CSS_MINI .style.css
>..s.min.css  CSS_MINI .style.css .style-s.css

>..f.min.js   JS_MINI .common.js .f.js 
>..s.min.js   JS_MINI .common.js .z.js .s.js ../res/fzstd-0.1.1.js

# ^ fzstd-0.1.1.js from fzstd by 101arrowz; v0.1.1; License: MIT.
# https://github.com/101arrowz/fzstd

H_PRE .F.html | H_INC | H_MINI | H_POST > f/index.html
H_PRE .S.html | H_INC | H_MINI | H_POST > s/index.html

rm -f ..{f,s}.min.{js,css}

