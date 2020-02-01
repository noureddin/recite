#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:

from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *

from ayat import (suar_names, suar_lengths)


class SuraAyatDialog(QDialog):

    submit = pyqtSignal(int,int,int,bool,bool)

    def __init__(s):
        super().__init__()
        s.setWindowTitle("تسميع آيات القرآن الكريم")
        #
        s.setLayoutDirection(Qt.RightToLeft)
        #
        s.suraEntry = QComboBox()
        s.fromEntry = QSpinBox()
        s.toEntry = QSpinBox()
        s.darkEntry = QCheckBox("الوضع الليلي")
        s.darkEntry.setStyleSheet("text-align: right")
        s.numberEntry = QCheckBox("ترقيم الآيات")
        s.numberEntry.setStyleSheet("text-align: right")
        #
        for (i,n) in enumerate(suar_names):
            s.suraEntry.addItem("%s - %d" % (n, i+1))
        #
        def suraChanged(i):
            s.fromEntry.setMaximum(suar_lengths[i])
            s.toEntry.setMaximum(suar_lengths[i])
            s.toEntry.setValue(suar_lengths[i])
        #
        s.fromEntry.setMinimum(1)
        s.toEntry.setMinimum(1)
        suraChanged(0)
        #
        s.suraEntry.setEditable(True)
        s.suraEntry.lineEdit().selectAll()  # to just type the first characters of a sura's name
        s.suraEntry.setInsertPolicy(QComboBox.NoInsert)
        s.suraEntry.currentIndexChanged.connect(suraChanged)
        #
        s.form = QFormLayout()
        for (name, entry) in (
                ("السورة:",  s.suraEntry),
                ("من آية:",  s.fromEntry),
                ("إلى آية:", s.toEntry),
        ):
            s.form.addRow(name, entry)
        #
        s.okbtn = QPushButton("انطلق")
        s.okbtn.setDefault(True)
        def ok():
            s.submit.emit(
                    s.suraEntry.currentIndex(),
                    s.fromEntry.value()-1,
                    s.toEntry.value(),
                    s.darkEntry.isChecked(),
                    s.numberEntry.isChecked(),
            )
            s.accept()
        s.okbtn.clicked.connect(ok)
        s.box = QVBoxLayout()
        s.box.addLayout(s.form)
        s.box.addWidget(s.darkEntry,    alignment=Qt.AlignCenter)
        s.box.addWidget(s.numberEntry,  alignment=Qt.AlignCenter)
        s.box.addWidget(s.okbtn,        alignment=Qt.AlignCenter)
        #
        s.setLayout(s.box)

