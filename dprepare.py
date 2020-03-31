#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:

from digits import (num_names, num_digits)

def prepare_text(number, end, offset):
    # to compensate for the decimal point,
    # offset and end need to be incremented unless they're 0
    if offset > 0: offset += 1
    if end < 2: end  = 1
    else      : end += 1
    return num_digits[number][offset:end]

def prepare_title(number, end, offset):
    return "Reciting " + num_names[number]
