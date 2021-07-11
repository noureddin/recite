#!/usr/bin/env perl
# vim: fdm=marker :
use v5.14; use warnings; use autodie; use utf8;
use open qw( :encoding(UTF-8) :std );
binmode STDIN, ':encoding(UTF-8)';
binmode STDOUT, ':encoding(UTF-8)';

sub slurp { local $/; open my $f, '<', shift; return scalar <>; }

sub minify_js { my $t = shift;
    # remove comments
    $t =~ s| \h* //.* ||gx;
    $t =~ s| /\* .*? \*/ ||gsx;
    # collapse multiple newlines (even if they contain spaces) and indentation
    $t =~ s| \h* \n \s+ |\n|gx;
    # collapse multi-line statement into one line
    $t =~ s| \n ( [\[(`+*/,.-] ) |$1|gmx;
    # collapse multiple horizontal spaces
    $t =~ s|\h+| |g;
    # remove horizontal spaces around punctuation
    $t =~ s|(\W) (\W)|$1$2|g;
    $t =~ s|(\W) |$1|g;
    $t =~ s| (\W)|$1|g;
    # remove newlines aronud braces
    $t =~ s| \n? ([{}]) \n? |$1|gx;
    # a semicolon is not need before a closing brace (semis are separators not terminators)
    $t =~ s|;\}|\}|g;
    # a special rule for multi-line conditional operator
    $t =~ s| \n? ([?:]) \n? |$1|gx;
    # replace \n by ; (for html)
    $t =~ s|\n|;|g;
    # remove leading and trailing spaces
    $t =~ s|\A\s+||g;
    $t =~ s|[\s;]+\Z||g;
    return $t;
}

sub minify_css { my $t = shift;
    # remove comments
    $t =~ s| /\* .*? \*/ ||gsx;
    # collapse spaces
    $t =~ s|\s+| |g;
    # remove horizontal spaces around punctuation
    $t =~ s|(\W) (\W)|$1$2|g;
    $t =~ s|(\W) |$1|g;
    $t =~ s| (\W)|$1|g; # TODO: what about selectors? .x .y is diff from .x.y!
    # a semicolon is not need before a closing brace (semis are separators not terminators)
    $t =~ s|;\}|\}|g;
    # remove leading and trailing spaces
    $t =~ s|\A\s+||g;
    $t =~ s|\s+\Z||g;
    return $t;
}

sub minify_html { my $t = shift;
    # remove comments
    $t =~ s|<!--.*?-->||gs;
    # minify js
    $t =~ s|(?<=<script>).*?(?=</script>)|minify_js("$&")|gse;
    # minify css
    $t =~ s|(?<=<style>).*?(?=</style>)|minify_css("$&")|gse;
    # collapse spaces
    $t =~ s|\s+| |g;
    # remove horizontal spaces around punctuation
    $t =~ s|(?<=\W) (?=\W)||g;
    $t =~ s|(?<=[^\w"]) (?=\w)||g; # don't remove the space between html attributes
    $t =~ s| (?=\W)||g;
    # remove leading and trailing spaces
    $t =~ s|\A\s+||g;
    $t =~ s|\s+\Z||g;
    # restore the newline after doctype (if any)
    $t =~ s|<!doctype .*?>|$&\n|i;
    return $t;
}

if (defined $ARGV[0] && -f $ARGV[0]) {
    print minify_html(slurp($ARGV[0]))
}
else {
    die "Expected a file in the first arg!\n"
}
