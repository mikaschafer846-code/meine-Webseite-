import base64, re, sys, os
R = sys.argv[1]; OUT = sys.argv[2]
rd = lambda p: open(os.path.join(R, p), encoding='utf-8').read()
def data(p, mime):
    return f"data:{mime};base64," + base64.b64encode(open(os.path.join(R, p), 'rb').read()).decode()

html = rd('index.html'); css = rd('style.css'); js = rd('script.js')

# Schriften in CSS einbetten
css = re.sub(r'url\("fonts/([^"]+)"\)', lambda m: f'url("{data("fonts/"+m.group(1), "font/woff2")}")', css)
# Seiten für Impressum/Datenschutz als Overlay
css += '''
/* Impressum & Datenschutz als eingeblendete Seiten */
.legal-page { display: none; }
.legal-page:target { display: block; position: fixed; inset: 0; z-index: 100; overflow-y: auto; background: var(--black); }
.legal-page .legal-bar { position: sticky; top: 0; background: rgb(18 19 20 / .95); border-bottom: 1px solid var(--line); }
.legal-page .legal { padding-top: 48px; }
'''
# Bilder: data-src entfernen, Lightbox nimmt das src des Bildes
html = re.sub(r' data-src="bilder/[^"]+"', '', html)
js = js.replace("lbImg.src = b.dataset.src;", "lbImg.src = b.querySelector('img').src;")
html = re.sub(r'src="(bilder/[^"]+\.jpg)"', lambda m: f'src="{data(m.group(1), "image/jpeg")}"', html)

# Kopf: Preload, og:image, JSON-LD-Bild entfernen; Favicon einbetten
html = re.sub(r'  <link rel="preload"[^\n]*\n', '', html)
html = re.sub(r'  <meta property="og:image"[^\n]*\n', '', html)
html = re.sub(r'    "image": "[^"]+",\n', '', html)
html = html.replace('href="favicon.svg"', f'href="{data("favicon.svg", "image/svg+xml")}"')

# CSS und JS einbetten
html = html.replace('  <link rel="stylesheet" href="style.css">', f'  <style>\n{css}\n  </style>')
html = html.replace('  <script src="script.js"></script>', f'  <script>\n{js}\n  </script>')

# Impressum und Datenschutz als Abschnitte einfügen
def legal(fname, sid):
    m = re.search(r'<main class="container legal">(.*?)</main>', rd(fname), re.S)
    return f'''  <section class="legal-page" id="{sid}">
    <div class="legal-bar"><div class="container nav">
      <a href="#start" class="logo"><span class="logo-mark">MS</span><span class="logo-text">Montagen</span></a>
      <a href="#start" class="btn btn-line" style="padding:10px 16px">← Zurück</a>
    </div></div>
    <div class="container legal">{m.group(1)}</div>
  </section>
'''
html = html.replace('href="impressum.html"', 'href="#impressum"').replace('href="datenschutz.html"', 'href="#datenschutz"')
html = html.replace('  <script>\n', legal('impressum.html', 'impressum') + legal('datenschutz.html', 'datenschutz') + '\n  <script>\n', 1)

os.makedirs(os.path.dirname(OUT) or '.', exist_ok=True)
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', round(os.path.getsize(OUT)/1024), 'KB')
