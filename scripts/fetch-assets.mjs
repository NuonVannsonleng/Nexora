/**
 * Downloads and optimises a real photograph for every catalogue product.
 *
 * Source: Wikimedia Commons. Its files are freely licensed and each one is a photo of
 * a real shipping product -- no mock-ups, renders or invented imagery. The mapping in
 * product-images.json is curated by hand (see the note at the top of that file), so
 * this script resolves exact file titles rather than trusting search relevance.
 *
 * Each photo is written at two widths in both WebP and JPEG so the app can ship a
 * responsive <picture> and avoid layout shift:
 *
 *   <id>-640.webp  <id>-640.jpg   card / mobile
 *   <id>-1200.webp <id>-1200.jpg  detail page / hero
 *
 * Every image is flattened onto white first: several source files are transparent
 * PNGs, which would otherwise turn black once encoded as JPEG.
 *
 * Attribution for every photo is written to public/assets/products/credits.json and
 * surfaced in the site footer.
 *
 * Re-running is cheap: a product already rendered is skipped unless --force is passed.
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/assets/products');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'NexoraStoreDev/1.0 (build script)';
const FORCE = process.argv.includes('--force');
const SOURCE_WIDTH = 1600;
const WIDTHS = [640, 1200];
const BATCH = 20; // Commons allows up to 50 titles per query; stay well under.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const plain = (html) => String(html ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/** Calls the Commons API, retrying through the rate limiter. */
async function api(params, attempt = 0) {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (attempt >= 5) throw err;
    await sleep(1500 * (attempt + 1));
    return api(params, attempt + 1);
  }
}

const map = Object.fromEntries(
  Object.entries(JSON.parse(readFileSync(resolve(ROOT, 'scripts/product-images.json'), 'utf8')))
    .filter(([k]) => !k.startsWith('_')),
);
mkdirSync(OUT, { recursive: true });

// Resolve every file title to a source URL + licence metadata in batched queries.
const entries = Object.entries(map);
const resolved = new Map();
for (let i = 0; i < entries.length; i += BATCH) {
  const slice = entries.slice(i, i + BATCH);
  const data = await api({
    action: 'query',
    titles: slice.map(([, title]) => title).join('|'),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: String(SOURCE_WIDTH),
  });
  // `normalized` maps the title we asked for onto the title Commons actually stores.
  const alias = new Map((data?.query?.normalized ?? []).map((n) => [n.from, n.to]));
  const byTitle = new Map(Object.values(data?.query?.pages ?? {}).map((p) => [p.title, p]));
  for (const [id, title] of slice) resolved.set(id, byTitle.get(alias.get(title) ?? title));
  await sleep(400);
}

const credits = {};
const failures = [];

for (const [id, title] of entries) {
  const page = resolved.get(id);
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl) {
    failures.push(`${id}: Commons has no such file -- ${title}`);
    continue;
  }

  const meta = info.extmetadata ?? {};
  credits[id] = {
    file: page.title,
    descriptionUrl: info.descriptionurl,
    author: plain(meta.Artist?.value) || 'Unknown',
    license: plain(meta.LicenseShortName?.value) || 'See source page',
  };

  const done = WIDTHS.every((w) =>
    existsSync(resolve(OUT, `${id}-${w}.webp`)) && existsSync(resolve(OUT, `${id}-${w}.jpg`)));
  if (done && !FORCE) {
    console.log(`= ${id} (cached)`);
    continue;
  }

  try {
    const res = await fetch(info.thumburl, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) throw new Error('suspiciously small download');

    // `flatten` composites any alpha channel onto white so transparent PNG sources
    // (the PlayStation and Xbox shots) do not encode as black in JPEG.
    let normalised = await sharp(buf).flatten({ background: '#ffffff' }).toBuffer();

    // Studio shots arrive with wildly different amounts of empty margin, which
    // makes products look randomly scaled across a grid. Trimming the uniform
    // border and re-padding by a fixed share evens that out. Photos taken in a
    // real environment have no uniform border, so trim leaves them untouched.
    try {
      const trimmed = await sharp(normalised)
        .trim({ threshold: 12 })
        .toBuffer({ resolveWithObject: true });
      const before = await sharp(normalised).metadata();
      const shrank =
        trimmed.info.width < (before.width ?? 0) * 0.97 ||
        trimmed.info.height < (before.height ?? 0) * 0.97;
      // Ignore a trim that would leave a sliver — that means the whole frame
      // was near-uniform and the detection went wrong.
      const sane =
        trimmed.info.width > (before.width ?? 0) * 0.25 &&
        trimmed.info.height > (before.height ?? 0) * 0.25;
      if (shrank && sane) normalised = trimmed.data;
    } catch {
      // trim() throws when the image is entirely one colour; keep the original.
    }

    const sizes = [];
    for (const w of WIDTHS) {
      const base = sharp(normalised)
        .resize({ width: w, withoutEnlargement: true })
        // A small uniform white margin so the product never touches the frame edge.
        .extend({
          top: 12, bottom: 12, left: 12, right: 12,
          background: '#ffffff',
        });
      const webp = await base.clone().webp({ quality: 82 }).toBuffer();
      const jpg = await base.clone().jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      writeFileSync(resolve(OUT, `${id}-${w}.webp`), webp);
      writeFileSync(resolve(OUT, `${id}-${w}.jpg`), jpg);
      sizes.push(`${w}:${(webp.length / 1024).toFixed(0)}kB`);
    }

    // Record intrinsic dimensions of the largest render so the app can set
    // width/height attributes and reserve space before the image loads.
    const probe = await sharp(
      await sharp(normalised)
        .resize({ width: WIDTHS.at(-1), withoutEnlargement: true })
        .extend({ top: 12, bottom: 12, left: 12, right: 12, background: '#ffffff' })
        .toBuffer(),
    ).metadata();
    credits[id].width = probe.width;
    credits[id].height = probe.height;

    console.log(`+ ${id}  ${sizes.join(' ')}  ${probe.width}x${probe.height}`);
  } catch (err) {
    failures.push(`${id}: processing failed (${err.message})`);
  }
  await sleep(200);
}

writeFileSync(resolve(OUT, 'credits.json'), JSON.stringify(credits, null, 2) + '\n', 'utf8');
console.log(`\nResolved ${Object.keys(credits).length}/${entries.length} product images.`);

if (failures.length) {
  console.log('\nUnresolved:');
  for (const f of failures) console.log('  ! ' + f);
  process.exitCode = 1; // a missing product photo is a build failure, not a warning
}
