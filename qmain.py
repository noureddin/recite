#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:

import sys
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *

from qdialog import SuraAyatDialog
from window import ReciterWindow
from ayat import suar_lengths
from qprepare import (prepare_text, prepare_title, wrongScore)


w = None
def showReciterWindow(sura, aya_start, aya_end, dark, numberayat, pagebreaks='', start=None, end=None, title=None):
    global w
    if sura is not None:
        start = (sura, aya_start)
        end = (sura, aya_end)
    text = prepare_text(start, end, numberayat, pagebreaks)
    title = prepare_title(sura, aya_start, aya_end) if title is None else title
    if text == '': sys.exit()  # TODO
    #
    def updateReciterWindow(sura, aya_start, aya_end, dark, numberayat, pagebreaks=''):
        text = prepare_text(sura, aya_start, aya_end, numberayat, pagebreaks)
        title = prepare_title(sura, aya_start, aya_end)
        w.setText(text=text, title=title, dark=dark)
    #
    def otherRecitation():
        d = SuraAyatDialog()
        d.rejected.connect(sys.exit)
        d.submit.connect(updateReciterWindow)
        d.open()
    #
    w = ReciterWindow(
            text,
            dark=dark,
            title=title,
            wrongScore=wrongScore,
            rtl=True,
            msgTxt='<b>بارك الله فيك، وفتح عليك.</b>',
            msgInfo='لقد أتممت التسميع بدقة %.2f%%.',
            msgOther='تسميع آخر',
            msgRepeat='إعادة التسميع',
            msgQuit='خروج',
            otherRecitation=otherRecitation,
        )
    w.setWindowState(Qt.WindowMaximized)
    w.show()


def getIntArg(i):
    try: return int(sys.argv[i])
    except: return None


def popArgValue(v):
    if v in sys.argv:
        sys.argv.remove(v)
        return True
    return False


app = QApplication(sys.argv)

dark = popArgValue('--dark') or popArgValue('-d')
numberayat = popArgValue('--numberayat') or popArgValue('-n')

single_pagebreaks = popArgValue('--single-pagebreaks') or popArgValue('-p')
double_pagebreaks = popArgValue('--double-pagebreaks') or popArgValue('-pp')
# if both specified, double takes precedence. that may change in the future
if   double_pagebreaks: pagebreaks = 'double'
elif single_pagebreaks: pagebreaks = 'single'
else:                   pagebreaks = ''



sura = getIntArg(1)
if sura is not None:
    sura -= 1  # b/c Python's indexing is 0-based, but the input is expected to be 1-based
    aya_start = getIntArg(2)
    if aya_start is None: aya_start = 0
    else: aya_start -= 1
    aya_end = getIntArg(3)
    if aya_end is None: aya_end = suar_lengths[sura]
    showReciterWindow(sura, aya_start, aya_end, dark, numberayat, pagebreaks)

elif len(sys.argv) > 1 and ':' in sys.argv[1]:  # a q&d solution to recite multiple suar at once
    start = tuple( map( lambda s: int(s)-1,  sys.argv[1].split(':') ) )
    if len(sys.argv) > 2 and ':' in sys.argv[2]:
        sura_end, aya_end = map( lambda s: int(s), sys.argv[2].split(':') )
        sura_end -= 1
        if aya_end < 1:  # count from the end; -1 means the last aya
            aya_end += 1 + suar_lengths[sura_end]
        end = (sura_end, aya_end)
    else:
        end = (len(suar_lengths)-1, suar_lengths[-1])
    showReciterWindow(None, None, None, dark, numberayat, pagebreaks, start=start, end=end, title='تسميع ما تيسر من القرآن')

else:
    diag = SuraAyatDialog()
    diag.rejected.connect(sys.exit)
    diag.submit.connect(showReciterWindow)
    diag.open()

app.exit(app.exec_())
