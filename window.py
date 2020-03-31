#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:

from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *

from colors import getColors
OPACITY_STEP = 5

class ReciterWindow(QMainWindow):

    def __init__(s, text, dark=False, title='Recite', rtl=False, filterText=None, wrongScore=None,
                 msgTxt='<b>Well done!</b>',
                 msgInfo='Your accuracy is %.2f%%.',
                 msgOther='Another Recitation',
                 msgRepeat='Repeat Recitation',
                 msgQuit='Quit',
                 otherRecitation=None):
        super().__init__()
        s.filterText = filterText if filterText is not None else lambda t: t
        s.wrongScore = wrongScore if wrongScore is not None else lambda isPrevWrong,**kw: 0 if isPrevWrong else 1
        s.rtl = rtl
        s.msgTxt = msgTxt
        s.msgInfo = msgInfo
        s.msgOther = msgOther
        s.msgRepeat = msgRepeat
        s.msgQuit = msgQuit
        s.otherRecitation = otherRecitation
        #
        s.setWindowTitle(title)
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
        s.mistakes = 0
        # see https://github.com/wereturtle/ghostwriter/issues/206 for QPlainTextEdit
        s.t.setFont(QFont("Amiri", 18))
        s.t.setStyleSheet(s.clr['normal'])
        #
        QShortcut(QKeySequence('Ctrl++'),  s).activated.connect(s.t.zoomIn)
        QShortcut(QKeySequence('Ctrl+-'),  s).activated.connect(s.t.zoomOut)
        QShortcut(QKeySequence('Ctrl+*'),  s).activated.connect(s.moreOpaque)
        QShortcut(QKeySequence('Ctrl+/'),  s).activated.connect(s.lessOpaque)
        QShortcut(QKeySequence('Ctrl+^'),  s).activated.connect(s.toggleDark)
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

    def toggleDark(s):
        s.dark = not s.dark
        s.clr = getColors(s.dark, s.opacity)
        s.updateColors()

    def updateColors(s):
        txt = s.filterText(s.t.toPlainText())
        n = len(txt)
        if txt != s.correct_text[:n]:
            s.t.setStyleSheet(s.clr['wrong'])
            #
            nextCorrectChar = s.correct_text[n] if n < s.correct_len else ''
            prevCorrectChar = s.correct_text[n-2] if n-2 >= 0 else ''
            isPrevWrong = (prevCorrectChar != txt[-2]) if n > 1 else False
            s.mistakes += s.wrongScore(
                    currCharEntered = txt[-1],
                    currCharExpected = s.correct_text[n-1],
                    currCharNAttemps = 0, # XXX TODO XXX
                    nextCorrectChar = nextCorrectChar,
                    prevCorrectChar = prevCorrectChar,
                    isPrevWrong = isPrevWrong,
                )
        elif n == s.correct_len:
            s.t.setStyleSheet(s.clr['correct'])
            s.successMessage()
        else:
            s.t.setStyleSheet(s.clr['normal'])

    def successMessage(s):
        # px = QPixmap(48,48)
        # px.fill(Qt.transparent)
        # painter = QPainter(px)
        # painter.setRenderHint(QPainter.Antialiasing)
        # painter.setFont(QFont('Emoji One', 35))
        # painter.drawText(0,35, '🎉')
        # painter.end()
        # px.save('party.png')
        px = QPixmap('party.png')
        #
        scorepercent = 100 * ( (s.correct_len - s.mistakes) / s.correct_len )
        #
        msgBox = QMessageBox(text=s.msgTxt, informativeText=s.msgInfo%scorepercent, iconPixmap=px)
        if s.rtl:
            msgBox.setLayoutDirection(Qt.RightToLeft)
        other  = msgBox.addButton(s.msgOther,   QMessageBox.AcceptRole)  if s.otherRecitation else None
        repeat = msgBox.addButton(s.msgRepeat, QMessageBox.AcceptRole)
        quit   = msgBox.addButton(s.msgQuit,   QMessageBox.RejectRole)
        # cancel = msgBox.addButton('لا شيء', QMessageBox.RejectRole)
        # msgBox.setDefaultButton(other)  # pressing enter is automatic at an aya's end
        msgBox.exec()
        btn = msgBox.clickedButton()
        if btn == other:
            s.otherRecitation()
        elif btn == repeat:
            s.t.clear()
            s.mistakes = 0
        elif btn == quit:
            s.close()
        return

    def setText(s, text, title=None, dark=None):
        if dark is not None:
            s.dark = dark
            s.clr = getColors(s.dark, s.opacity)
        if title is not None:
            s.title = title
        s.correct_text = text
        s.correct_len = len(s.correct_text)
        s.mistakes = 0
        s.t.clear()
