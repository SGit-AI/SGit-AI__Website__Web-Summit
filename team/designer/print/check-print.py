"""Reads back the QR code in every garment print file (the 300 dpi PNGs, as printed) and checks it is that person's.

    python -I team/designer/print/check-print.py     (needs: pip install zxing-cpp pillow, in a scratch venv, never in the repo)

A swapped code is the most likely error in a set of seven: this fails unless each file's code decodes to exactly
https://web-summit.sgit.ai/meet/<id>/ for the person whose folder it is in. Apache-2.0. By designer@web-summit.dinis.
"""
import pathlib, sys
import zxingcpp
from PIL import Image

# python -I check-print.py [<set folder, default this folder>] [--generic]: --generic expects the team's /meet/ on every garment back
args = [a for a in sys.argv[1:] if not a.startswith('--')]
HERE = (pathlib.Path(args[0]).resolve() if args else pathlib.Path(__file__).resolve().parent) / 'files'
GENERIC = '--generic' in sys.argv
bad = 0
for png in sorted(HERE.glob('*/*-back.png')):
    pid = png.parent.name
    im = Image.open(png).convert('RGBA'); bg = Image.new('RGBA', im.size, (128, 128, 128, 255)); bg.alpha_composite(im)
    got = [r.text for r in zxingcpp.read_barcodes(bg.convert('L'))]
    ok = got == (['https://web-summit.sgit.ai/meet/'] if GENERIC else [f'https://web-summit.sgit.ai/meet/{pid}/'])
    bad += not ok
    print(f"{png.relative_to(HERE)}: {got} {'OK' if ok else 'WRONG'}")
sys.exit(1 if bad else 0)
