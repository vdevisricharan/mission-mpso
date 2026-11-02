const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#104E43" />
      <stop offset="100%" stop-color="#176B5B" />
    </linearGradient>
    <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#BFE2D7" />
    </linearGradient>
  </defs>

  <!-- Rounded Squircle Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="#2B8E7B" stroke-width="8" opacity="0.35" />

  <!-- Bold Modern 'M' -->
  <path d="M 120 376 L 120 160 L 192 160 L 256 276 L 320 160 L 392 160 L 392 376 L 332 376 L 332 248 L 276 348 L 236 348 L 180 248 L 180 376 Z"
        fill="#FFFFFF" />

  <!-- AI Learning Sparkle at Top Right -->
  <path d="M 400 105 C 400 132 415 148 442 148 C 415 148 400 164 400 191 C 400 164 385 148 358 148 C 385 148 400 132 400 105 Z"
        fill="url(#sparkleGrad)" />
</svg>`;

async function generate() {
  const svgBuffer = Buffer.from(svgContent);

  // 1. Write SVG files
  fs.writeFileSync(path.join(__dirname, '../src/app/icon.svg'), svgContent);
  fs.writeFileSync(path.join(__dirname, '../public/icon.svg'), svgContent);
  console.log('Written icon.svg to src/app and public');

  // 2. Generate PNGs of various sizes
  const sizes = [16, 32, 48, 64, 180, 192, 512];
  const pngBuffers = {};

  for (const size of sizes) {
    pngBuffers[size] = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
  }

  // Save Apple Touch Icon (180x180)
  fs.writeFileSync(path.join(__dirname, '../src/app/apple-icon.png'), pngBuffers[180]);
  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), pngBuffers[180]);
  console.log('Saved apple-touch-icon (180x180)');

  // Save PWA icons (192 and 512)
  fs.writeFileSync(path.join(__dirname, '../public/icon-192.png'), pngBuffers[192]);
  fs.writeFileSync(path.join(__dirname, '../public/icon-512.png'), pngBuffers[512]);
  console.log('Saved PWA icons (192x192, 512x512)');

  // 3. Create genuine multi-image ICO file (16x16, 32x32, 48x48)
  // ICO header: 6 bytes (idReserved: 0, idType: 1, idCount: N)
  // Directory entries: 16 bytes each
  // Image data: raw PNG buffers
  const icoSizes = [16, 32, 48];
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(icoSizes.length, 4); // count

  const dirEntries = [];
  let currentOffset = 6 + (16 * icoSizes.length);

  for (const s of icoSizes) {
    const buf = pngBuffers[s];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(s === 256 ? 0 : s, 0); // width
    entry.writeUInt8(s === 256 ? 0 : s, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(currentOffset, 12); // offset
    dirEntries.push(entry);
    currentOffset += buf.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...icoSizes.map(s => pngBuffers[s])
  ]);

  fs.writeFileSync(path.join(__dirname, '../src/app/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
  console.log('Saved multi-resolution favicon.ico to src/app and public');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
