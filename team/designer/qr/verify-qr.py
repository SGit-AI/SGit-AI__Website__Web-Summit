"""Independent check of the print QR codes with zxing-cpp (a different decoder from the one make-qr.mjs uses).

    python -I verify-qr.py            (needs: pip install zxing-cpp pillow, in a scratch venv, never in the repo)

For each qr-<name>.svg: rebuilds the module grid from the SVG path itself (so the vector file is what is checked),
checks the 4-module white quiet zone, renders it and decodes it; also decodes qr-<name>.png and checks it is 1200 x 1200.
Exits non-zero unless every code decodes to exactly its URL at error correction M. Apache-2.0.
"""
import pathlib, re, sys
import zxingcpp
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
EXPECT = {
    'flyer': 'https://web-summit.sgit.ai/?src=flyer',
    'banner': 'https://web-summit.sgit.ai/?src=banner',
    'sticker': 'https://web-summit.sgit.ai/?src=sticker',
    'tee': 'https://web-summit.sgit.ai/?src=tee',
}
for a in sys.argv[1:]:
    k, v = a.split('=', 1); EXPECT[k] = v

def grid_from_svg(text):
    size = int(re.search(r'viewBox="0 0 (\d+) (\d+)"', text).group(1))
    g = [[0] * size for _ in range(size)]
    d = re.search(r'<path d="([^"]+)"', text).group(1)
    for x, y, run in re.findall(r'M(\d+) (\d+)h(\d+)v1h-\d+z', d):
        for c in range(int(x), int(x) + int(run)): g[int(y)][c] = 1
    return size, g

def decode(img):
    rs = zxingcpp.read_barcodes(img, formats=zxingcpp.BarcodeFormat.QRCode)
    return rs[0] if rs else None

ok = True
for name, url in EXPECT.items():
    svg = (HERE / f'qr-{name}.svg').read_text()
    size, g = grid_from_svg(svg)
    qz = all(g[r][c] == 0 for r in range(size) for c in range(size) if r < 4 or c < 4 or r >= size - 4 or c >= size - 4)
    edge = any(g[4][c] for c in range(size)) and any(g[r][4] for r in range(size))   # the code starts right at module 4
    px = 20
    img = Image.new('L', (size * px, size * px), 255)
    for r in range(size):
        for c in range(size):
            if g[r][c]: img.paste(0, (c * px, r * px, (c + 1) * px, (r + 1) * px))
    rs = decode(img)
    png = Image.open(HERE / f'qr-{name}.png')
    rp = decode(png.convert('L'))
    ec = getattr(rs, 'ec_level', '?') if rs else None
    good = bool(rs and rp and rs.text == url and rp.text == url and qz and edge and png.size == (1200, 1200) and str(ec).upper().startswith('M'))
    ok &= good
    print(f"{name}: svg -> {rs.text if rs else None!r} (EC {ec}, {size - 8} modules, quiet zone 4: {qz and edge}); "
          f"png {png.size[0]}x{png.size[1]} -> {rp.text if rp else None!r}: {'OK' if good else 'FAIL'}")
sys.exit(0 if ok else 1)
