"""Construit le site pour la mise en ligne.

- remplit index.html (FR) avec le HTML statique des projets et des coulisses (lisible par les robots) ;
- génère en/index.html (EN) entièrement traduit ;
- génère sitemap.xml (pages FR/EN + images) ;
- remplace SITE_URL par le vrai domaine si on le passe en argument.

Usage : python3 build.py                 (aperçu, garde SITE_URL)
        python3 build.py https://exemple.dev
Prérequis : Python 3 + beautifulsoup4, Node.js.
"""
import json, re, sys, subprocess, pathlib
from datetime import date
from xml.sax.saxutils import escape
from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).parent
site = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else None


def prerender(lang, base):
    out = subprocess.run(['node', str(ROOT / 'prerender.js'), lang, base], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def fill(soup, data):
    for sel, key in (('#projects', 'projects'), ('#ring', 'moments')):
        el = soup.select_one(sel)
        el.clear()
        el.append(BeautifulSoup(data[key], 'html.parser'))


# ---------- FR ----------
fr_html = (ROOT / 'index.html').read_text(encoding='utf-8')
fr = BeautifulSoup(fr_html, 'html.parser')
fr_data = prerender('fr', '')
fill(fr, fr_data)
(ROOT / 'index.html').write_text(str(fr), encoding='utf-8')

# ---------- EN ----------
src = (ROOT / 'js/i18n.js').read_text(encoding='utf-8')
EN = json.loads(src[src.index('{'):src.rindex('}') + 1])
en = BeautifulSoup(str(fr), 'html.parser')
missing = []
for el in en.select('[data-i18n]'):
    k = el['data-i18n']
    if k not in EN:
        missing.append(k); continue
    if el.name == 'title':
        el.string = EN[k]
    else:
        el.clear(); el.append(BeautifulSoup(EN[k], 'html.parser'))
for el in en.select('[data-i18n-attr]'):
    for pair in el['data-i18n-attr'].split(';'):
        attr, k = pair.split(':')
        if k in EN: el[attr] = EN[k]
        else: missing.append(k)
en_data = prerender('en', '../')
fill(en, en_data)
h = en.html
h['lang'] = 'en'; h['data-lang'] = 'en'; h['data-base'] = '../'
for tag, attr in (('link', 'href'), ('script', 'src'), ('img', 'src'), ('a', 'href')):
    for el in en.find_all(tag):
        v = el.get(attr)
        if v and re.match(r'^(css/|js/|assets/|site\.webmanifest)', v):
            el[attr] = '../' + v
en.find('link', rel='canonical')['href'] = 'https://SITE_URL/en/'
en.find('meta', property='og:url')['content'] = 'https://SITE_URL/en/'
en.find('meta', property='og:locale')['content'] = 'en_US'
en.find('meta', property='og:locale:alternate')['content'] = 'fr_FR'
ld = en.find('script', type='application/ld+json')
ld.string = ld.string.replace('"url": "https://SITE_URL/",\n      "name": "Motie Hida — Portfolio",\n      "dateModified"',
                              '"url": "https://SITE_URL/en/",\n      "name": "Motie Hida — Portfolio",\n      "dateModified"')
(ROOT / 'en').mkdir(exist_ok=True)
(ROOT / 'en/index.html').write_text(str(en), encoding='utf-8')

# ---------- Sitemap (pages + images) ----------
today = date.today().isoformat()
def url_block(loc, images):
    imgs = ''.join(f'\n    <image:image><image:loc>https://SITE_URL/{escape(i["loc"])}</image:loc></image:image>' for i in images)
    return f'''  <url>
    <loc>{loc}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="https://SITE_URL/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://SITE_URL/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://SITE_URL/"/>
    <lastmod>{today}</lastmod>{imgs}
  </url>'''
base_imgs = [{'loc': 'assets/motie-hida.jpg'}, {'loc': 'assets/og-image.jpg'}]
sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
{url_block("https://SITE_URL/", base_imgs + fr_data["images"])}
{url_block("https://SITE_URL/en/", base_imgs)}
</urlset>
'''
(ROOT / 'sitemap.xml').write_text(sitemap, encoding='utf-8')

print('FR + EN built; missing EN keys:', sorted(set(missing)) or 'none')

if site:
    for p in [ROOT / 'index.html', ROOT / 'en/index.html', ROOT / 'robots.txt', ROOT / 'sitemap.xml']:
        p.write_text(p.read_text(encoding='utf-8').replace('https://SITE_URL', site), encoding='utf-8')
    print('SITE_URL ->', site)
