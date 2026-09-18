const fs = require('fs');
const Babel = require('./assets/b8dbf81e-4845-40ac-bbbc-bb6edbba39cc.js');
for (const [src, out] of [
  ['assets/06fde87a-1d28-4bea-bea3-c724a1c284de.js', 'build/components.js'],
  ['build/screens.src.js', 'build/screens.js'],
]) {
  const code = fs.readFileSync(src, 'utf8');
  const res = Babel.transform(code, { presets: ['react'], sourceType: 'script', compact: false });
  fs.writeFileSync(out, res.code);
  console.log(out, res.code.length);
}
