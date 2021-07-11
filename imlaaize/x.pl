#!/usr/bin/env perl
# vim: fdm=marker :
use v5.14; use warnings; use autodie; use utf8;
use open qw( :encoding(UTF-8) :std );
binmode STDIN, ':encoding(UTF-8)';
binmode STDOUT, ':encoding(UTF-8)';


# local $_ = join ' ', @ARGV;

sub slurp { local $/; open my $f, '<', shift; return scalar <$f> }

local $_ = slurp 'othmani-array-tajweed';

s/[A-Z<>]+//g;

# for now, remove ayat numbers
s/\N{NO-BREAK SPACE}[٠-٩\N{ARABIC END OF AYAH}]+//g;

s/\N{COMBINING OVERLINE}//g;

s/\N{ARABIC START OF RUB EL HIZB}\N{NO-BREAK SPACE}//g;
s/\N{NO-BREAK SPACE}\N{ARABIC PLACE OF SAJDAH}//g;

s/\N{ARABIC LETTER FARSI YEH}/\N{ARABIC LETTER YEH}/g;

# most tashkeel
s/\N{ARABIC SHADDA}?[\N{ARABIC FATHA}\N{ARABIC DAMMA}\N{ARABIC KASRA}\N{ARABIC FATHATAN}\N{ARABIC DAMMATAN}\N{ARABIC KASRATAN}\N{ARABIC OPEN FATHATAN}\N{ARABIC OPEN DAMMATAN}\N{ARABIC OPEN KASRATAN}]//g;
s/[\N{ARABIC SMALL HIGH MADDA}\N{ARABIC SMALL HIGH DOTLESS HEAD OF KHAH}\N{ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO}\N{ARABIC SMALL HIGH ROUNDED ZERO}]//g;

# waqf and low seen
s/[\N{ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA}\N{ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA}\N{ARABIC SMALL HIGH MEEM INITIAL FORM}\N{ARABIC SMALL HIGH JEEM}\N{ARABIC SMALL HIGH THREE DOTS}\N{ARABIC SMALL HIGH SEEN}\N{ARABIC SMALL HIGH MEEM ISOLATED FORM}\N{ARABIC SMALL LOW SEEN}\N{ARABIC SMALL LOW MEEM}\N{ARABIC SMALL HIGH MEEM ISOLATED FORM}]//g;

s/\N{ARABIC LETTER ALEF WASLA}/\N{ARABIC LETTER ALEF}/g;
s/\N{ARABIC LETTER WAW}\N{ARABIC LETTER SUPERSCRIPT ALEF}/\N{ARABIC LETTER ALEF}/g;
s/(?<=لرحم)\N{ARABIC TATWEEL}\N{ARABIC LETTER SUPERSCRIPT ALEF}(?=ن)//g;  # الرحمن
s/(?<=أول)\N{ARABIC TATWEEL}\N{ARABIC LETTER SUPERSCRIPT ALEF}(?=ئك)//g;  # أولئك
s/(?<=ه)\N{ARABIC TATWEEL}\N{ARABIC LETTER SUPERSCRIPT ALEF}(?=ؤلاء)//g;  # هؤلاء
s/(?<=ه)\N{ARABIC TATWEEL}\N{ARABIC LETTER SUPERSCRIPT ALEF}(?=ذ(?:ه|ا|ان|ين))//g;  # هذه هذا هذان هذين
s/(?<=ذ)\N{NO-BREAK SPACE}\N{ARABIC LETTER SUPERSCRIPT ALEF}(?=لك)//g;  # ذلك
s/(?<=ل)\N{ARABIC TATWEEL}\N{ARABIC LETTER SUPERSCRIPT ALEF}(?=كن)//g;  # لكن
s/\N{NO-BREAK SPACE}\N{ARABIC LETTER SUPERSCRIPT ALEF}/\N{ARABIC LETTER ALEF}/g;
s/\N{ARABIC TATWEEL}\N{ARABIC LETTER SUPERSCRIPT ALEF}/\N{ARABIC LETTER ALEF}/g;
s/\N{ARABIC LETTER ALEF MAKSURA}\N{ARABIC LETTER SUPERSCRIPT ALEF}(?= )/\N{ARABIC LETTER ALEF MAKSURA}/g;
s/\N{ARABIC LETTER ALEF MAKSURA}\N{ARABIC LETTER SUPERSCRIPT ALEF}(?! )/\N{ARABIC LETTER ALEF}/g;

s/\N{ARABIC LETTER HAMZA}\N{ARABIC LETTER ALEF}/\N{ARABIC LETTER ALEF WITH MADDA ABOVE}/g;

s/(?<=\N{ARABIC LETTER YEH})\N{ARABIC SMALL YEH}/\N{ARABIC LETTER YEH}/g;
s/(?<=\N{ARABIC LETTER YEH})\N{ARABIC TATWEEL}\N{ARABIC SMALL HIGH YEH}/\N{ARABIC LETTER YEH}/g;

s/(?<=\N{ARABIC LETTER WAW})\N{ARABIC SMALL WAW}/\N{ARABIC LETTER WAW}/g;

s/[\N{ARABIC SMALL WAW}\N{ARABIC SMALL YEH}](?= )//g;

print;



# my %uni = (
#     nbsp            =>  'U+00A0  NO-BREAK SPACE',
#     overline        =>  'U+0305  COMBINING OVERLINE',
#     hamza           =>  'U+0621  ARABIC LETTER HAMZA',
#     alefhamzaabove  =>  'U+0623  ARABIC LETTER ALEF WITH HAMZA ABOVE',
#     wawhamza        =>  'U+0624  ARABIC LETTER WAW WITH HAMZA ABOVE',
#     alefhamzabelow  =>  'U+0625  ARABIC LETTER ALEF WITH HAMZA BELOW',
#     yehhamza        =>  'U+0626  ARABIC LETTER YEH WITH HAMZA ABOVE',
#     alef            =>  'U+0627  ARABIC LETTER ALEF',
#     beh             =>  'U+0628  ARABIC LETTER BEH',
#     tehmarbuta      =>  'U+0629  ARABIC LETTER TEH MARBUTA',
#     teh             =>  'U+062A  ARABIC LETTER TEH',
#     theh            =>  'U+062B  ARABIC LETTER THEH',
#     jeem            =>  'U+062C  ARABIC LETTER JEEM',
#     hah             =>  'U+062D  ARABIC LETTER HAH',
#     khah            =>  'U+062E  ARABIC LETTER KHAH',
#     dal             =>  'U+062F  ARABIC LETTER DAL',
#     thal            =>  'U+0630  ARABIC LETTER THAL',
#     reh             =>  'U+0631  ARABIC LETTER REH',
#     zain            =>  'U+0632  ARABIC LETTER ZAIN',
#     seen            =>  'U+0633  ARABIC LETTER SEEN',
#     sheen           =>  'U+0634  ARABIC LETTER SHEEN',
#     sad             =>  'U+0635  ARABIC LETTER SAD',
#     dad             =>  'U+0636  ARABIC LETTER DAD',
#     tah             =>  'U+0637  ARABIC LETTER TAH',
#     zah             =>  'U+0638  ARABIC LETTER ZAH',
#     ain             =>  'U+0639  ARABIC LETTER AIN',
#     ghain           =>  'U+063A  ARABIC LETTER GHAIN',
#     tatweel         =>  'U+0640  ARABIC TATWEEL',
#     feh             =>  'U+0641  ARABIC LETTER FEH',
#     qaf             =>  'U+0642  ARABIC LETTER QAF',
#     kaf             =>  'U+0643  ARABIC LETTER KAF',
#     lam             =>  'U+0644  ARABIC LETTER LAM',
#     meem            =>  'U+0645  ARABIC LETTER MEEM',
#     noon            =>  'U+0646  ARABIC LETTER NOON',
#     heh             =>  'U+0647  ARABIC LETTER HEH',
#     waw             =>  'U+0648  ARABIC LETTER WAW',
#     alefmaksura     =>  'U+0649  ARABIC LETTER ALEF MAKSURA',
#     fathatan        =>  'U+064B  ARABIC FATHATAN',
#     dammatan        =>  'U+064C  ARABIC DAMMATAN',
#     kasratan        =>  'U+064D  ARABIC KASRATAN',
#     fatha           =>  'U+064E  ARABIC FATHA',
#     damma           =>  'U+064F  ARABIC DAMMA',
#     kasra           =>  'U+0650  ARABIC KASRA',
#     shadda          =>  'U+0651  ARABIC SHADDA',
#     daggeralef      =>  'U+0670  ARABIC LETTER SUPERSCRIPT ALEF',
#     alefwasla       =>  'U+0671  ARABIC LETTER ALEF WASLA',
#     yeh             =>  'U+06CC  ARABIC LETTER FARSI YEH',
#     waslawla        =>  'U+06D6  ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA',
#     waqfawla        =>  'U+06D7  ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA',
#     waqflazem       =>  'U+06D8  ARABIC SMALL HIGH MEEM INITIAL FORM',
#     waqfjaez        =>  'U+06DA  ARABIC SMALL HIGH JEEM',
#     waqfsplit       =>  'U+06DB  ARABIC SMALL HIGH THREE DOTS',
#     hiseen          =>  'U+06DC  ARABIC SMALL HIGH SEEN',
#     ayah            =>  'U+06DD  ARABIC END OF AYAH',
#     hizb            =>  'U+06DE  ARABIC START OF RUB EL HIZB',
#     silencemarker   =>  'U+06DF  ARABIC SMALL HIGH ROUNDED ZERO',
#     uprightzero     =>  'U+06E0  ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO',
#     jazm            =>  'U+06E1  ARABIC SMALL HIGH DOTLESS HEAD OF KHAH',
#     himeem          =>  'U+06E2  ARABIC SMALL HIGH MEEM ISOLATED FORM',
#     loseen          =>  'U+06E3  ARABIC SMALL LOW SEEN',
#     madda           =>  'U+06E4  ARABIC SMALL HIGH MADDA',
#     lowaw           =>  'U+06E5  ARABIC SMALL WAW',
#     loyeh           =>  'U+06E6  ARABIC SMALL YEH',
#     hiyeh           =>  'U+06E7  ARABIC SMALL HIGH YEH',
#     hinoon          =>  'U+06E8  ARABIC SMALL HIGH NOON',
#     sajdah          =>  'U+06E9  ARABIC PLACE OF SAJDAH',
#     imaalah         =>  'U+06EA  ARABIC EMPTY CENTRE LOW STOP',
#     ishmaam         =>  'U+06EB  ARABIC EMPTY CENTRE HIGH STOP',
#     tasheel         =>  'U+06EC  ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE',
#     lomeem          =>  'U+06ED  ARABIC SMALL LOW MEEM',
#     openfathatan    =>  'U+08F0  ARABIC OPEN FATHATAN',
#     opendammatan    =>  'U+08F1  ARABIC OPEN DAMMATAN',
#     openkasratan    =>  'U+08F2  ARABIC OPEN KASRATAN',
#     hiwaw           =>  'U+08F3  ARABIC SMALL HIGH WAW',
#     # the following are used only in the document, and quran-data never uses them.
#     alefmadd        =>  'U+0622  ARABIC LETTER ALEF WITH MADDA ABOVE',
#     arabicyeh       =>  'U+064A  ARABIC LETTER YEH',
# );

