# Recite
Want to check your *verbatim* memorization of some text? Like the Quran or the digits of Pi?

Recite is easy to use and extend. It's a Python3 (PyQt5) library and application that help you memorize and check what you memorized.

## Installation

First, make sure you have the latest `pip` and `PyQt5`:

    sudo -H pip3 install --upgrade pip PyQt5

Second, clone this repo somewhere on your computer:

    git clone https://github.com/noureddin/recite

Then, choose your preferred way to add `qmain.py` and/or `dmain.py` to your `$PATH`. I have two symlinks to them in `~/.bin`, which is in my `$PATH`.

## Usage (starting the ayat application: `qmain.py`)

- Show the graphical dialog:

    ./qmain.py

- Recite an entire sura:

    ./qmain.py 114  # recite an-Nas

- Recite a sura, starting from a specific aya:

    ./qmain.py 114 2  # recite an-Nas, from the second aya

- Recite a sura, starting from a specific aya, till a specific aya:

    ./qmain.py 114 2 4  # recite an-Nas, from the second aya to the forth

    ./qmain.py 114 0 4  # recite an-Nas, the first four ayat


### Options:

- Dark mode: add `-d` or `--dark`. (Options do not combine!)

    ./qmain.py 114 -d

- Recite the ayat with their numbers (ie, write «الم 1» [that is, the aya number after it] instead of «الم» for the first aya in the second sura): add `-n` or `--numberayat`.

    ./qmain.py 114 -d -n

- Add a blank line between every two pages (ie, typing an aya that is the last aya in a page, you have to have a blank line [press "Enter" twice] before the typing the following aya): add `-p` or `--single-pagebreaks`.

    ./qmain.py 114 -d -p

- Add a blank line between every two facing pages, but two blank lines between every two pages that are on the same paper (back-to-back): add `-pp` or `--double-pagebreaks`. If specified with `-p` (`--single-pagebreaks`), it takes precedence over it.

    ./qmain.py 114 -d -n -pp


## Usage (starting the digits application: `dmain.py`)

- Show the graphical dialog:

    ./dmain.py

- Recite the first 100,000 digits of Pi:

    ./dmain.py pi

- Skip the first 10 digits, and recite rest of the first 100,000 digits of *e*:

    ./dmain.py e 10 

- Recite the first 100 digit of Tau:

    ./dmain.py tau 0 100

- Skip the first 10 digits, and recite the following 20 digits of Sqrt(2):

    ./dmain.py sq2 10 20

### Options:

- Dark mode: add `-d` or `--dark`. (Options do not combine!)

    ./dmain.py tau -d


## Usage (the Window)

Just start typing! You have all the usual text editing functionalities, including copy and paste, and all other system shortcuts for editing, like Ctrl+W to erase the previous word.

### Special shortcuts

- <kbd>Ctrl</kbd>+<kbd>+</kbd>: Zoom in; make the text bigger.
- <kbd>Ctrl</kbd>+<kbd>-</kbd>: Zoom out; make the text smaller.
- <kbd>Ctrl</kbd>+<kbd>*</kbd>: Make the background more transparent.
- <kbd>Ctrl</kbd>+<kbd>/</kbd>: Make the background less transparent.


## Usage (the library: `window.py`)

To be added later.


## TODOs

- Make a C++ version, for easier portability, especially for our friends who still use Windows. (Use [MXE](https://mxe.cc/) as [described here](https://stackoverflow.com/a/14170591).)
- Support more than just `default` (light) and `dark` colorschemes.
- Generalize the colorschemes to be full styles. (Just rename `colors` to something more general; the function already returns a Qt Style Sheet string.)
- In Digits, support more numbers. (Phi, sqrt3, sqrt5?)
- In Ayat, support recitation that crosses the suar-borders, so we can recite a "juz'", a "hizb", or a "rub'", easily. But the recitation must be continuous otherwise. (Idea: recite from sura-aya pair, to another sura-aya pair; that way you can, for example, recite `from 1:1 to 2:1`, which is the entire first sura, plus the first aya of the second sura.)
- In Ayat, support reciting by page, "rub'", "hizb", or "juz'", not just suar. (That needs having supported the previous point.)
- Support mistakes counting and reporting.
- Support "How much I have recited correctly till now?", basically a msgbox with the len of the input text, if it's not wrong.
