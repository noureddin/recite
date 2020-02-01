#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:

import sys
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *

from qdialog import SuraAyatDialog
from window import ReciterWindow
from ayat import (ayat, suar_names, suar_lengths, pagebreaks_outer, pagebreaks_inner)

w = None
def showReciterWindow(sura, aya_start, aya_end, dark, numberayat, pagebreak=''):
    global w
    if pagebreaks == 'single':
        def pb(s,a):
            if a == 0: return ''
            if a in pagebreaks_outer[s]: return '\n'
            if a in pagebreaks_inner[s]: return '\n'
            return ''
    elif pagebreaks == 'double':
        def pb(s,a):
            if a == 0: return ''
            if a in pagebreaks_outer[s]: return '\n\n'
            if a in pagebreaks_inner[s]: return '\n'
            return ''
    else:
        def pb(s,a): return ''
    if numberayat:
        correct_ayat = "\n".join([ pb(sura,a) + ayat[sura][a] + ' ' + str(a+1) for a in range(aya_start, aya_end) ])
    else:
        correct_ayat = "\n".join([ pb(sura,a) + ayat[sura][a] for a in range(aya_start, aya_end) ])
    w = ReciterWindow(correct_ayat, dark)
    w.setWindowTitle("تسميع سورة " + suar_names[sura])
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
else:
    diag = SuraAyatDialog()
    diag.rejected.connect(sys.exit)
    diag.submit.connect(showReciterWindow)
    diag.open()

app.exit(app.exec_())
