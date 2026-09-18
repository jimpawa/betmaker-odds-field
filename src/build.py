import re, base64

tpl = open('template.html', encoding='utf-8').read()
styles = re.findall(r'<style>(.*?)</style>', tpl, re.S)
assert len(styles) == 4

fonts = {
    "64efbbab-df3e-4fc1-9f95-dea3e4cae6e4": "assets/64efbbab-df3e-4fc1-9f95-dea3e4cae6e4.ttf",
    "8fa625c9-c21c-4860-ad56-9386d9e75865": "assets/8fa625c9-c21c-4860-ad56-9386d9e75865.ttf",
}
css0 = styles[0]
for drop in ('99eed34a-d500-4c1a-b4a4-47da139b4abb', 'b2efe0ce-c587-488f-ba4a-16baa670c24c'):
    css0 = re.sub(r'@font-face \{[^}]*?' + drop + r'[^}]*?\}\n?', '', css0, flags=re.S)
for uuid, path in fonts.items():
    css0 = css0.replace(uuid, "data:font/ttf;base64," + base64.b64encode(open(path,'rb').read()).decode())
styles[0] = css0

read = lambda p: open(p, encoding='utf-8').read()
sprite   = read('assets/sprite.svg')
data_js  = read('assets/a914fd8c-b851-4ad5-8c45-8246659c1c21.js')
comp_js  = read('build/components.js')
scrn_js  = read('build/screens.js')
react    = read('lib/react.min.js')
reactdom = read('lib/react-dom.min.js')
override = read('override.css')

def iife(js):
    return '(function () {\n' + js + '\n})();'

p = ['''<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#16191B">
<title>BetMaker — Odds field</title>
''']
for s in styles:
    p.append('<style>' + s + '</style>\n')
p.append('<style>' + override + '</style>\n')
p.append('</head>\n<body class="pg">\n')
p.append('<div id="sprite-host" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">' + sprite + '</div>\n')
p.append('<div id="app"></div>\n')
p.append('<script>window.__spriteReady = Promise.resolve();</script>\n')
p.append('<script>\n' + react + '\n</script>\n')
p.append('<script>\n' + reactdom + '\n</script>\n')
for js in (data_js, comp_js, scrn_js):
    p.append('<script>\n' + iife(js) + '\n</script>\n')
p.append('</body></html>\n')

out = ''.join(p)
open('build/odds-field.html','w',encoding='utf-8').write(out)
print('bytes', len(out.encode()))
