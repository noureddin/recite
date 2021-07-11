## Global Definitions

    define optag :: [LWJTQRNX] <
    define cltag :: >
    define intag :: $cltag? $optag?

    define not_optag :: [^<]

    define silent_optag :: X<
    define silent :: X< [^>]+ >

    define vowel_letter
        :: [ {Alef} {Waw} {Yeh} ]
        or (?<= [ {AlefMaksura} {Waw} ] $cltag? ) {HiAlef}

    define small_vowel
        :: [ {Tatweel} {NBSP} ] $intag {HiAlef}
        or   {Tatweel}          $intag [ {HiWaw} {HiYeh} ]
        or                             [ {LoWaw} {LoYeh}  ]

    define vowel
        :: $vowel_letter
        or $small_vowel

    define hamz 
        :: [ {Hamza} {AlefHamzaAbove} {AlefHamzaBelow} {WawHamza} {YehHamza} ]

    # TODO: is B<Small Noon> a C<$consonant>?

    define nonhamz_consonant :: [ {Beh}-{Ghain} {Feh}-{Heh} ]

    define consonant :: $hamz or $nonhamz_consonant

    define letter :: $consonant or $vowel_letter

    define waqf
        :: {HiSeen}
        or {HiSeen}{WaqfAwla}  # in S036
        or {WaqfLazem}
        or {WaqfJaez}
        or {WaqfAwla}
        or {WaslAwla}
        or {WaqfSplit}

    # should $cltag? and $waqf? be swaped in word_boundary?
    define word_boundary :: $waqf? $cltag? [ ] $optag?

    # a $waqt?
    define ayah_end
        :: $cltag?  {NBSP} {Ayah}

    define not_ayah_start
        :: [^\n]  # == (?<! ^ | \n )

> define ayah_end
>     :: $cltag?
>        {NBSP} {Ayah} [٠-٩]+
>        (: {NBSP} {Sajdah} )?
>        \n
>        (: {Hizb} {NBSP} )?
>        $optag?

    define tashkeel
        :: {Jazm}
        or {Shadda}? $intag
           (: {Fatha} $intag {HiMeem}?
            | {Damma} $intag {HiMeem}?
            | {Kasra} $intag {LoMeem}?
            | {Fathatan}
            | {Dammatan}
            | {Kasratan}
            | {OpenFathatan}
            | {OpenDammatan}
            | {OpenKasratan}
            )


## Silent Letters

    silent
        :: (<= [ {Fatha} {Kasra} ]            ) {AlefWasla}
        or (<= [ {Fatha} {Kasra} ] {Overline} ) {AlefWasla}
        or $vowel_letter {SilenceMarker}
        or $consonant (= {Overline}? $letter {Shadda} )
        or {Waw} (= {HiAlef} )
        or {AlefMaksura} (= {HiAlef} {Madda}? {Overline}? $letter )

## Dark Red for I<Madd Lazem> (Necessary Prolongation)

    lazem
        :: $vowel {Madda} (= $silent? $consonant [{Shadda}{Jazm}] )
        or [نقصعسلكم] {Madda}

## Blood Red for I<Madd Wajeb> (Obligatory Prolongation)


    wajeb :: $vowel {Madda} (?= $silent? $word_boundary? $hamz )


## Orange Red for I<Madd Jaez> (Permissible Prolongation)

    jaez
        :: $vowel_letter {Jazm}?
        (= {Overline}? $consonant $tashkeel? {Overline}? $silent? {Overline}? $ayah_end )


## Cumin Red for I<Madd Tabiei> (Normal Prolongation)

    tabiei
        :: (<= {AlefMaksura} $cltag ) {HiAlef}  # silent (ie, middle-word)
        or (<= {Waw} $cltag ) {HiAlef}          # also middle-word
        or $small_vowel (?! {Madda} | $ayah_end )

## Blue for Qalqala

    qalqala
        :: [قطبجد] {Jazm}
        or [قطبجد] {Shadda}? (= $tashkeel $ayah_end )


## Dark Blue for Emphatic B<Reh>

TODO: p. 97.

B<Reh> is emphatic (and thus dark blue) if, and only if, it is:
I<maftouE<0x127>a>, I<madmouma>, or I<saakena> after a I<maftouE<0x127>>, or I<madmoum> letter.

If any one of the following is true, it is emphatic:

مفتوحة أو مضمومة بس مش آخر الآية

{Reh} {Shadda}? [{Fatha}{Damma}] (?! $ayah_end )

منونة بالفتح

{Reh} {Shadda}? {Fathatan}
{Reh} {Shadda}? {Open Fathatan}
{Reh} {Shadda}? {Fatha} {High Meem}

منونة بالضم بس مش آخر الآية

{Reh} {Shadda}? {Dammatan}          (?! $ayah_end )
{Reh} {Shadda}? {Open Dammatan}     (?! $ayah_end )
{Reh} {Shadda}? {Damma} {High Meem} (?! $ayah_end )

ساكنة أصلا أو لإنها آخر الآية، ومسبوقة بفتح أو ضم أو ألف مد أو واو مد أو ألف وصل

[{Fatha}{Damma}{Alef}{Waw}{Alef Wasla}] {Reh} ( {Jazm} | (?= $ayah_end ) )

ساكنة أصلا أو لإنها آخر الآية، ومسبوقة بسكون قبل حرف حرف قبله بفتح أو ضم أو ألف مد أو واو مد أو ألف وصل

[{Fatha}{Damma}{Alef}{Waw}{Alef Wasla}] $consonant {Jazm} {Reh} ( {Jazm} | (?= $ayah_end ) )


    define reh :: {Reh} {Shadda}?
    define final_reh :: {Reh} (: {Jazm} | {Shadda}? (= $intag $tashkeel $ayah_end ) )

    emphasis
        :: $reh [{Fatha}{Damma}] (! {HiMeem}? $ayah_end )
        or $reh (= {Fathatan}        )
        or $reh (= {OpenFathatan}    )
        or $reh (= {Fatha} {HiMeem}  )
        or $reh (= {Dammatan}       (! $ayah_end ) )
        or $reh (= {OpenDammatan}   (! $ayah_end ) )
        or $reh (= {Damma} {HiMeem} (! $ayah_end ) )
        or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}{HiAlef}] $cltag? ) $final_reh
        or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}]               $consonant {Jazm}        ) $final_reh
        or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}]        $optag $consonant {Jazm} $cltag ) $final_reh
        or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}] $cltag        $consonant {Jazm}        ) $final_reh
        or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}] $cltag $optag $consonant {Jazm} $cltag ) $final_reh

> emphasis
>     :: $reh [{Fatha}{Damma}] (! {HiMeem}? $ayah_end )
>     or $reh (= {Fathatan}        )
>     or $reh (= {OpenFathatan}    )
>     or $reh (= {Fatha} {HiMeem}  )
>     or $reh (= {Dammatan}       (! $ayah_end ) )
>     or $reh (= {OpenDammatan}   (! $ayah_end ) )
>     or $reh (= {Damma} {HiMeem} (! $ayah_end ) )
>     or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}{HiAlef}]        ) $final_reh
>     or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}{HiAlef}] $cltag ) $final_reh
>     or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}] $consonant {Jazm} ) $final_reh

> emphasis :: {Reh} {Shadda}? [{Fatha}{Damma}] (! {HiMeem}? $ayah_end )
>          or {Reh} {Shadda}? (= {Fathatan}             )
>          or {Reh} {Shadda}? (= {OpenFathatan}        )
>          or {Reh} {SHADDA}? (= {Fatha} {HiMeem}  )
>          or {Reh} {Shadda}? (= {Dammatan}            (! $ayah_end )  )
>          or {Reh} {Shadda}? (= {OpenDammatan}       (! $ayah_end )  )
>          or {Reh} {Shadda}? (= {Damma} {HiMeem} (! $ayah_end )  )
>          or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}{HiAlef}] )
>              {Reh} (: {Jazm} | {Shadda} (= $intag $tashkeel $ayah_end ) )
>          or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}{HiAlef}] $cltag )
>              {Reh} (: {Jazm} | {Shadda} (= $intag $tashkeel $ayah_end ) )
>          or (<= [{Fatha}{Damma}{Alef}{Waw}{AlefWasla}] $consonant {Jazm} )
>              {Reh} (: {Jazm} | (= $tashkeel $ayah_end ) )

## Vowelless Meem

## Concealment (I<Ikhfaa>) of the B<Meem>

    ghunna :: {Meem} (= $word_boundary {Beh} )


## Merging (I<Idgham>) of the B<Meem>

    idgham ::
        ()
        ( {Meem} $word_boundary )
        ( {Meem} {Shadda} [{Fatha}{Damma}{Kasra}] )


## Vowelless B<Noon>, and Tanween

## Conversion (I<Iqlab>) of the B<Noon> and Tanween

    idgham :: ({Noon}) () ({HiMeem})
    ghunna ::
        (<= [{Fatha}{Damma}{Kasra}] $cltag? )
        [{HiMeem}{LoMeem}] (! {Alef}? $ayah_end )

## Concealment (I<Ikhfaa>) of the B<Noon> and Tanween

    ghunna ::
        {Noon} 
        (= $silent? $word_boundary?
            [صذثكجشقسدطزفتضظ]
        )
    ghunna ::
        [{OpenFathatan}{OpenDammatan}{OpenKasratan}]
        (?= [{Alef}{AlefMaksura}]? $word_boundary
            [صذثكجشقسدطزفتضظ]
        )


## Nasal Merging (I<Idgham bi-Ghunna>) of the B<Noon> and Tanween

    idgham ::
        ( )
        ( {Noon} $word_boundary )
        ( {Noon} {Shadda} [{Fatha}{Damma}{Kasra}]? )


    idgham ::
        ( {Noon} )
        ( $word_boundary )
        ( [{Yeh}{Meem}{Waw}] {Shadda}? [{Fatha}{Damma}{Kasra}]? )

    idgham ::
        ( [{OpenFathatan}{OpenDammatan}{OpenKasratan}] )
        ( {Overline}? [{Alef}{AlefMaksura}]? {Overline}? $word_boundary )
        ( [{Yeh}{Noon}{Meem}{Waw}] {Shadda}? [{Fatha}{Damma}{Kasra}]? )


## Labial Merging (I<Idgham bighair Ghunna>) of the B<Noon> and Tanween

    silent ::
        {Noon}
        (= $word_boundary [{Lam}{Reh}])

    silent ::
        [{OpenFathatan}{OpenDammatan}{OpenKasratan}]
        (= [{Alef}{AlefMaksura}]? $word_boundary
            [{Lam}{Reh}]
        )

## Gemination of the B<Noon>

    subst ::
        (
         $not_optag    # to make sure it is not colorized already
         {Noon} {Shadda}
        )
        $optag ([{Fatha}{Damma}{Kasra}]) $cltag
        $optag ({HiMeem}) $cltag
    by :: $1$2$3

    ghunna ::
        (<= $not_optag )  # if not colorized already
        (<= $not_ayah_start )  # if not at the start of an ayah
        {Noon} {Shadda}
        (: [{Fatha}{Damma}{Kasra}] {HiMeem}? )?


## Gemination of the B<Meem>

    subst ::
        (
         $not_optag    # to make sure it is not colorized already
         {Meem} {Shadda}
        )
        $optag  ([{Fatha}{Damma}{Kasra}])  $cltag
        $optag  ({HiMeem})  $cltag
    by :: $1$2$3

    ghunna ::
        (<= $not_optag )  # if not colorized already
        (<= $not_ayah_start )  # if not at the start of an ayah
        {Meem} {Shadda}
        (: [{Fatha}{Damma}{Kasra}] )?



## Post-colorization Processing

    # we used idgham() instead of ghunna() as a work around
    # nonbasic variable lookbehind assertions (we support
    # optionals... TODO)
    subst :: $silent_optag $cltag
    by    ::

    silent :: {Sad} (={HiSeen})

    # restore the black color of the first lam in Allah
    subst :: $silent_optag {Lam} $cltag (= {Lam}{Shadda}{Fatha}{Heh} )
    by    :: {Lam}

    # restore the black color of the alef wasla in Allah
    subst :: $silent_optag {AlefWasla} $cltag (= {Lam}{Lam}{Shadda}{Fatha}{Heh} )
    by    :: {AlefWasla}

    # restore the color of this word; as it conventionally remains black. eg, [49:11]
    subst :: {AlefWasla}{Lam}{Kasra} $silent_optag {AlefWasla} $cltag
    by    :: {AlefWasla}{Lam}{Kasra}{AlefWasla}

> > make MEEM non-ligatured (optional)
> subst :: {MEEM} (?= $tashkeel $letter )
> by    :: $&{ZWJ}

> > swap place of sajdah and end of ayah
> subst :: ( {Ayah} [٠-٩]+ ) {NBSP} ( {Sajdah} )
> by    :: $2{NBSP}$1

> > stylize ayat numbers
> ayat_num :: ({Ayah}) ([٠-٩]+)

> > conventionally, this sign is never put at a sura's start
> subst :: \A {HIZB} {NBSP}
> by    ::
