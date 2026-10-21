const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const R = 'android/app/src/main/res';
const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const circle = (s) => Buffer.from(`<svg width="${s}" height="${s}"><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}" fill="#fff"/></svg>`);
(async () => {
  for (const [d, m] of Object.entries(dens)) {
    const s = Math.round(48 * m), f = Math.round(108 * m);
    const icon = await sharp('assets/icon.svg').resize(s, s).png().toBuffer();
    fs.writeFileSync(`${R}/mipmap-${d}/ic_launcher.png`, icon);
    fs.writeFileSync(`${R}/mipmap-${d}/ic_launcher_round.png`, await sharp(icon).composite([{ input: circle(s), blend: 'dest-in' }]).png().toBuffer());
    fs.writeFileSync(`${R}/mipmap-${d}/ic_launcher_foreground.png`, await sharp('assets/icon-foreground.svg').resize(f, f).png().toBuffer());
    // splash port/land
    const pw = Math.round(480 * m), ph = Math.round(800 * m);
    for (const [o, w, hh] of [['port', pw, ph], ['land', ph, pw]]) {
      const logo = await sharp('assets/icon-foreground.svg').resize(Math.round(Math.min(w, hh) * 0.55)).png().toBuffer();
      await sharp({ create: { width: w, height: hh, channels: 4, background: '#6A4FBF' } }).composite([{ input: logo, gravity: 'centre' }]).png().toFile(`${R}/drawable-${o}-${d}/splash.png`);
    }
  }
  const logo = await sharp('assets/icon-foreground.svg').resize(260).png().toBuffer();
  await sharp({ create: { width: 480, height: 800, channels: 4, background: '#6A4FBF' } }).composite([{ input: logo, gravity: 'centre' }]).png().toFile(`${R}/drawable/splash.png`);
  fs.writeFileSync(`${R}/values/ic_launcher_background.xml`, '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#6A4FBF</color>\n</resources>\n');
  console.log('android res ok');
})().catch((e) => { console.error(e); process.exit(1); });
