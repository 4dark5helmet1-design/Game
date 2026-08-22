#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Собирает docs/zaboy.html — тот же самый код игры, но без страницы вокруг.

Игровой <script> не трогается ни на байт: срезается только обвязка
(шапка, подписи к клавишам, пояснительный текст, подвал) и добавляется
стиль, растягивающий кадр на всё окно. Запускается двойным щелчком.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "demo.html"
DST = ROOT / "docs" / "zaboy.html"

s = SRC.read_text(encoding="utf-8")
before = len(s)

def cut(a, b, what):
    global s
    i, j = s.find(a), s.find(b)
    if i < 0 or j < 0 or j < i:
        sys.exit("не нашёл границы: " + what)
    s = s[:i] + s[j + len(b):]

cut('<header class="top">', '</header>', 'шапка')
cut('<div class="keys">',
    '<footer class="end">Забой · WebGL 2 · без библиотек · телефон и компьютер одним кодом</footer>',
    'текст под игрой')

OVER = '''<style>
  /* Отдельный файл: страницы вокруг нет, кадр занимает всё окно. */
  html, body { height: 100%; }
  body { margin: 0; background: #05040a; overflow: hidden; }
  .wrap { max-width: none; margin: 0; padding: 0; }
  .game {
    position: fixed; inset: 0;
    width: 100%; height: 100%;
    max-width: none; max-height: none;
    margin: 0; border: 0; border-radius: 0;
    aspect-ratio: auto; box-shadow: none;
  }
</style>
'''
i = s.index('</style>') + len('</style>')
s = s[:i] + "\n" + OVER + s[i:]

s = s.replace('<title>Забой</title>', '<title>ЗАБОЙ</title>', 1)

DST.write_text(s, encoding="utf-8")
print("docs/zaboy.html: %d -> %d байт" % (before, len(s)))
