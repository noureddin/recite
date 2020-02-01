#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:

from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *

from colors import getColors
OPACITY_STEP = 5

class ReciterWindow(QMainWindow):

    def __init__(s, text, dark=False):
        super().__init__()
        #
        s.setWindowFlags(Qt.FramelessWindowHint)
        s.setAttribute(Qt.WA_NoSystemBackground)
        s.setAttribute(Qt.WA_TranslucentBackground)
        s.setAttribute(Qt.WA_TransparentForMouseEvents)
        #
        s.t = QTextEdit()
        s.setCentralWidget(s.t)
        s.t.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        s.t.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        #
        s.correct_text = text
        s.correct_len = len(s.correct_text)
        s.opacity = 255
        s.dark = dark
        s.clr = getColors(s.dark, s.opacity)
        # see https://github.com/wereturtle/ghostwriter/issues/206 for QPlainTextEdit
        s.t.setFont(QFont("Amiri", 18))
        s.t.setStyleSheet(s.clr['normal'])
        #
        QShortcut(QKeySequence('Ctrl++'),  s).activated.connect(s.t.zoomIn)
        QShortcut(QKeySequence('Ctrl+-'),  s).activated.connect(s.t.zoomOut)
        QShortcut(QKeySequence('Ctrl+*'),  s).activated.connect(s.moreOpaque)
        QShortcut(QKeySequence('Ctrl+/'),  s).activated.connect(s.lessOpaque)
        #
        s.t.textChanged.connect(s.updateColors)
        #

    def lessOpaque(s):
        s.opacity -= OPACITY_STEP
        if s.opacity < 0: s.opacity = 0
        s.clr = getColors(s.dark, s.opacity)
        s.updateColors()

    def moreOpaque(s):
        s.opacity += OPACITY_STEP
        if s.opacity > 255: s.opacity = 255
        s.clr = getColors(s.dark, s.opacity)
        s.updateColors()

    def updateColors(s):
        n = len(s.t.toPlainText())
        if s.t.toPlainText() != s.correct_text[:n]:
            s.t.setStyleSheet(s.clr['wrong'])
        elif n == s.correct_len:
            s.t.setStyleSheet(s.clr['correct'])
        else:
            s.t.setStyleSheet(s.clr['normal'])

