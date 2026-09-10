// Discovery helper: lists Commons candidates whose FILE TITLE contains the
// distinctive model token for each product, so image/product correspondence
// can be checked objectively rather than trusting search relevance.
import { readFileSync, writeFileSync } from 'node:fs';
const UA = 'NexoraStoreDev/1.0 (discovery)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Commons throttles bursts, so space requests out and retry transient failures
// rather than silently treating a rate-limited call as "no results".
const api = async (p, attempt = 0) => {
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ format: 'json', ...p });
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    await sleep(350);
    return await r.json();
  } catch (err) {
    if (attempt >= 4) { console.error(`   api failed: ${err.message}`); return {}; }
    await sleep(1200 * (attempt + 1));
    return api(p, attempt + 1);
  }
};
const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = {};
for (const [id, { tokens, searches, categories = [] }] of Object.entries(spec)) {
  const seen = new Map();
  for (const c of categories) {
    const d = await api({ action: 'query', list: 'categorymembers', cmtitle: c, cmtype: 'file', cmlimit: '60' });
    for (const m of d?.query?.categorymembers ?? []) seen.set(m.title, null);
  }
  for (const s of searches) {
    const d = await api({ action: 'query', list: 'search', srsearch: `filetype:bitmap ${s}`, srnamespace: '6', srlimit: '40' });
    for (const m of d?.query?.search ?? []) seen.set(m.title, null);
  }
  const re = tokens.map((t) => new RegExp(t, 'i'));
  const matches = [...seen.keys()].filter((t) => re.every((r) => r.test(t)));
  out[id] = matches;
  console.log(`\n## ${id}  (${matches.length}/${seen.size} title-verified)`);
  for (const m of matches.slice(0, 10)) console.log('   ' + m);
}
writeFileSync(process.argv[3], JSON.stringify(out, null, 2));
