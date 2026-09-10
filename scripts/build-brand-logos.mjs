// Extracts official brand marks from the `simple-icons` package (vendor-published
// glyph paths) into standalone SVG files under public/assets/brands.
//
// Each mark is written with the brand's own official hex baked in, so the file is
// self-contained and renders correctly inside an <img> with no CSS recolouring.
//
// simple-icons fits every glyph into a 24x24 square, which leaves wide wordmarks
// (Samsung, Sony, Lenovo, JBL...) as a thin band with large empty margins — at a
// shared render height those marks come out far smaller than a square glyph like
// Apple's. So each path's real bounding box is measured and the viewBox tightened
// to it. That changes only the crop, never the artwork: the mark keeps its true
// aspect ratio and fills the box it is given.
//
// Brands whose real mark is multi-colour, plus the three brands simple-icons does
// not redistribute, are downloaded by fetch-commons-logos.mjs instead.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const BRANDS = [
  ['apple', 'siApple'], ['samsung', 'siSamsung'], ['sony', 'siSony'],
  ['asus', 'siAsus'], ['lenovo', 'siLenovo'], ['dell', 'siDell'],
  ['hp', 'siHp'], ['logitech', 'siLogitech'], ['jbl', 'siJbl'],
  ['bose', 'siBose'], ['nikon', 'siNikon'], ['nintendo', 'siNintendo'],
  ['playstation', 'siPlaystation'],
];

/**
 * simple-icons records one primary hex per brand, and for some brands that hex is
 * the reversed (light-on-dark) treatment: Sony's is #FFFFFF, which is invisible on
 * this store's white surfaces.
 *
 * These brands publish a dark variant of the same mark for light backgrounds, and
 * that is what gets used here. Only the fill changes — the artwork is untouched —
 * and it is applied solely where the vendor's primary colour cannot be shown.
 */
const LIGHT_BACKGROUND_FILL = {
  sony: '#000000',   // Sony's wordmark is black on light backgrounds
  nikon: '#1A1A1A',  // Nikon's yellow fails contrast on white; black is its alternate
};

/** Relative luminance of a hex colour, to catch any future near-white brand hex. */
const luminance = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

const si = await import('simple-icons');
const outDir = resolve(process.cwd(), 'public/assets/brands');
mkdirSync(outDir, { recursive: true });

const RASTER = 600; // supersample so the measured box is sub-unit accurate

/**
 * Measures a 24x24-viewBox path's ink extent by rasterising it and trimming the
 * transparent margin, then converts the result back into viewBox units.
 */
async function measure(pathData) {
  const probe = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${RASTER}" height="${RASTER}">` +
      `<path fill="#000" d="${pathData}"/></svg>`,
  );
  const { info } = await sharp(probe)
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });

  // sharp reports how much it removed from the top/left as negative offsets.
  const left = -(info.trimOffsetLeft ?? 0);
  const top = -(info.trimOffsetTop ?? 0);
  const scale = 24 / RASTER;

  return {
    x: left * scale,
    y: top * scale,
    width: info.width * scale,
    height: info.height * scale,
  };
}

const manifest = [];
for (const [id, key] of BRANDS) {
  const icon = si[key];
  if (!icon) { console.error(`MISSING: ${key}`); process.exitCode = 1; continue; }

  let box = { x: 0, y: 0, width: 24, height: 24 };
  try {
    const measured = await measure(icon.path);
    // Sanity-check the measurement before trusting it.
    if (measured.width > 0.5 && measured.height > 0.5) box = measured;
  } catch (err) {
    console.warn(`  ${id}: could not measure, using full viewBox (${err.message})`);
  }

  const override = LIGHT_BACKGROUND_FILL[id];
  const fill = override ?? `#${icon.hex}`;
  if (!override && luminance(icon.hex) > 0.8) {
    // Not fatal, but it will be hard to see on this store's white surfaces.
    console.warn(`  ${id}: brand hex #${icon.hex} is very light on white — consider an override`);
  }

  const r = (n) => Number(n.toFixed(3));
  const viewBox = `${r(box.x)} ${r(box.y)} ${r(box.width)} ${r(box.height)}`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${icon.title} logo">` +
    `<title>${icon.title}</title><path fill="${fill}" d="${icon.path}"/></svg>\n`;

  writeFileSync(resolve(outDir, `${id}.svg`), svg, 'utf8');
  manifest.push({
    id,
    title: icon.title,
    hex: fill,
    vendorHex: `#${icon.hex}`,
    source: icon.source,
    origin: 'simple-icons',
    aspectRatio: r(box.width / box.height),
  });
  console.log(`${id}.svg  viewBox="${viewBox}"  ratio ${r(box.width / box.height)}`);
}

writeFileSync(resolve(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`\nWrote ${manifest.length} brand logos from simple-icons`);
