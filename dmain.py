#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:

import sys
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *

from ddialog import DigitsDialog
from window import ReciterWindow
from digits import (num_names, num_digits, digits_length)
from dprepare import (prepare_text, prepare_title)

w = None
def showReciterWindow(number, end, offset, dark, igns):
    global w
    text = prepare_text(number, end, offset)
    title = prepare_title(number, end, offset)
    filterText = ( lambda t: t.translate(str.maketrans('','',' \n\t')) ) if igns else None
    #
    def updateReciterWindow(number, end, offset, dark, igns):
        text = prepare_text(number, end, offset)
        title = prepare_title(number, end, offset)
        w.setText(text=text, title=title, dark=dark)
    #
    def otherRecitation():
        d = DigitsDialog()
        d.rejected.connect(sys.exit)
        d.submit.connect(updateReciterWindow)
        d.darkEntry.setChecked(w.dark)
        d.ignsEntry.setChecked(igns)
        d.open()
    #
    w = ReciterWindow(text, dark=dark, title=title, filterText=filterText, otherRecitation=otherRecitation)
    w.setWindowState(Qt.WindowMaximized)
    w.show()

def getArg(i):
    try: return sys.argv[i]
    except: return None

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
igns = popArgValue('--ignore-spaces') or popArgValue('-s')

number = getArg(1)
if number is not None:
    end = getIntArg(2)
    if end is None or end <= 0 or end > digits_length:
        end = digits_length
    offset = getIntArg(3)
    if offset is None or offset < 0 or offset >= digits_length:
        offset = 0
    showReciterWindow(number, end, offset, dark, igns)
else:
    diag = DigitsDialog()
    diag.rejected.connect(sys.exit)
    diag.submit.connect(showReciterWindow)
    diag.open()

app.exit(app.exec_())
