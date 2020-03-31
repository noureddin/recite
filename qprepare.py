#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:


from ayat import (ayat, suar_names, suar_lengths, pagebreaks_outer, pagebreaks_inner)


# 0 <= wrongScore() <= 1; 0 means a wrong char is not counted, and 1 means it's considered very wrong.
def wrongScore(currCharEntered, currCharExpected, currCharNAttemps, nextCorrectChar, prevCorrectChar, isPrevWrong):
    if isPrevWrong:
        return 0  # fast typist; errors should be counted only once
    # nonletters are completely ignored in counting (but are still marked as wrong [ie, red])
    acceptedletters = ('ا', 'أ', 'إ', 'آ', 'ء', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'ة', 'و', 'ؤ', 'ي', 'ى', 'ئ')
    # please note that numbers are not included; even if numberayat is enabled, mistakes in ayat numbers are not counted
    if currCharEntered not in acceptedletters:
        return 0  # fast but inaccurate typist
    if currCharNAttemps >= 3:
        return 1  # you forgot and are just guessing
    # aya boundries
    if currCharExpected == '\n' or currCharEntered == '\n':
        return 0.1
    # word boundries
    if currCharExpected == ' ' or currCharEntered == ' ':
        return 0.2
    # mixed a letter with the next one; common in fast typing
    if currCharEntered == nextCorrectChar:
        return 0.5
    # commonly mixed letters, from the easily mixed to the hardest (in my opinion)
    for letters, score in (
            # very similar letters:
            (('ا', 'أ', 'ء', 'آ', '|', 'ئ', 'ؤ'), 0.1),  # hamazat are hard
            (('و', 'ؤ'), 0.2),
            (('ي', 'ئ', 'ى'), 0.2),
            (('ا', 'ى'), 0.2),
            # similar sounding letters:
            (('ت', 'د'), 0.5),
            (('ت', 'ط'), 0.5),
            (('ت', 'ة'), 0.5),
            (('ة', 'ه'), 0.5),
            (('ث', 'س'), 0.5),
            (('ح', 'خ'), 0.5),
            (('د', 'ض'), 0.5),
            (('ذ', 'ز'), 0.5),
            (('ذ', 'ظ'), 0.5),
            (('ز', 'س'), 0.5),
            (('س', 'ص'), 0.5),
            (('ض', 'ظ'), 0.5),  # for Khalijis
            (('ق', 'ك'), 0.5),
            # both visually similar and similar sounding but to a lesser extent:
            (('ت', 'ث'), 0.75),
            (('د', 'ذ'), 0.75),
            (('س', 'ش'), 0.75),
            (('ع', 'غ'), 0.75),
    ):
        if currCharEntered in letters and currCharExpected in letters:
            return score
    return 1  # everything else


def prepare_text(start, end, numberayat, pagebreaks=''):
    # start and end are (int,int), representing (sura,aya)-pair
    # if sura is not the same in both, it's a recitation of multiple suar. basmala is needed in this case
    if end[0] < start[0]: return ''
    if pagebreaks == 'single':
        def pb(s,a):
            if a in pagebreaks_outer[s]: return '\n'
            if a in pagebreaks_inner[s]: return '\n'
            return ''
    elif pagebreaks == 'double':
        def pb(s,a):
            if a in pagebreaks_outer[s]: return '\n\n'
            if a in pagebreaks_inner[s]: return '\n'
            return ''
    else:
        def pb(s,a): return ''
    #
    if numberayat:
        def n(a): return ' ' + str(a+1)
    else:
        def n(a): return ''
    #
    if start[0] == end[0]:
        sura, aya_start, aya_end = start[0], start[1], end[1]
        correct_ayat = "\n".join([ pb(sura,a) + ayat[sura][a] + n(a) for a in range(aya_start, aya_end) ])
    else:
        sura_start = "\nبسم الله الرحمن الرحيم\n"
        sura, aya_start, aya_end = start[0], start[1], suar_lengths[start[0]]
        correct_ayat = "\n".join([ pb(sura,a) + ayat[sura][a] + n(a) for a in range(aya_start, aya_end) ])
        for sura in range(start[0]+1, end[0]):
            aya_start, aya_end = 0, suar_lengths[sura]
            correct_ayat += sura_start + "\n".join([ pb(sura,a) + ayat[sura][a] + n(a) for a in range(aya_start, aya_end) ])
        sura, aya_start, aya_end = end[0], 0, end[1]
        correct_ayat += sura_start + "\n".join([ pb(sura,a) + ayat[sura][a] + n(a) for a in range(aya_start, aya_end) ])
    correct_ayat = correct_ayat.lstrip('\n')
    return correct_ayat


def prepare_title(sura, aya_start, aya_end):
    title = "تسميع سورة " + suar_names[sura]
    # TODO: include the ayat range
    return title
