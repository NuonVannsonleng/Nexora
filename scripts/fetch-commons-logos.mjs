// Downloads the official brand marks that `simple-icons` does not redistribute
// (Microsoft, Canon and Xbox asked to be removed from that set) plus Google's,
// whose real mark is multi-colour rather than the monochrome glyph simple-icons
// ships. Wikimedia Commons hosts the vendors' own SVG artwork for all four.
//
// The downloaded files are normalised, never redrawn:
//   * XML prolog / doctype / editor comments stripped so the file can be inlined
//   * a `viewBox` synthesised from width/height when the vendor file omits one,
//     without which the mark cannot scale inside a height-constrained <img>
//   * a `<title>` added for assistive tech
// The path data and fills are left exactly as published.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const LOGOS = {
  microsoft: {
    title: 'Microsoft',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
  },
  canon: {
    title: 'Canon',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Canon_logo.svg',
  },
  xbox: {
    title: 'Xbox',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Xbox_logo_%282019%29.svg',
  },
  google: {
    title: 'Google',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  },
};

const outDir = resolve(process.cwd(), 'public/assets/brands');
mkdirSync(outDir, { recursive: true });

/** Strips a CSS length down to a bare number ("713.6px" -> 713.6). */
const toNumber = (value) => {
  const n = Number.parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : null;
};

for (const [id, { title, url }] of Object.entries(LOGOS)) {
  const res = await fetch(url, { headers: { 'User-Agent': 'NexoraStoreDev/1.0 (build script)' } });
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);

  let svg = (await res.text())
    .replace(/<\?xml[^>]*\?>\s*/g, '')
    .replace(/<!DOCTYPE[^>]*>\s*/g, '')
    .replace(/<!--[\s\S]*?-->\s*/g, '')
    .trim();

  if (!svg.includes('<svg')) throw new Error(`${id}: not an SVG`);

  const openTag = svg.match(/<svg\b[^>]*>/)?.[0];
  if (!openTag) throw new Error(`${id}: malformed <svg> tag`);
  let newOpenTag = openTag;

  // Ensure a viewBox: without one the mark cannot scale to a CSS height.
  if (!/\bviewBox=/i.test(openTag)) {
    const width = toNumber(openTag.match(/\bwidth="([^"]+)"/i)?.[1]);
    const height = toNumber(openTag.match(/\bheight="([^"]+)"/i)?.[1]);
    if (!width || !height) throw new Error(`${id}: no viewBox and no usable width/height`);
    newOpenTag = newOpenTag.replace(/<svg\b/i, `<svg viewBox="0 0 ${width} ${height}"`);
    console.log(`  ${id}: synthesised viewBox="0 0 ${width} ${height}"`);
  }

  // Drop fixed width/height so CSS controls the rendered size; the viewBox keeps
  // the aspect ratio intact.
  newOpenTag = newOpenTag
    .replace(/\s(width|height)="[^"]*"/gi, '')
    .replace(/<svg\b/i, `<svg role="img" aria-label="${title} logo"`);

  svg = svg.replace(openTag, newOpenTag);

  if (!/<title>/i.test(svg)) {
    svg = svg.replace(/(<svg\b[^>]*>)/, `$1<title>${title}</title>`);
  }

  writeFileSync(resolve(outDir, `${id}.svg`), svg + '\n', 'utf8');
  console.log(`${id}.svg  ${(svg.length / 1024).toFixed(1)}kB`);
}
