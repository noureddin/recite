#!/bin/bash

input="ae_Cortoba.ttf"
output="${input%.*}-subset"
range=20,21,28,29,2e,3a,640,64b-652,660-669,621-63a,641-64a
# all imlaai arabic letters, the five .():!, tatweel, all eight imlaai tashkeel marks, ٠ to ٩, and ascii space

pyftsubset "$input" --output-file="$output".woff2 --layout-features=* --flavor=woff2 --unicodes=$range
pyftsubset "$input" --output-file="$output".woff  --layout-features=* --flavor=woff  --unicodes=$range --with-zopfli

# then open in FontForge and generate again (ignore warnings) to avoid warnings in the browser's console.

