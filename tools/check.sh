#!/bin/sh
# Обязательный прогон перед коммитом: синтаксис + регрессия.
# Использование: sh tools/check.sh
set -e
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
python3 - "$TMP/game.js" <<'PY'
import re, sys
s = open('docs/demo.html', encoding='utf-8').read()
open(sys.argv[1], 'w', encoding='utf-8').write(
    max(re.findall(r'<script>(.*?)</script>', s, re.S), key=len))
PY
node --check "$TMP/game.js" && echo "синтаксис: ок"
rm -rf "$TMP"
NODE_PATH=/opt/node22/lib/node_modules node tools/tests/regression.js
