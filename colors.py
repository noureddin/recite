#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# vim: set et sw=4 ts=4:

THREASHOLD = 150

# returns a dictionary like:
#   { 'correct': 'color: rgb(0,0,0); background-color: rgb(255,255,255);',
#     'normal':  'color: rgb(0,0,0); background-color: rgb(128,255,128);',
#     'wrong':   'color: rgb(0,0,0); background-color: rgb(255,128,128);' }
def getColors(dark=False, opacity=255):
    if not 0 <= opacity < 256:
        raise ValueError(f"ReciterTextColors expects 'opacity' to be in range(0,256); got {opacity}.")
    if opacity == 255:
        if dark:
            return {
                'normal':   'color: rgb(255,  255,  255); background-color: rgb(0,    0,    0);',
                'correct':  'color: rgb(255,  255,  255); background-color: rgb(0,    100,  0);',
                'wrong':    'color: rgb(255,  255,  255); background-color: rgb(100,  0,    0);',
            }
        else:
            return {
                'normal':   'color: rgb(0,    0,    0);   background-color: rgb(255,  255,  255);',
                'correct':  'color: rgb(0,    0,    0);   background-color: rgb(128,  255,  128);',
                'wrong':    'color: rgb(0,    0,    0);   background-color: rgb(255,  128,  128);',
            }
    if opacity >= THREASHOLD:
        if dark:
            return {
                'normal':   f'color: rgb(255,  255,  255); background-color: rgba(0,    0,    0,    {opacity});',
                'correct':  f'color: rgb(255,  255,  255); background-color: rgba(0,    100,  0,    {opacity});',
                'wrong':    f'color: rgb(255,  255,  255); background-color: rgba(100,  0,    0,    {opacity});',
            }
        else:
            return {
                'normal':   f'color: rgb(0,    0,    0);   background-color: rgba(255,  255,  255,  {opacity});',
                'correct':  f'color: rgb(0,    0,    0);   background-color: rgba(128,  255,  128,  {opacity});',
                'wrong':    f'color: rgb(0,    0,    0);   background-color: rgba(255,  128,  128,  {opacity});',
            }
    # opacity < THREASHOLD
    diff = THREASHOLD - opacity
    if dark:
        # reduce by diff
        v = 255 - diff
        return {
            'normal':   f'color: rgb(255,  255,  255); background-color: rgba(0,    0,    0,    {opacity});',
            'correct':  f'color: rgb({v},  255,  {v}); background-color: rgba(0,    100,  0,    {opacity});',
            'wrong':    f'color: rgb(255,  {v},  {v}); background-color: rgba(100,  0,    0,    {opacity});',
        }
    else:
        # increase by 2*diff
        v = 2*diff
        if v > 255: v = 255
        return {
            'normal':   f'color: rgb(0,    0,    0);   background-color: rgba(255,  255,  255,  {opacity});',
            'correct':  f'color: rgb(0,    {v},  0);   background-color: rgba(128,  255,  128,  {opacity});',
            'wrong':    f'color: rgb({v},  0,    0);   background-color: rgba(255,  128,  128,  {opacity});',
        }

