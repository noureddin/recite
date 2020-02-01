#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:

from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *

from digits import (num_names, digits_length)


class DigitsDialog(QDialog):

    submit = pyqtSignal(str,int,int,bool)

    def __init__(s):
        super().__init__()
        s.setWindowTitle("Reciting the Important Numbers!")
        #
        s.box = QVBoxLayout()
        s.btns = {}
        for d in num_names.keys():
            b = QRadioButton(num_names[d])
            s.btns[d] = b
            s.box.addWidget(b, alignment=Qt.AlignLeft)
        s.btns['pi'].setChecked(True)  # the default number
        #
        s.form = QFormLayout()
        s.offset = QSpinBox(minimum=0, maximum=digits_length, value=0)
        s.form.addRow("Skip first how many digits?", s.offset)
        s.length = QSpinBox(minimum=0, maximum=digits_length, value=digits_length)
        s.form.addRow("Recite how many digits?", s.length)
        #
        s.darkEntry = QCheckBox("Dark Mode")
        #
        s.okbtn = QPushButton("Go!")
        s.okbtn.setDefault(True)
        def ok():
            dname = None
            for d in num_names.keys():
                if s.btns[d].isChecked():
                    dname = d
                    break
            s.submit.emit(
                    dname,
                    s.offset.value(),
                    s.length.value(),
                    s.darkEntry.isChecked(),
            )
            s.accept()
        s.okbtn.clicked.connect(ok)
        s.box.addLayout(s.form)
        s.box.addWidget(s.darkEntry,    alignment=Qt.AlignCenter)
        s.box.addWidget(s.okbtn,        alignment=Qt.AlignCenter)
        #
        s.setLayout(s.box)

