#!/usr/bin/env python3
"""Extract each page of a single PDF into JPG covers.

Usage:
  python scripts/extract_covers_from_pdf.py source/portadas.pdf assets/covers/2026-04-22

Dependency:
  pip install PyMuPDF Pillow
"""
from __future__ import annotations
import argparse
from pathlib import Path
from PIL import Image
import fitz


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('pdf', help='Path to the single source PDF')
    parser.add_argument('out_dir', help='Output directory for JPG files')
    parser.add_argument('--zoom', type=float, default=2.0, help='Render zoom. 2.0 is usually enough for web')
    parser.add_argument('--quality', type=int, default=86, help='JPEG quality')
    parser.add_argument('--max-width', type=int, default=1400, help='Resize images wider than this')
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf_path)
    matrix = fitz.Matrix(args.zoom, args.zoom)

    for idx, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        tmp = out_dir / f'{idx:03d}.png'
        jpg = out_dir / f'{idx:03d}.jpg'
        pix.save(tmp)
        with Image.open(tmp) as im:
            im = im.convert('RGB')
            if im.width > args.max_width:
                ratio = args.max_width / im.width
                im = im.resize((args.max_width, int(im.height * ratio)), Image.LANCZOS)
            im.save(jpg, 'JPEG', quality=args.quality, optimize=True)
        tmp.unlink(missing_ok=True)
        print(f'[OK] {jpg}')

    print(f'Extracted {len(doc)} pages from {pdf_path}')


if __name__ == '__main__':
    main()
