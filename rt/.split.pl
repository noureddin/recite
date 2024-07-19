#!/usr/bin/env perl
use v5.14; use warnings; use autodie; use utf8;
use open qw[ :encoding(UTF-8) :std ];

my @big = ( 0, 7, 107, 217, 293, 493, 669, 789, 954, 1160, 1235, 1364, 1473, 1596, 1707, 1750, 1901, 2029, 2140, 2250, 2348, 2483, 2595, 2673, 2791, 2855, 2932, 3159, 3252, 3340, 3409, 3533, 3606, 3705, 3970, 4058, 4133, 4272, 4472, 4583, 4630, 4901, 5104, 5163, 5241, 5447, 5672, 5993, 6130, 6236 );

my @small = ( 0, 493, 954, 1473, 2140, 2932, 3788, 4735, 6236 );

my %All = map { $_ => undef }
  map s/\.gz$//r, grep !/-/, <*.gz>;

my %Big = map { $_ => undef }
  qw[ tanweer tabary qortoby waseet katheer baghawy sa3dy fa_khorramdel ];

my %Small = map { $_ => undef }
  grep { !exists $Big{$_} } keys %All;

# Big are the tafasir that are too big and thus are split into 50 files instead of 8 parts only.
# each part of Big or Small should generally be 20-80kB. except for the first 10 parts of the Big.

# each of the small divisions is an integer number of consecutive suar,
# whose size of ayat (in Uthmani and Imlaai) is roughly equal to each of the other divisions.

# each of the big divisions is an integer number of consecutive suar,
# whose size (of several Big tafasir) is not too different from the other divisions.
# exception: al-baqara is split into 3 roughly equal parts, generally without crossing topics.

# to get the data expected by this script, get the 2024-07-16 commit `07e2c8c` from
# the main `gh-pages` branch from the Recite repo (<https://github.com/noureddin/recite/>),
# which is the last one before the commit `switch to lzma for the tafasir`,
# and change into the `rt/` directory, and do this (in Bash):
#    for t in $(\ls | sed 's,-.*,,' | sort -u); do cat $t-{1..60}.gz > $t.gz; rm -f $t-*.gz; done
# then run this script and wait.

sub sys { system(@_) == 0 or exit 1 }

sub write_file {
  open my $fh, '>', shift;
  print { $fh } @_;
}

sub split_file {
  my ($base) = shift;  # splits are in @_
  my $gz = "$base.gz";
  #
  unlink $base if -e $base;  # just in case
  sys qw[ gunzip --keep ], $gz;
  #
  for my $i (0..$#_-1) {
    my $p = $i + 1;
    my $st = $_[$i] + 1;
    my $en = $_[$p];
    my $out = "$base-$p";
    # printf "%2d: %4d => %4d\n", $p, $st, $en;
    write_file $out, qx[ sed -n ${st},${en}p $base ];
    #
    sys lzmawi => $out;  # exists in my $PATH; shown below, after __END__
    unlink $out;
  }
  unlink $base;
}

for my $t (sort keys %Big)   { split_file $t => @big }
for my $t (sort keys %Small) { split_file $t => @small }


__END__

The LZMAwi script:

#!/bin/bash

# compresses with the smallest level that achieves the highest compression

base="$1"
ext=${2:-lzma}  # or xz

case "$ext" in lzma|xz);; *)
  printf 'expected "lzma" or "xz" for the second argument; got: %s\n' "$2" >&2
  exit 2
  ;;
esac

if ! [ -e "$1" ]; then
  printf 'no such file: %s\n' "$1" >&2
  exit 1
else
  rm -f "$base.$ext"  # just in case
  for i in {9..0}; do
    for e in e ''; do
      xz --keep -$i$e --format=$ext "$base"
      s=$(stat -c%s "$base.$ext")
      if [ -z "$min_s" ] || [ "$s" -le "$min_s" ]; then
        min_s=$s
        min_l=$i$e
      fi
      rm -f "$base.$ext"
    done
  done
fi

nformat() {  # reads from stdin; converts 12345678.9098 to 12 345,678.909
  sed -E '
    :a; s/([0-9])([0-9]{6}[. ]|[0-9]{6}$)/\1 \2/; ta  # add a space every six digits
    s/([0-9]{3}|^[0-9]+)([0-9]{3})/\1,\2/g  # add a comma every three digits inside a group-of-six
    s/(\....).*/\1/  # keep only three decimal digits (if there are more)
  '
}

size="$(printf '%s' "$min_s" | nformat)"

printf '"%s" %s bytes (level: %s)\n' "$base.$ext" "$size" $min_l

xz --keep -$min_l --format=$ext "$base"

