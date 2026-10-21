const sharp = require('sharp');
const fs = require('fs');
(async () => {
  await sharp('assets/icon.svg').resize(1024, 1024).png().toFile('assets/icon-only.png');
  await sharp('assets/icon-foreground.svg').resize(1024, 1024).png().toFile('assets/icon-foreground.png');
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#6A4FBF' } }).png().toFile('assets/icon-background.png');
  // splash: fundo teal com o ícone centralizado
  const logo = await sharp('assets/icon-foreground.svg').resize(1200, 1200).png().toBuffer();
  await sharp({ create: { width: 2732, height: 2732, channels: 4, background: '#6A4FBF' } }).composite([{ input: logo, gravity: 'centre' }]).png().toFile('assets/splash.png');
  await sharp({ create: { width: 2732, height: 2732, channels: 4, background: '#121117' } }).composite([{ input: logo, gravity: 'centre' }]).png().toFile('assets/splash-dark.png');
  console.log('assets ok');
})().catch((e) => { console.error(e); process.exit(1); });
