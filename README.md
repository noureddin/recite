# Recite
Want to check your *verbatim* memorization of some text? Like the Quran or the digits of Pi?

Recite is easy to use and extend. It's a Python3 (PyQt5) library and application that help you memorize and check what you've memorized.

---

**Note:** This project is practically dormant in favor of the two Web projects residing in [the `gh-pages` branch of this repo](https://github.com/noureddin/recite/tree/gh-pages); view them at [noureddin.github.io/recite](https://noureddin.github.io/recite) and at [noureddin.github.io/recite/txt](https://noureddin.github.io/recite/txt).

---

## Installation

First, make sure you have the latest `pip` and `PyQt5`:

    sudo -H pip3 install --upgrade pip PyQt5

Second, clone this repo somewhere on your computer:

    git clone https://github.com/noureddin/recite

Then, choose your preferred way to add `qmain.py` and/or `dmain.py` to your `$PATH`. I have two symlinks to them in `~/.bin`, which is in my `$PATH`.

Optional: Install the great [Amiri Font](https://www.amirifont.org/)!

## Usage (starting the ayat application: `qmain.py`)

- Show the graphical dialog:

        ./qmain.py

    **This is all what you need to know to run it, in addition to the "Usage (the Window)" section below.
    For the advanced features, keep reading this section.**

- Recite an entire sura:

        ./qmain.py 114  # recite an-Nas

- Recite a sura, starting from a specific aya:

        ./qmain.py 114 2  # recite an-Nas, from the second aya

- Recite a sura, starting from a specific aya, till a specific aya:

        ./qmain.py 114 2 4  # recite an-Nas, from the second aya to the forth

        ./qmain.py 114 0 4  # recite an-Nas, the first four ayat

In brief, it's `./qmain.py sura start end`.

- If no `end`, it's ends at the sura's end.
- If no `start`, it's starts from the beginning of the sura.
- If no `sura`, it's shows the graphical dialog.

The multi-sura mode:

- Recite from the 1st aya of al-Ikhlaas (Sura 112), to the end of
the Quran:

        ./qmain 112:1

- Recite from the 1st aya of al-Ikhlaas (Sura 112), to the 2nd aya of
al-Falaq (Sura 113), inclusive (A Basmala between them, on a line by
itself, is needed.):

        ./qmain 112:1 113:2

- Recite the entire Juz of Amm, the 30th part of the Quran:

        ./qmain 78:1

- Recite the entire Juz of Tabaarak, the 29th part of the Quran:

        ./qmain 67:1 77:-1

- Recit the entire 2nd sura (the same as `./qmain 2` and `./qmain 2 1`):

        ./qmain 2:1 2:-1

For the multi-sure mode, the 1st arg must
contain a colon (`:`), and so must the 2nd arg.
The 2nd arg is optional
and defaults to the end of the Quran.

In this mode, an aya can be negative, to count from the end:

    ./qmain 2:1 2:-1   # the entire sura
    ./qmain 2:1 2:-2   # the entire sura but the last aya
    ./qmain 2:1 2:-10  # the entire sura but the last ten ayat

Note that an aya of zero is an error. And also note that only this mode
supports the negative ayat; the normal single-sura mode doesn't (yet).

A Basmala is added between the suar. Not before the 1st one, even when
starting from the first aya. So `2:1 3:-1` would have only one Basmala.

The Basmala, currently, interacts badly with pagebreaks, because
pagebreaks, are associated by the next aya, not the previous, thus
you will type a sura, the Basmala, one or two blank lines, then the next
sura. That may be fixed later.


### Options:

- Dark mode: add `-d` or `--dark`. (Options do not combine!)

        ./qmain.py 114 -d

- Recite the ayat with their numbers (ie, write «الم 1» [that is, the aya number after the aya] instead of «الم» for the first aya in the second sura): add `-n` or `--numberayat`.

        ./qmain.py 114 -d -n

- Add a blank line between every two pages (ie, after typing the last aya in a page, you have to have a blank line [press "Enter" twice] before typing the following aya): add `-p` or `--single-pagebreaks`.

        ./qmain.py 114 -d -p

- Add a blank line between every two facing pages, but two blank lines between every two pages that are on the same paper (back-to-back): add `-pp` or `--double-pagebreaks`. If specified with `-p` (`--single-pagebreaks`), `-pp` takes precedence.

        ./qmain.py 114 -d -n -pp

All these options are available in the (graphical) dialog, except the two pagebreaks' options (for now).

## Usage (starting the digits application: `dmain.py`)

- Show the graphical dialog:

        ./dmain.py

- Recite the first 100,000 digits of Pi:

        ./dmain.py pi

- Recite the first 100 digits of Tau (99 after the decimal point):

        ./dmain.py tau 100

- Recite the first 100 digits of *e*, skipping the first three (starting from the third digit after the decimal point; ie, skipping two digits after the decimal point):

        ./dmain.py e 100 3

- Recite the third 10 digits of Sqrt(2):

        ./dmain.py sq2 30 20

In brief, it's `./dmain.py number end start`.

- If no `start`, it starts from the beginning of the number.
- If no `end`, it ends after 100,000 digits (including the integral part).
- If no `number`, it shows the graphical dialog.

### Options:

- Dark mode: add `-d` or `--dark`.

        ./dmain.py tau -d


## Usage (the Window)

Just start typing! You have all the usual text editing functionalities, including copy and paste, and all other system shortcuts for editing, like Ctrl+Backspace to erase the previous word.

### Special shortcuts

- <kbd>Ctrl</kbd>+<kbd>+</kbd>: Zoom in; make the text bigger.
- <kbd>Ctrl</kbd>+<kbd>-</kbd>: Zoom out; make the text smaller.
- <kbd>Ctrl</kbd>+<kbd>*</kbd>: Make the background more opaque.
- <kbd>Ctrl</kbd>+<kbd>/</kbd>: Make the background less opaque (more transparent).
- <kbd>Ctrl</kbd>+<kbd>^</kbd>: Toggle dark mode.


## Usage (the library: `window.py`)

To be added later.


## TODOs

- Make a C++ version, for easier portability, especially for our friends who still use Windows. (Use [MXE](https://mxe.cc/) as [described here](https://stackoverflow.com/a/14170591).)
- Support more than just `default` (light) and `dark` colorschemes.
- Generalize the colorschemes to be full styles. (Just rename `colors` to something more general; the function already returns a Qt Style Sheet string.)
- In Digits, support more numbers. (Phi, sqrt3, sqrt5?)
- In Ayat, support recitation that crosses the suar-borders, so we can recite a "juz'", a "hizb", or a "rub'", easily. But the recitation must be continuous otherwise. (Idea: recite from sura-aya pair, to another sura-aya pair; that way you can, for example, recite `from 1:1 to 2:1`, which is the entire first sura, plus the first aya of the second sura.) (Done. Currently available from the command line arguments only.)
- In Ayat, support reciting by page, "rub'", "hizb", or "juz'", not just suar. (That needs having supported the previous point.)
- Support mistakes counting and reporting.
- Support "How much I have recited correctly till now?", basically a msgbox with the len of the input text, if it's not wrong.


## Disclaimer (about the Quran recitation application)

The Quran needs to be taught *orally*; reading and writing are secondary. You have to learn the Quran from a good teacher, and recite it to a good teacher. This software will help you, but it's not sufficient alone in any way.

This software makes you recite the Quran using the modern orthography (with some exceptions) and no vowel marks at all. That's basically because it's the convenient way to type the Quran on a computer. However, it's never enough alone; you have to listen to, read, and recite orally the Quran. Otherwise you may make some serious mistakes like confusing pronouns (I/you, in verbs, like «أنعمت» in [1:7](https://quran.com/1/7)) or grammatical cases (subject/object: Allah tested Ibrahim or vice versa, in [2:124](https://quran.com/2/124); who fears whom in [35:28](https://quran.com/35/28)).

The only guaranteed way is to recite orally with a teacher. This software is just a help in memorizing, not a replacement for a real, human teacher.
