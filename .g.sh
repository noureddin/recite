#!/bin/bash

deno run --allow-env --allow-read --allow-run npm:esbuild .g.ts --bundle --outfile=.g.js

# .g.js is edited MANUALLY to .g_.js to assign the returned value from the iife to a global called G (for 'get'),

perl -CDAD -pe 's/var G = /return/; $. == 1 && s/\A/const G = /;' .g.js > .g_.js

# we finally overwrite .g.js with the minification of .g_.js.

R='[G]'
deno run --quiet --allow-read --allow-env=UGLIFY_BUG_REPORT npm:uglify-js --compress top_retain="$R",passes=10 --mangle toplevel,reserved="$R" .g_.js > .g.js
ls -l .g.js

rm -f .g_.js

