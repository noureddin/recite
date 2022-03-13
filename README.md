# Recite (the Web version)

This is the web version of [Recite](https://github.com/noureddin/recite/tree/master), for the Quran only, but with much, much more features.

Use it at: [noureddin.github.io/recite](https://noureddin.github.io/recite).

---

## Features

1. Two quiz modes:

    1. no-typing Uthmani script, and
    2. typing-only Imlaai script.


2. Opt-in audio recitation after completing every ayah, in either mode. (It can optionally be made _before_ every ayah, which is called the "teacher mode".)

3. Night mode, in addition to the default light mode.

4. The ability to quiz yourself on any number of consecutive ayat, including for example a number of complete suar, an entire juz that starts in a sura and ends in another, etc.

5. Tajweed&ndash;color-coding in the No-typing Uthmani mode, or with no colorization.

6. The ability to use only the keyboard, only the mouse, only the touch-pad, or even only the touch screen.

7. Being responsive and so adapts to virtually any device, from a large TV to a mobile phone.

8. (For geeks) URL parameters to "pre-configure" the preferences and even what to recite. (Detailed below.)

9. (For developers) Easy to embed in other web apps. (Detailed below, under the "Even more advanced URL parameters" heading.)

### URL Parameters (for advanced users)

> `https://noureddin.github.io/recite/?PARAMS`

Examples of `PARAMS`:

- `s=1`: the entire first sura
- `s=2`: the entire second sura
- `s=1-2`: the first and second suar
- `s=-3`: the first three suar (`1` is optional here)
- `s=78-`: all the suar from An-Naba' (sura 78) till the end of the Quran
- `p=1`: the entire first page (in Mushaf Medina)
- `p=2`: the entire second page (in Mushaf Medina)
- `p=1-3`: the first three pages (in Mushaf Medina)
- `j=1`: the entire first juz
- `j=30`: the entire last juz
- `r=1-4`: the first four rubs (in the entire Quran)
- `r=10//1`: the first rub in the 10th juz
- `r=10//1-10//2`: the first two rubs in the 10th juz
- `r=10//7-10//8`: the last two rubs in the 10th juz
- `h=1`: the entire first hizb (half-juz)
- `1/1-1/3`: from the first ayah of first sura, till the third ayah of the first sura
- `2/1-4/3`: from the first ayah of second sura, till the third ayah of the fourth sura

Any of these parameters can have `a=` to add ayat from *after* the specified region, or `b=` to add ayat from *before* the specified region. Examples:

- `p=1-3&a=1`: the first three pages (in Mushaf Medina), and one ayah after them 
- `j=15&a=36`: the entire 15th juz, and 36 ayah after it
- `j=2&b=5`: the entire second juz, and five ayat before it

Other parameters you can add to pre-configure the preferences:

- `d`, or `dark`: select the dark mode by default
- `l`, or `light`: de-select the dark mode (the default; use only to annul a previous `d`)
- `c=`, or `color=`: select the text colorization in the Uthmani mode; it takes the following values:

    1. `t`, `taj`, or `tajweed`: Tajweed&ndash;color-coding (the default)
    2. `b`, `bas`, or `basic`: colorize different parts of the letters differently
    3. `n`, `no`, or `none`: no colorization at all

- `m=`, `mv=`, or `mvbtns=`: select the placement of the movement buttons in the Uthmani mode; it takes the following values:

    1. `b`: bottom (the default)
    2. `r`: right
    3. `l`: left

- `q=`, `qz=`, or `quizmode`: select the quizmode; it takes the following values:

    1. `u`, `uthm`, or `uthmani`: select the no-typing Uthmani mode (the default; use only to annul a previous `quizmode=imlaai`)
    2. `i`, `imla`, or `imlaai`: select the typing-only Imlaai mode

- `byword`: change the feedback rate in the Imlaai mode to by-word, instead of by-letter
- `byletter`: change the feedback rate in the Imlaai mode to by-letter, instead of by-word (the default; use only to annul a previous `byword`)

- `t`, `teach`, or `teacher`: enable the teacher mode (play the audio recitation for the ayah _before_ you start reciting it, not after).
- `n`, `noteach`, or `noteacher`: disable the teacher mode (the default; play the audio recitation for the ayah _after_ you finish reciting it).

- `qari=`: select the Qari for the audio recitation; any invalid value (including no value) is considered as "no audio recitation". The [Qaris file](res/qaris) contains, for each audio recitation, its address followed by its name. The valid values for this option are the addresses (the lines that are all-English with no spaces).

    **Note:** Browsers don't allow any page to play audio before a user starts interacting with it, unless the user gave that domain the permission, so, if you use these parameters to select ayat, and a qari, _and_ enable teacher mode, then you won't hear the first ayah. Click anywhere inside the page then press Escape to hear the first ayah. Or allow `noureddin.github.io` to autoplay audio.

    **Tip:** Pressing <kbd>Escape</kbd> anytime repeats the audio recitation for the current ayah, which is useful in the teacher mode.

Please note that all these parameters only change the default; all of them are still changeable from the preferences window.

<details>
<summary><b>Even more advanced URL parameters</b></summary>

<p></p>

These are not changeable from the UI, only from the URL parameters; they are too advanced and/or too specific for almost all users.

- `qariurl=`, provide the url of your preferred audio recitation server, even a locally hosted one (e.g., `http://0.0.0.0:6236`, but NOT `file:///`). Makes the Qari selector empty. But changing the Qari selector overrides this. The given URL must be a full URL where ayat audio files can be found; e.g., one can append `/001001.mp3` to the given URL and find the first ayah of the first sura.

- `dt` or `disableteacher`, to remove teacher mode selector from the UI; teacher mode can still be set from the URL params. Useful to force a specific value for the option in e.g. an embedding web app.

- `zz`, for integration into another app. Made primarily for [Zikr-uz-Zikr](https://github.com/noureddin/zz), but is generic enough to be used with other apps.

    When enabled it does the following:

    - On start, instead of the "New" button, an "Ignore" button is shown (in addition to "Repeat").
    - On start, the parent app is notified with the title of the recitation, in order to update its window's title.
    - On end, instead of showing the selectors (to select new suar or ayat), it only shows "Return" and "Repeat" buttons.
    - On end, below the ending message, a "Return" button is shown.
    - If the user changes any setting, the parent app is notified immediately.

    To use this mode, load Recite in an iframe with `zz` URL param, and implement these functions in your global (i.e., `window`) namespace:
    - `zz_show()`: called after some basic loading is finished, so the parent shows Recite's iframe.
    - `zz_done()`: called when "Return" is clicked, at the end.
    - `zz_ignore()`: called when "Ignore" is clicked, anytime.

        Unlike `zz_done()` (the "Return" button), `zz_ignore()` means that the user doesn't want to register this recitation.
        So, if you're asking the user how their recitation/memorization was, don't do that if `zz_ignore()` is called instead of `zz_done()`.

    - `zz_set_title(title)`: called on start to set the parent window's title to the current recitation content, the same as the Recite's window's title without `| رسايت` and the title appearing above the header buttons.
    - `zz_set_quizmode(uthm_or_imla)`: called when the user changes the quiz mode selector. Either `"uthm"` for Uthmani (default) or `"imla"` for Imlaai.
    - `zz_set_feedbackrate(emptystring_or_word)`: called when the user changes the feedback rate selector for the Imlaai mode. Empty string (`""`) is for by-letter (default) and `"word"` is for by-word.
    - `zz_set_tajweed(t_or_b_or_n)`: called when the user changes the text colorization selector for the Uthmani mode. `"t"` for Tajweed (default), `"b"` for Basic (parts of characters), and `"n"` for None.
    - `zz_set_dark(boolean)`: called when the user changes the dark mode checkbox. Either `true` (dark) or `false` (light).
    - `zz_set_mvbtns(b_or_r_or_l)`: called when the user changes the movement buttons for the Uthmani mode. `"b"` for Bottom (default), `"r"` for Right, and `"l"` for Left.

    You are likely to load Recite with a specific range of ayat to start the recitation immediately.

    You can check [Zikr-uz-Zikr's zz_* functions in zz.py](https://github.com/noureddin/zz/blob/gh-pages/zz.py#L757-L813).

</details>

---

Many thanks for [Khaled Hosny](https://github.com/khaledhosny/) for his work on [Quran Data](https://github.com/aliftype/quran-data) and [Amiri Font](https://www.amirifont.org/).

Heartfelt thanks for the [Verse By Verse MP3 Quran](http://www.versebyversequran.com/) project,
for providing the audio recitations for every project that needs them,
including Recite Web and [Ayat](https://quran.ksu.edu.sa/).

Thanks for my friends [Ezz El Din](https://github.com/EzzEddin) and [Ahmad Hassan](https://github.com/ahmad-h-yassin) for testing these applications with me and giving me invaluable feedback.
