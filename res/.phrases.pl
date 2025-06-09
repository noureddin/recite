#!/usr/bin/env perl
use v5.14; use warnings; use utf8;
use open qw[ :encoding(UTF-8) :std ];
use List::Util qw[ sum0 ];

open my $u, '-|', (-e 'u.zst' ? 'zstdcat u.zst' : 'xz -dc u.lzma');
my @aya = map {
  chomp;
  s/[\x03-\x06]//g;
  s/[\x1c-\x1f]/ /g;
  s/ A<.>D<[٠-٩]+>//;
  s/ \N{ARABIC PLACE OF SAJDAH}//;
  s/\N{ARABIC START OF RUB EL HIZB} //;
  s/\N{COMBINING OVERLINE}//g;
  s/[A-Z<>]//g;
  # s/#/# /;
  s/#//;
  s/ +/ /g;
  s/^ +| +$//g;
  $_ eq '' ? () : $_
} <$u>;
close $u;

my @sura_length = (0,7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6);

sub start_($) { return sum0 @sura_length[0..$_[0]-1] }

my @starts = map { start_ $_ } 1..114;

my $waqf = qr/[\x{6D6}\x{6D7}\x{6D8}\x{6DA}\x{6DB}]/;  # sakta (high seen) is not counted as a waqf

sub first_phrase_of_($) { return $_[0] =~ s/$waqf.*//r }

sub wordcount(_) { return 1 + length($_[0] =~ s/[^ ]+//gr) }
sub phrasecount(_) { return 1 + length($_[0] =~ s/$waqf+(?=.)/@/gr =~ s/[^@]+//gr) }

my $n = 0;
for my $i (0..6235) {
  next if grep { $_ == $i } @starts;
  #
  my $a = $aya[$i];
  my $aya_len = wordcount $a;
  #
  my $phrase_count = phrasecount $a;
  my $first_one = wordcount $a =~ s/$waqf .*//r;  # number of words in the first phrase
  my $last_one = wordcount $a =~ s/.*$waqf //r;
  my $all_but_one = $aya_len - $first_one;  # number of words in all but the first phrase
  my $all_but_two = wordcount $a =~ s/(.*?$waqf .*?$waqf )(.*)/$2/r;  # number of words in all but the first two phrases
  #
  next if $phrase_count == 1;

  my $full = 0
    || $first_one < 3 && $all_but_two <= 5
    || $first_one < 3 && $phrase_count == 2  # get the first two phrases, which happen to be the entire aaya in this case
    || $first_one == 3 && $all_but_one <= 6
    || $phrase_count == 2 && $all_but_one < 5
    || wordcount($a) < 9  # only two aayat
    || $all_but_one <= 6
    ;

  my $two = $phrase_count > 2 && (0
    || $first_one < 3 && $all_but_two > 5
    );

  my $aa = $a
    =~ s/($waqf )(.*?$waqf )(.*)/$1\e[92m$2\e[m$3/r   # hili second phrase
    =~ s/(.*$waqf (?:\e\[m)?)(.*)$/$1\e[95m$2\e[m/r   # hili last phrase
    =~ s/(.*?$waqf )/\e[93m$1\e[m/r   # hili first phrase
    ;

  if (@ARGV && $ARGV[0] eq 'full') {
    printf '%d,', $i if $full;  # output to copy to data.js
    # printf "%d  %s\n", $i, $aa if $full;  # prettyprint
  }

  elsif (@ARGV && $ARGV[0] eq 'two') {  # get only first two phrases
    printf '%d,', $i if $two;  # output to copy to data.js
    # printf "%d  %s\n", $i, $aa if $two;  # prettyprint
  }

  else {
    next if $full || $two
      ;
    ++$n;
    printf "%d  %s\n", $i, $aa
  }

}
say '';
# say $n;
