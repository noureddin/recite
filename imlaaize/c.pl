#!/usr/bin/env perl
# vim: fdm=marker :
use v5.22; use warnings; use autodie; use utf8;
use open qw( :encoding(UTF-8) :std );
binmode STDIN, ':encoding(UTF-8)';
binmode STDOUT, ':encoding(UTF-8)';

use charnames ':alias' => {
    NBSP =>               'NO-BREAK SPACE',
    Overline =>           'COMBINING OVERLINE',
    Hamza =>              'ARABIC LETTER HAMZA',
    AlefHamzaAbove =>     'ARABIC LETTER ALEF WITH HAMZA ABOVE',
    WawHamza =>           'ARABIC LETTER WAW WITH HAMZA ABOVE',
    AlefHamzaBelow =>     'ARABIC LETTER ALEF WITH HAMZA BELOW',
    YehHamza =>           'ARABIC LETTER YEH WITH HAMZA ABOVE',
    Alef =>               'ARABIC LETTER ALEF',
    Beh =>                'ARABIC LETTER BEH',
    TehMarbuta =>         'ARABIC LETTER TEH MARBUTA',
    Teh =>                'ARABIC LETTER TEH',
    Theh =>               'ARABIC LETTER THEH',
    Jeem =>               'ARABIC LETTER JEEM',
    Hah =>                'ARABIC LETTER HAH',
    Khah =>               'ARABIC LETTER KHAH',
    Dal =>                'ARABIC LETTER DAL',
    Thal =>               'ARABIC LETTER THAL',
    Reh =>                'ARABIC LETTER REH',
    Zain =>               'ARABIC LETTER ZAIN',
    Seen =>               'ARABIC LETTER SEEN',
    Sheen =>              'ARABIC LETTER SHEEN',
    Sad =>                'ARABIC LETTER SAD',
    Dad =>                'ARABIC LETTER DAD',
    Tah =>                'ARABIC LETTER TAH',
    Zah =>                'ARABIC LETTER ZAH',
    Ain =>                'ARABIC LETTER AIN',
    Ghain =>              'ARABIC LETTER GHAIN',
    Tatweel =>            'ARABIC TATWEEL',
    Feh =>                'ARABIC LETTER FEH',
    Qaf =>                'ARABIC LETTER QAF',
    Kaf =>                'ARABIC LETTER KAF',
    Lam =>                'ARABIC LETTER LAM',
    Meem =>               'ARABIC LETTER MEEM',
    Noon =>               'ARABIC LETTER NOON',
    Heh =>                'ARABIC LETTER HEH',
    Waw =>                'ARABIC LETTER WAW',
    AlefMaksura =>        'ARABIC LETTER ALEF MAKSURA',
    Fathatan =>           'ARABIC FATHATAN',
    Dammatan =>           'ARABIC DAMMATAN',
    Kasratan =>           'ARABIC KASRATAN',
    Fatha =>              'ARABIC FATHA',
    Damma =>              'ARABIC DAMMA',
    Kasra =>              'ARABIC KASRA',
    Shadda =>             'ARABIC SHADDA',
    DaggerAlef =>         'ARABIC LETTER SUPERSCRIPT ALEF',
    AlefWasla =>          'ARABIC LETTER ALEF WASLA',
    Yeh =>                'ARABIC LETTER FARSI YEH',
    WaslAwla =>           'ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA',
    WaqfAwla =>           'ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA',
    WaqfLazem =>          'ARABIC SMALL HIGH MEEM INITIAL FORM',
    WaqfJaez =>           'ARABIC SMALL HIGH JEEM',
    WaqfSplit =>          'ARABIC SMALL HIGH THREE DOTS',
    HiSeen =>             'ARABIC SMALL HIGH SEEN',
    Ayah =>               'ARABIC END OF AYAH',
    Hizb =>               'ARABIC START OF RUB EL HIZB',
    SilenceMarker =>      'ARABIC SMALL HIGH ROUNDED ZERO',
    UprightZero =>        'ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO',
    Jazm =>               'ARABIC SMALL HIGH DOTLESS HEAD OF KHAH',
    HiMeem =>             'ARABIC SMALL HIGH MEEM ISOLATED FORM',
    LoSeen =>             'ARABIC SMALL LOW SEEN',
    Madda =>              'ARABIC SMALL HIGH MADDA',
    LoWaw =>              'ARABIC SMALL WAW',
    LoYeh =>              'ARABIC SMALL YEH',
    HiYeh =>              'ARABIC SMALL HIGH YEH',
    HiNoon =>             'ARABIC SMALL HIGH NOON',
    Sajdah =>             'ARABIC PLACE OF SAJDAH',
    Imaalah =>            'ARABIC EMPTY CENTRE LOW STOP',
    Ishmaam =>            'ARABIC EMPTY CENTRE HIGH STOP',
    Tasheel =>            'ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE',
    LoMeem =>             'ARABIC SMALL LOW MEEM',
    OpenFathatan =>       'ARABIC OPEN FATHATAN',
    OpenDammatan =>       'ARABIC OPEN DAMMATAN',
    OpenKasratan =>       'ARABIC OPEN KASRATAN',
    HiWaw =>              'ARABIC SMALL HIGH WAW',
    # Arabic letters not in Quran Data
    AlefMadd =>           'ARABIC LETTER ALEF WITH MADDA ABOVE',
    ArabicYeh =>          'ARABIC LETTER YEH',
};

local $_ = do { local $/; <> };

s/[A-Z<>]+//g;
s/ \N{Shadda}    | \N{Madda}
 | \N{WaqfLazem} | \N{WaqfJaez} | \N{WaqfAwla} | \N{WaslAwla} | \N{WaqfSplit}
 | \N{Imaalah}   | \N{Ishmaam}  | \N{Tasheel}
 | \N{Overline}
 //gx;

my $tanween_fath = qr/\N{Fathatan}|\N{OpenFathatan}|\N{Fatha}\N{HiMeem}/;
my $tanween_kasr = qr/ \N{Kasratan} | \N{OpenKasratan} | \N{Kasra} \N{LoMeem} /x;
my $joining_letter =
    qr/ \N{Beh}
      | [\N{Teh}-\N{Khah}]
      | [\N{Seen}-\N{Ghain}]
      | [\N{Feh}-\N{Heh}]
      | \N{AlefMaksura}
      | \N{Yeh}
      /x;
my $disjoining_letter =
    qr/ [\N{AlefHamzaAbove}-\N{Alef}]
      | \N{TehMarbuta}
      | [\N{Dal}-\N{Zain}]
      | \N{Waw}
      /x;
my $alef = qr/\N{Alef}|[\N{Tatweel}\N{NBSP}]\N{DaggerAlef}/;

s/( \N{Khah} \N{Fatha} \N{Tah} \N{Fatha}                    # twice in S004 A092
  | \N{Meem} \N{Damma} \N{Teh} \N{Fatha} \N{Kaf} \N{Fatha}  # Shadda is removed. in S012 A031
  | \N{Meem} \N{Fatha} \N{Lam} \N{Jazm} \N{Jeem} \N{Fatha}
  ) \N{Hamza} $tanween_fath \N{Alef}
/$1أ/gx;

s/\N{Hamza}\N{Fatha}$alef\B/\N{AlefMadd}/g;
s/\N{AlefHamzaAbove}\N{Fatha}\N{Hamza}\N{Kasra}/\N{AlefHamzaAbove}\N{AlefHamzaBelow}/g;
s/\N{Hamza}\N{Kasra}(?!\N{LoMeem})\B/\N{YehHamza}/g;

s/ (?<=\N{Kasra}) \N{Hamza} (?! \N{Fatha} \N{Alef} )
 | (?<= \N{Yeh} ) \N{Hamza} (?! . [\N{HiMeem}\N{LoMeem}]? \b)
 /\N{YehHamza}/gx;

s/ (?<! \N{Alef} ) \N{Hamza} \N{Fatha} (?!\N{Alef}) \B  # not end of word
 | \N{Fatha} \N{Hamza} \N{Jazm} (?!\N{Alef})
 /\N{AlefHamzaAbove}/gx;


s/\N{Sad}\N{HiSeen}/\N{Seen}/g;

s/\N{Yeh}\N{SilenceMarker}//g;
s/\N{Alef}\N{SilenceMarker}\B//g;

s/(?<=\N{AlefHamzaAbove}\N{Fatha}\N{Waw}\N{Fatha}) //g;

s/     \N{Fatha}    |     \N{Damma}    |     \N{Kasra}
 |     \N{Fathatan} |     \N{Dammatan} |     \N{Kasratan}
 | \N{OpenFathatan} | \N{OpenDammatan} | \N{OpenKasratan}
 | \N{Madda}  | \N{Jazm}   | \N{SilenceMarker} | \N{UprightZero}
 | \N{Shadda} | \N{HiMeem} | \N{LoMeem} | \N{HiSeen} | \N{LoSeen}
 //gx;

s/(?<=$joining_letter)\N{Hamza}\N{Alef}/\N{YehHamza}\N{Alef}/g;

s/(?<=$joining_letter)\N{Hamza}\B/\N{YehHamza}/g;

s/\N{NBSP}[٠-٩\N{Ayah}]+//g;
s/\N{Hizb}\N{NBSP}//g;
s/\N{NBSP}\N{Sajdah}//g;

s/\N{AlefWasla}/\N{Alef}/g;

s/ \N{Waw} \N{DaggerAlef} (?=\N{Alef})//gx;  # الربا in S002 A275-278, S003 A130, S004 A161
s/ \N{Waw} \N{DaggerAlef} /\N{Alef}/gx;

s/ (?<= \N{AlefHamzaBelow} \N{Lam} ) \N{Tatweel} \N{DaggerAlef} (?=\N{Heh})//gx;
s/ \N{AlefHamzaAbove} \N{YehHamza} \N{Lam} \N{Tatweel} \N{DaggerAlef} \N{Heh} /أإله/gx;

s/ \b (\N{Waw}? \N{Yeh}) \N{Tatweel} \N{DaggerAlef} /$1ا /gx;
# this above ends in an space!

s/(?:[\N{NBSP}\N{Tatweel}])\N{DaggerAlef}/\N{Alef}/g;

s/ (?<=\N{AlefMaksura}) \N{DaggerAlef} \b//gx;
s/     \N{AlefMaksura}  \N{DaggerAlef}  /\N{Alef}/gx;

s/(?<=\N{Yeh})\N{LoYeh}/\N{Yeh}/g;

s/\N{LoYeh}\B/\N{Yeh}/g;

s/\N{LoWaw}\B/\N{Waw}/g;

s/(?<=\N{Yeh})\N{Tatweel}\N{HiYeh}/\N{Yeh}/g;

s/\N{Tatweel}\N{HiYeh}/\N{Yeh}/g;

s/\N{Tatweel}\N{HiWaw}/\N{Waw}/g;

s/(?<=\N{Waw})\N{LoWaw}/\N{Waw}/g;

s/\N{LoWaw}|\N{LoYeh}//g;

s/ \N{HiNoon} /\N{Noon}/gx;

s/ \N{Yeh} /\N{ArabicYeh}/gx;

s/ها (?= ذا\b | ذه\b | ذان\b | ذين\b | ؤلاء\b | كذا ) /ه/gx;

s/لرحمان/لرحمن/g;
s/أولائك/أولئك/g;
s/هاأنتم/ها أنتم/g;
s/لاكن/لكن/g;
s/ذالك/ذلك/g;
s/اليل/الليل/g;
s/يآت/يئات/g;
s/الذان/اللذان/g;
s/هيأة/هيئة/g;
s/بأييكم/بأيكم/g;

s/\b(و?) الا(?=[تئ]ي) /$1اللا/gx;
s/(?<= أرنا [ ]) الذين  # S041 A029 /اللذين/gx;

s/ؤا\b/أ/gx;
s/لؤلأ\b/لؤلؤا/gx; # exception for the above rule

s/\b مئ (?= ة | تان | تين) /مائ/gx;

s/(?<=تدعو)ا(?= من)//g;  # S070 A017

s/(?<=\b[وف])سأل/اسأل/g;

s/لتخذت/لاتخذت/g;  # S018 A077 

s/(?<=[ميتأن])حي(?= ا)/حيي/g;
s/آعجمي/أأعجمي/g;
s/ملإ\B/ملئ/g;
s/ا[ئأ]\b/اء/g;
s/أقصا/أقصى/g;
s/الزنى/الزنا/g;
s/رءا/رأى/g;
s/رءيا/رؤيا/g;
s/تراءا/تراءى/g;
s/\b(?=لأيكة)/ا/g;
s/ونئا/ونأى/g;
s/سوأة/سوءة/g;
s/(?<=يا حسرت)ى/ا/g;
s/(?<=يا ويلت)ى(?= أعجزت)/ا/g;
s/سأوريكم/سأريكم/g;
s/أإ(?=مة|نكم|ن\b|فكا)/أئ/g;
s/(?<=تبو)ءا\b/آ/g;
s/أا/ءا/g;
s/\bلدا(?= الباب)/لدى/g;  # S012 A025
s/تترا\b/تترى/g;
s/(?<=\bتبو|تنو)أ/ء/g;

s/(?<!\N{Alef})\N{Hamza}\N{Alef}\B/\N{AlefMadd}/g;
s/(?<=\b\N{AlefHamzaAbove})\N{Hamza}/\N{AlefHamzaAbove}/g;

s/آأ\b/آء/g;
s/تئو/تؤو/g;
s/طغا/طغى/g;
s/(?<=[بف]اءو)\b/ا/g;
s/(?<=ترجو|ندعو)ا//g;
s/(?<=بنو)ا(?= إسرائيل)//g;
s/(?<=ثمود)ا\b//g;

s/(جاءو|تبوءو)\b/$1ا/g;
s/(?<=[أي](?:محو|دعو|تلو|عفو|رجو)|أولو)ا\b//g;

s/(?<=وليعفو)/ا/g;
s/(?<=وعتو\b)/ا/g;

s/(?<=\b (    [أنتي](?:شكو|تلو|بلو|ربو)))ا\b//gx;
s/(?<=\b ([لو][أنتي](?:شكو|تلو|بلو|ربو)))ا\b//gx;
s/(?<=.صالو|كاشفو|ذائقو|ملاقو|مهلكو|مرسلو|باسطو|ناكسو|تاركو)ا\b//g;

s/قواريرا من/قوارير من/g;
s/أإنا لمخرجون/أئنا لمخرجون/g;  # S027 A67 
s/أإنا لتاركو /أئنا لتاركو/g;   # S037 A36 
s/(?<! من [ ]) بعد [ ] ما /بعدما/gx;
s/(?<=سلاسل)ا//g;
s/\N{Tatweel}//g;
s/مالك لا/ما لك لا/g;
s/\bسعو\b/سعوا/g;
s/آتان\b/آتاني/g;
s/مامنا/ما منا/g;
s/امرأ هلك/امرؤ هلك/g;  # S004 A176

print;
