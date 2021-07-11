
First, we remove any tajweed codes:

    remove  :: [A-Z<>]+

    remove
        :: [
            {Shadda} {Madda}
            {WaqfLazem} {WaqfJaez} {WaqfAwla} {WaslAwla} {WaqfSplit}
            {Imaalah} {Ishmaam} {Tasheel}
            {Overline}
        ]

> remove  :: {NBSP} [ ٠-٩ {Ayah} ]+
    remove  :: {NBSP} [ ٠١٢٣٤٥٦٧٨٩ {Ayah} ]+
    remove  :: {Hizb} {NBSP}
    remove  :: {NBSP} {Sajdah}

Before we remove the tashkeel, we need to work out the hamzas:

    define tanween_fath
        :: {Fathatan} or {OpenFathatan} or {Fatha} {HiMeem}

    define tanween_kasr
        :: {Kasratan} or {OpenKasratan} or {Kasra} {LoMeem}

    define joining_letter
        :: [ ب ت ث ج ح خ س ش ص ض ط ظ ع غ ف ق ك ل م ن ه {AlefWasla} {Yeh} ]
> :: [ {Beh} {Teh}-{Khah} {Seen}-{Ghain} {Feh}-{Heh} {AlefMaksura} {Yeh} ]

    define disjoining_letter
        :: [ أ ؤ إ ئ ا ة د ذ ر ز و ]
> :: [ {AlefHamzaAbove}-{Alef} {TehMarbuta} {Dal}-{Zain} {Waw} ]

    define alef
        :: {Alef} or [ {Tatweel} {NBSP} ] {DaggerAlef}

    replace ::   ( {Khah} {Fatha} {Tah} {Fatha}                # twice in S004 A092
                or {Meem} {Damma} {Teh} {Fatha} {Kaf} {Fatha}  # Shadda is removed. in S012 A031
                or {Meem} {Fatha} {Lam} {Jazm} {Jeem} {Fatha}
            ) {Hamza} $tanween_fath {Alef}
    by      :: $1أ

    replace :: {Hamza} {Fatha} $alef !\>  ::by:: {AlefMadd}

    replace :: {AlefHamzaAbove} {Fatha} {Hamza} {Kasra}  ::by:: {AlefHamzaAbove} {AlefHamzaBelow}

    replace :: {Hamza} {Kasra} (!{LoMeem}) !\>  ::by:: {YehHamza}

    replace :: (<={Kasra}) {Hamza} (! {Fatha} {Alef} )           ::by:: {YehHamza}
    replace :: (<= {Yeh} ) {Hamza} (! . [{HiMeem}{LoMeem}]? \>)  ::by:: {YehHamza}

    replace :: (<! {Alef} ) {Hamza} {Fatha} (!{Alef}) !\>  ::by:: {AlefHamzaAbove}
    replace :: {Fatha} {Hamza} {Jazm} (!{Alef})            ::by:: {AlefHamzaAbove}


    replace :: {Sad} {HiSeen}  ::by:: {Seen}

    remove  :: {Yeh}  {SilenceMarker}
    remove  :: {Alef} {SilenceMarker} !\>  # not end of word

    remove  :: (<={AlefHamzaAbove} {Fatha} {Waw} {Fatha}) [ ]

    > replace :: (<={Waw}) [{Hamza} {AlefHamzaAbove}]
    > by      :: {Hamza}

Then, we remove all tashkeel and waqf signs:

    remove
          :: [    {Fatha}        {Damma}        {Kasra}
                {Fathatan}     {Dammatan}     {Kasratan}
            {OpenFathatan} {OpenDammatan} {OpenKasratan}
            {Madda} {Jazm} {SilenceMarker} {UprightZero}
            {Shadda} {HiMeem} {LoMeem} {HiSeen} {LoSeen}
        ]

    replace :: (<=$joining_letter) {Hamza} {Alef}  ::by:: {YehHamza}{Alef}
    replace :: (<=$joining_letter) {Hamza} !\>     ::by:: {YehHamza}  # not end of word

For now, we also remove ayat numbers, and the start of rub el hizb and place of sajdah, too:

    replace :: {AlefWasla}  ::by:: {Alef}

    remove  :: {Waw} {DaggerAlef} (={Alef})  # الربا in S002 A275-278, S003 A130, S004 A161
    replace :: {Waw} {DaggerAlef}  ::by:: {Alef}

    remove  :: (<= {AlefHamzaBelow} {Lam} ) {Tatweel} {DaggerAlef} (={Heh})
    replace :: {AlefHamzaAbove} {YehHamza} {Lam} {Tatweel} {DaggerAlef} {Heh}  ::by:: أإله

    replace :: \< ({Waw}? {Yeh}) {Tatweel} {DaggerAlef}  ::by:: $1ا [ ]

    replace ::    (: {NBSP} or {Tatweel} ) {DaggerAlef}  ::by:: {Alef}

    remove  :: (<={AlefMaksura}) {DaggerAlef} \>
    replace ::    {AlefMaksura}  {DaggerAlef}  ::by:: {Alef}

    replace :: (<= {Yeh} ) {LoYeh}  ::by:: {Yeh}

    replace :: {LoYeh} !\>  ::by:: {Yeh}

    replace :: {LoWaw} !\>  ::by:: {Waw}

    replace :: (<= {Yeh} ) {Tatweel} {HiYeh}  ::by:: {Yeh}

    replace :: {Tatweel} {HiYeh}  ::by:: {Yeh}

    replace :: {Tatweel} {HiWaw}  ::by:: {Waw}

    replace :: (<= {Waw} ) {LoWaw}  ::by:: {Waw}

    remove  :: [ {LoWaw} {LoYeh} ]

    replace :: {HiNoon}  ::by:: {Noon}

Make ever Farsi Yeh into Arabic Yeh:

    replace :: {Yeh}  ::by:: {ArabicYeh}

Special words:

    replace :: لرحمان  ::by:: لرحمن

    replace :: أولائك  ::by:: أولئك

    replace :: ها (= ذا[ ] or ذه[ ] or ذان[ ] or ذين[ ] or ؤلاء[ ] or كذا )  ::by:: ه

    replace :: هاأنتم  ::by:: ها [ ] أنتم

    replace :: لاكن  ::by:: لكن

    replace :: ذالك  ::by:: ذلك

    replace :: اليل  ::by:: الليل

    replace :: يآت  ::by:: يئات

    replace :: \< (و?) الا(=[تئ]ي)  ::by:: $1اللا

    replace :: الذان  ::by:: اللذان

    replace :: (<= أرنا [ ]) الذين  ::by:: اللذين  # S041 A029

    replace :: هيأة  ::by:: هيئة

    replace :: بأييكم  ::by:: بأيكم

    replace :: ؤا\>     ::by:: أ
    replace :: لؤلأ \>  ::by:: لؤلؤا  # exception for the above rule

Temporary:

    replace :: \< مئ (= ة or تان or تين)  ::by:: مائ

    remove  :: (<=تدعو)ا (=[ ] من)  # S070 A017

    replace :: (<=\<<[وف]) سأل  ::by:: اسأل

    replace :: لتخذت  ::by:: لاتخذت  # S018 A077

    replace :: (<=[ميتأن]) حي (=[ ] ا)  ::by:: حيي

    replace :: آعجمي  ::by:: أأعجمي

    replace :: ملإ!\>  ::by:: ملئ

    replace :: ا[ئأ] \>  ::by:: اء

    replace :: أقصا  ::by:: أقصى

    replace :: الزنى  ::by:: الزنا

    replace :: رءا  ::by:: رأى

    replace :: رءيا  ::by:: رؤيا

    replace :: تراءا  ::by:: تراءى

    replace :: \< (=لأيكة)  ::by:: ا

    replace :: ونئا  ::by:: ونأى

    replace :: سوأة  ::by:: سوءة

    replace :: (<= يا [ ] حسرت) ى  ::by:: ا

    replace :: (<= يا [ ] ويلت) ى (=[ ] أعجزت)  ::by:: ا

    replace :: سأوريكم  ::by:: سأريكم

    replace :: أإ (=مة or نكم or ن\> or فكا)  ::by:: أئ

    replace :: (<= تبو) ءا \>  ::by:: آ

    replace :: أا  ::by:: ءا

    replace :: \< لدا (=[ ] الباب)  ::by:: لدى  # S012 A025

    replace :: تترا \>  ::by:: تترى

    replace :: (<=[ ] تبو or تنو)أ  ::by:: ء

    replace :: (<!{Alef}) {Hamza} {Alef} !\>  ::by:: {AlefMadd}

    replace :: (<=[ ] أ) ء  ::by:: أ

    replace :: آأ \>  ::by:: آء

    replace :: تئو  ::by:: تؤو

    replace :: طغا  ::by:: طغى

    remove  :: (<= ترجو or ندعو ) ا
    remove  :: (<= بنو ) ا  (=[ ] إسرائيل )
    remove  :: (<= ثمود ) ا \>

    replace :: ( [بف] اءو \> or جاءو \> or تبوءو or وليعفو or وعتو \> )  ::by:: $1 ا

    remove  :: (<= [أي] (: محو or دعو or تلو or عفو or رجو ) or أولو) ا \>

    remove  :: (<= \<< (      [أنتي] (: شكو or تلو or بلو or ربو ))) ا \>
    remove  :: (<= \<< ( [لو] [أنتي] (: شكو or تلو or بلو or ربو ))) ا \>

    remove  :: (<= (: .صالو or كاشفو or ذائقو or ملاقو or مهلكو or مرسلو or باسطو or ناكسو or تاركو) ) ا \>

    replace :: قواريرا [ ] من  ::by:: قوارير [ ] من

    replace :: أإنا [ ] لمخرجون  ::by:: أئنا [ ] لمخرجون  # S027 A67

    replace :: أإنا [ ] لتاركو  ::by:: أئنا [ ] لتاركو  # S037 A36

    replace :: (<! من [ ]) بعد [ ] ما  ::by:: بعدما

    remove  :: (<= سلاسل) ا

    replace :: مالك [ ] لا  ::by:: ما [ ] لك [ ] لا

    replace :: \< سعو \>  ::by:: سعوا

    replace :: آتان \> ::by:: آتاني

    replace :: مامنا  ::by:: ما [ ] منا

    replace :: امرأ [ ] هلك  ::by:: امرؤ [ ] هلك  # S004 A176

    remove  :: {Tatweel}

    replace :: \< أء ::by:: أأ  # NEW

    replace :: (<=متك|ملج) ئا \> ::by:: أ  # NEW

    remove  :: (<=وليعفوا) ا  # NEW
