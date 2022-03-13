#!/usr/bin/env perl
# vim: fdm=marker :
use v5.14; use warnings; use autodie; use utf8;
use open qw( :encoding(UTF-8) :std );
binmode STDIN, ':encoding(UTF-8)';
binmode STDOUT, ':encoding(UTF-8)';

# A strict small Markdown-like language, for the help.
#
# Quick summary for all the rules.
#
# in>> :: Section
# out> <h2 class="help-part">Section</h2>
#
# in>> = Question
# out> <summary>Question</summary>
#
# in>> = Question
# in>> lots of text
# in>> ===
# out> <details><summary>Question</summary>lots of text</details>
#
# in>> {{Ctrl}}
# out> <kbd>Ctrl</kbd>
#
# in>> {English}
# out> <span dir="ltr" class="roman">English</span>
#
# in>> <<any thing>>
# out> <span style="white-space:nowrap">any thing</span>
#
# in>> *strong*
# out> <strong>strong</strong>
#
# in>> [Example site](http://example.com/)
# out> <a href="http://example.com/" target="_blank">Example site</a>
#
# in>> ~
# out> &nbsp;
#
# in>> ||
# out> U+200C (ZWNJ)
#
# in>> ---
# out> &mdash;
#
# in>> ...
# out> &hellip;
#
# in>> - aaa
# in>> - bbb
# in>> - ccc
# out> <ul><li>aaa</li><li>bbb</li><li>ccc</li></ul>

# there are two levels of heading. the second is always the <summary>.

my $full_example = <<~END_OF_EXAMPLE;
    :: FAQ
    = Why?
    Because *I* said so.
    
    And I wanted it like this way.
    So that I can rule the WORLD!!!
    
    For more info, visit {[Example.com](http://example.com)}.
    ===
    = What?
    
    - Just press {{Alt}}+{{F4}} and <<you'll be fine.>>
    - Or, better, remove the plug and the battery (if~any).
    ===
    END_OF_EXAMPLE

my $expected_html = <<~END_OF_HTML;
    <h2 class="help-part">FAQ</h2>
    <details><summary>Why?</summary><div class="details-content">
    <p>Because <strong>I</strong> said so.</p>
    <p>And I wanted it like this way.
    So that I can rule the WORLD!!!</p>
    <p>For more info, visit <span dir="ltr" class="roman"><a href="http://example.com" target="_blank">Example.com</a></span>.</p>
    </div></details>
    <details><summary>What?</summary><div class="details-content">
    <ul>
    <li><p>Just press <kbd>Alt</kbd>+<kbd>F4</kbd> and <span style="white-space:nowrap">you'll be fine.</span></p></li>
    <li><p>Or, better, remove the plug and the battery (if&nbsp;any).</p></li>
    </ul>
    </div></details>
    END_OF_HTML



# indentation and spaces may be inserted.

if (@ARGV == 1 && $ARGV[0] eq '--test') {
    test_all();
    exit;
}

sub slurp_input { local $/; return <> }

print process_all(slurp_input());


sub process_all {
    return
    process_postprocessing(
    process_para(
    process_part(
    process_strong(
    process_ul(
    process_links(
    process_roman(
    process_kbd(
    process_details(
    process_summary(
    process_nowrap(
        $_[0]
    )))))))))))
}

sub process_nowrap  { return $_[0] =~ s|   << (.*?) >>   |<span style="white-space:nowrap">$1</span>|gxr }
sub process_strong  { return $_[0] =~ s|   \* (.*?) \*   |<strong>$1</strong>|gxr }
sub process_roman   { return $_[0] =~ s|   \{ (.*?) \}   |<span dir="ltr" class="roman">$1</span>|gxr }
sub process_kbd     { return $_[0] =~ s| \{\{ (.*?) \}\} |<kbd>$1</kbd>|gxr }
sub process_links   { return $_[0] =~ s| \[ (.*?) \] \( (.*?) \) |<a href="$2" target="_blank">$1</a>|gxr }

sub process_part    { return $_[0] =~ s|^::[ ]+(.*?)$|<h2 class="help-part">$1</h2>|mgxr }
sub process_summary { return $_[0] =~ s|^= [ ]+(.*?)$|<summary>$1</summary>|mgxr }

sub process_ul {
    return $_[0]
        =~ s|^- +(.*?)$|<li><p>$1</p></li>|mgr                # convert /^- / to <li>s
        =~ s|( (?: <li>.*?</li> \s* )+ )|<ul>\n$1</ul>\n|mgxr # wrap blocks of <li>s in <ul>s
}

sub process_details { # after summary
    return $_[0] =~ s|(<summary>.*?)^===$|<details>$1</details>|smgxr
}

# done last, just before postprocessing
sub process_para {
    # a paragraph is one or more lines that are:
    # - proceeded by /^\s*$/ or /^<[^ask]/ or beginning of file, and
    # - followed by  /^\s*$/ or /^<[^ask]/ or end of file.
    # ( "ask" for "<a>", "span", and "kbd")
    # I sure there is a better way.
    my $ret;
    my $in_p;
    for (split "\n", $_[0]) {
        if (!/^<[^ask]/ && !/^\s*$/) { # we're inside a para
            if (!$in_p) { $in_p = 1; $ret .= '<p>' }
            $ret .= "$_\n";
        }
        else { # we're not in a para
            if ($in_p) { $in_p = undef; chomp $ret; $ret .= "</p>\n" }
            $ret .= "$_\n";
        }
    }
    if ($in_p) { $ret .= '</p>' }  # should not happen outside testing
    return $ret;
}

sub process_postprocessing {
    return $_[0]
        # reduce the possible reduction in readability for Arabic
        =~ s|\bو |و~|gr
        =~ s|\bأو |أو~|gr
        =~ s|\bمن |من~|gr
        =~ s|\bإلى |إلى~|gr
        =~ s|\bلا |لا~|gr
        =~ s|\bثم |ثم~|gr
        # shorthands
        =~ s|~|&nbsp;|gr
        =~ s/[|][|]/\x{200c}/gr  # || to ZWNJ
        =~ s|---|&mdash;|gr
        =~ s|[.][.][.]|&hellip;|gr
        # remove empty lines
        =~ s/\n *\n/\n/gr
        # wrap the content in a div
        =~ s|</summary>(.*?)</details>|</summary><div class="details-content">$1</div></details>|sgr
}

sub test_all {
    use Test::More;

    is process_roman(
        "Hi all, this is "                          ."{Noureddin}".   "! Nice to meet you."),
        'Hi all, this is <span dir="ltr" class="roman">Noureddin</span>! Nice to meet you.',
            'roman only';

    is process_strong(
        "test *abc* def"),
        'test <strong>abc</strong> def',
            'strong only';

    is process_links(
        "Go to [Example site](http://example.com/)."),
        'Go to <a href="http://example.com/" target="_blank">Example site</a>.',
            'links only';

    is process_links(process_roman(
        "Go to {[Example site](http://example.com/)}.")),
        'Go to <span dir="ltr" class="roman"><a href="http://example.com/" target="_blank">Example site</a></span>.',
            'both roman and links';

    is process_ul(
        "- hi\n- bye"),
        "<ul>\n<li><p>hi</p></li>\n<li><p>bye</p></li></ul>\n",
            'ul';

    is process_summary("= Why?"), '<summary>Why?</summary>', 'summary';

    is process_details(
        "<summary>Why?</summary>I know!\n==="),
        "<details><summary>Why?</summary>I know!\n</details>",
            'details, assumes summary is processed';

    is process_all($full_example), $expected_html, 'full example';

    done_testing();
}
