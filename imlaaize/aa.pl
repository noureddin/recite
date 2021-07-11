#!/usr/bin/env perl
# vim: fdm=marker :
use v5.14; use warnings; use autodie; use utf8;
use open qw( :encoding(UTF-8) :std );
binmode STDIN, ':encoding(UTF-8)';
binmode STDOUT, ':encoding(UTF-8)';

my $a = do { local $/; open my $f, '<', 'othmani-array-tajweed'; <$f> };
my $r = `perl -CDAS plccq.pl c.md`;

print <<"END";
<!doctype html>
<html><head>
<meta charset="utf-8">
<style>
* { background-color: #111; color: #aaa }
</style>
</head><body>
<textarea id=txt></textarea>
<script>
let a = `$a`

$r
// console.log(a)
document.getElementById('txt').value = a
document.getElementById('txt').focus()
</script>
</html>
END
