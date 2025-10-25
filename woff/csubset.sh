#!/bin/bash

input="ae_Cortoba.ttf"
output="${input%.*}-subset"
range=20,21,28,29,2e,3a,61f,640,64b-652,660-669,621-63a,641-64a
# all imlaai arabic letters, the five .():!, arabic question mark, tatweel, all eight imlaai tashkeel marks, ٠ to ٩, and ascii space

# uncomment this to review the included character set
grep ^range= "${BASH_SOURCE[0]}" | perl -mcharnames -ne '
  s/range=//; s/\s+$//;          # remove prefix and suffix
  s/[0-9a-fA-F]+/"0x$&"/gee;     # convert to decimal (easier processing)
  s/(\d+)-(\d+)/join " ", $1..$2/ge;  # expand ranges
  printf "U+%04X  %s\n", $_, charnames::viacode($_)
    for split / *, *| +/;
'

if ! [ -e "$input" ]; then
  >&2 printf 'Error: Input file does not exists: %s\n' "$input"
  >&2 printf 'Hint: Maybe you are not in the woff/ directory?\n'
  exit 2
fi

pyftsubset "$input" --output-file="$output".woff2 --layout-features=* --flavor=woff2 --unicodes=$range
pyftsubset "$input" --output-file="$output".woff  --layout-features=* --flavor=woff  --unicodes=$range --with-zopfli

# then open in FontForge and generate again (ignore warnings) to avoid warnings in the browser's console.

