#!/usr/bin/env perl
# vim: fdm=marker :
use v5.14; use warnings; use autodie; use utf8;
use open qw( :encoding(UTF-8) :std );
binmode STDIN, ':encoding(UTF-8)';
binmode STDOUT, ':encoding(UTF-8)';

local $_ = do { local $/; <> };

eval scalar `perl -CDAS -Mutf8 plccq.pl c.md`;

print;
