#!/usr/bin/env perl
# vim: fdm=marker :
use v5.14; use warnings; use autodie; use utf8;
use open qw( :encoding(UTF-8) :std );
binmode STDIN, ':encoding(UTF-8)';
binmode STDOUT, ':encoding(UTF-8)';

sub slurp { local $/; open my $f, '<', shift; return scalar <>; }
sub slurp_stdin() { local $/; return scalar <> }

sub minify_html { my $t = shift;
    ## remove comments
    $t =~ s|<!--.*?-->||gs;
    ## collapse spaces
    $t =~ s|\s+| |g;
    ## remove horizontal spaces around punctuation
    $t =~ s|> <|><|g;
    # $t =~ s|(?<=\W) (?=\W)||g;
    # $t =~ s|(?<=[^\w"]) (?=\w)||g; # don't remove the space between html attributes
    # $t =~ s| (?=\W)||g;
    ## remove leading and trailing spaces
    $t =~ s|\A\s+||g;
    $t =~ s|\s+\Z||g;
    ## restore the newline after doctype (if any)
    $t =~ s|<!doctype .*?>|$&\n|i;
    return $t;
}

if (defined $ARGV[0] && -f $ARGV[0]) {
    print minify_html(slurp($ARGV[0]))
}
else {
    print minify_html(slurp_stdin)
}
