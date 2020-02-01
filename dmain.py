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

w = None
def showReciterWindow(number, offset, length, dark):
    global w
    # to compensate for the decimal point, offset needs to be incremented unless it's 0
    # and length needs to be incremented unless the offset is incremented
    if offset > 0:
        offset += 1
    else:
        length += 1
    if offset == 0 and length == 2:  # edge case
        end = 1
    else:  # the normal case
        end = offset + length
    txt = num_digits[number][offset:end]
    w = ReciterWindow(txt, dark)
    w.setWindowTitle("Reciting " + num_names[number])
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

number = getArg(1)
if number is not None:
    offset = getIntArg(2)
    if offset is None or offset < 0 or offset >= digits_length:
        offset = 0
    length = getIntArg(3)
    if length is None or length <= 0 or length > digits_length:
        length = digits_length
    showReciterWindow(number, offset, length, dark)
else:
    pass
    diag = DigitsDialog()
    diag.rejected.connect(sys.exit)
    diag.submit.connect(showReciterWindow)
    diag.open()

app.exit(app.exec_())
