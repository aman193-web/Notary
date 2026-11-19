#!/usr/bin/env bash
# Bundles the portal into one self-contained HTML file: dist/notary-nexxus-portal.html
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
python3 -I - <<'PY'
import re, pathlib
html = pathlib.Path('index.html').read_text()
css = pathlib.Path('src/styles.css').read_text() + '\n' + pathlib.Path('src/theme.css').read_text()
js = '\n'.join(pathlib.Path(f'src/{n}.js').read_text() for n in ['core', 'orders', 'forms', 'directory', 'app'])
html = re.sub(r'<!--STYLE-->.*?<!--/STYLE-->', lambda m: '<style>\n' + css + '\n</style>', html, flags=re.S)
html = re.sub(r'<!--SCRIPTS-->.*?<!--/SCRIPTS-->', lambda m: '<script>\n' + js + '\n</script>', html, flags=re.S)
pathlib.Path('dist/notary-nexxus-portal.html').write_text(html)
print('Built dist/notary-nexxus-portal.html', len(html) // 1024, 'KB')
PY
