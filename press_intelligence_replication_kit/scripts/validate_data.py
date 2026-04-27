#!/usr/bin/env python3
"""Basic validator for data.js."""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path


def load_data(path: Path) -> dict:
    text = path.read_text(encoding='utf-8')
    m = re.search(r'window\.PRESS_DATA\s*=\s*(\{.*\})\s*;?\s*$', text, re.S)
    if not m:
        raise ValueError('data.js must define window.PRESS_DATA = {...};')
    # This validator expects JSON-compatible JS. Keep data.js with quoted strings and no functions.
    return json.loads(m.group(1))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('data_js')
    parser.add_argument('--check-files', action='store_true')
    args = parser.parse_args()
    data_path = Path(args.data_js)
    data = load_data(data_path)

    countries = set(data.get('countries', {}).keys())
    themes = set(data.get('themes', {}).keys())
    errors = []

    ids = set()
    for n in data.get('news', []):
        if n.get('id') in ids: errors.append(f'duplicate news id: {n.get("id")}')
        ids.add(n.get('id'))
        if n.get('country') not in countries: errors.append(f'news country not defined: {n.get("country")}')
        if n.get('theme') not in themes: errors.append(f'news theme not defined: {n.get("theme")}')
        for field in ['headline','desc','detail','source']:
            if not n.get(field): errors.append(f'news {n.get("id")} missing {field}')

    cover_ids = set()
    pages = set()
    for c in data.get('covers', []):
        if c.get('id') in cover_ids: errors.append(f'duplicate cover id: {c.get("id")}')
        cover_ids.add(c.get('id'))
        if c.get('page') in pages: errors.append(f'duplicate PDF page in covers: {c.get("page")}')
        pages.add(c.get('page'))
        if c.get('country') not in countries: errors.append(f'cover country not defined: {c.get("country")}')
        if not c.get('src'): errors.append(f'cover {c.get("id")} missing src')
        if args.check_files and c.get('src'):
            img = data_path.parent / c['src']
            if not img.exists(): errors.append(f'image not found: {c["src"]}')

    for g in data.get('summary', []):
        if g.get('country') not in countries: errors.append(f'summary country not defined: {g.get("country")}')
        for t in g.get('topics', []):
            if t.get('theme') not in themes: errors.append(f'summary theme not defined: {t.get("theme")}')

    if errors:
        print('VALIDATION FAILED')
        for e in errors: print('-', e)
        sys.exit(1)
    print('VALIDATION OK')


if __name__ == '__main__':
    main()
