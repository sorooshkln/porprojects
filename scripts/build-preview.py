"""Build a standalone HTML preview with local fonts and images embedded."""
from pathlib import Path
import base64
import mimetypes
import re

root = Path(__file__).resolve().parents[1]

def data_uri(relative):
    path = (root / relative).resolve()
    if not path.is_relative_to(root):
        raise ValueError('Asset outside project')
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()

css = (root / 'style.css').read_text()
css = re.sub(r"url\('([^']+)'\)", lambda match: "url('" + data_uri(match[1]) + "')", css)
js = (root / 'app.js').read_text()
# Resolve the one image path selected at runtime by the product template.
js = js.replace("assets/design-top/product-${p.sale?'wave':'heart'}.webp", "${p.sale?'" + data_uri('assets/design-top/product-wave.webp') + "':'" + data_uri('assets/design-top/product-heart.webp') + "'}")
js = re.sub(r'assets/design-(?:top|part2)/[\w-]+\.webp', lambda match: data_uri(match[0]), js)
html = (root / 'index.html').read_text()
html = re.sub(r'src="(assets/[^\"]+)"', lambda match: 'src="' + data_uri(match[1]) + '"', html)
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
html = html.replace('<script src="app.js"></script>', '<script>' + js + '</script>')
(root / 'preview.html').write_text(html)
print('Updated preview.html with embedded fonts and images.')
