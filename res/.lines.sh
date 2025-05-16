#!/bin/bash

p='perl -CDAS -Mutf8'
pe="$p -pe"

generate() {
  if ! [ -e ulines ] || [ .splitter.pl -nt ulines ]; then
    $p .splitter.pl u |
    tr '\n' $'\x0b' |
    sed 's/\x0b\([\x1d-\x1f]\)/\1\x0b/g' |
    tr $'\x0b' '\n' > ulines
  fi
}

compress() {
  lzma --keep -3e ulines    && mv -f ulines.lzma u.lzma
  zstd --keep -19 ulines -q && mv -f ulines.zst  u.zst
  # empirically, lzma -3e and zstd -19 are the lowest presets that still
  #   gives the smallest possible size for this file.
  # zstd 19 (the highest) gives negligibly larger files than the best lzma
  #   (211KiB vs 205KiB for ulines, ie 3% larger).
  # but decompressing zstd is much more gentle on cpu and memory compared to lzma/xz.
}

if [ $# -eq 0 ]; then
  generate
  compress
  exit
fi

# all the following is used for debugging the line splits

force_rtl() { printf '\e[2 k'; }
reset_dir() { printf '\e[0 k'; }

line_of_page() {  # the line separator that starts this page
  if [ "$1" -eq 1 ]; then echo 1
  elif [ "$1" -eq 2 ]; then echo 9
  else echo $((18+($1-3)*16))
  fi
}

format_lines() {

  < ulines tr '\n' $'\x0b' |
  sed 's/[A-Z<>]//g' |
  sed $'s/\u06dd/(/g; s/[٠-٩]\+/&)/g' |
  sed 's/\x01\x0b/\n/g' |
  sed 's/\x1d\x0b/\n\x08\x1b[43m \x1b[m/g' |  # \b into cat -n
  sed 's/\x0b /\x1b[43m \x1b[m/g' |
  sed 's/)\x0b/) /g' |
  sed 's/\x0b//g' |

  # end-of-line & begin-of-line chars combined almost all the time
  sed 's/\x03/\x1b[42m \x1b[m\n/g' |
  sed 's/\x04/\x08\x1b[101m-\x1b[m/g' |
  sed 's/\x05/\x08\x08\x1b[101m--\x1b[m/g' |
  sed 's/\x06/\x08\x08\x1b[101m<>\x1b[m/g' |
  sed 's/\x1d/\n/g' |
  sed 's/\x1e/\n\x1b[44m<><>\x1b[m/g' |
  sed 's/\x1f/\n\x1b[45m<><><><>\x1b[m/g' |

  # # end & begin as different chars -- a failed approach
  # sed 's/\x03/\n/g' |
  # sed 's/\x04//g' |
  # sed 's/\x05/\x08\x08\x1b[44m<>\x1b[m/g' |
  # sed 's/\x06/\x08\x08\x1b[45m<><>\x1b[m/g' |

  sed '1i...' |             # start of sura 1
  sed 2763i'...' |          # start of sura 9
  sed '/#/i...\n...' |      # start of all other suar
  cat -n |                  # add line numbers
  sed '17~30i==========' |  # add inner page breaks (two facing pages)
  sed '33~31i----------' |  # add outer page breaks (turning the page)
  sed '9i----------'

}

page_ends_only() {
  grep -B1 -- -----$'\n'==== |
  grep -v -- ^[-=] |
  sed 's/\x1b\[[^m]*m//g; s/ $//' |
  sed 's/\S*[^)]$/\x1b[91;1m&\x1b[m/g' |
  $pe 's{ +([0-9]+)}{$1 < 10 ? $1-7 : $1 < 20 ? $1-14 : 1+($1-1)/15}gee' |
  sed 's/^/   /'
}

############################################################

case "$1" in
-)
  filter=cat
  ;;
e*)
  filter=page_ends_only
  ;;
[0-9]*-[0-9]*)
  a=${1%-*}; b=${1#*-};
  filter="sed -n $(line_of_page $a),$(line_of_page $b)p"
  ;;
[0-9]*)
  a=$1; b=$(($1+1))
  case "$2" in [0-9]*) b=$(($2+1));; esac
  filter="sed -n $(line_of_page $a),$(line_of_page $b)p"
  ;;
esac

force_rtl; generate && format_lines | $filter; reset_dir;

