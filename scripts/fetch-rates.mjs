// Fetches NIS (ILS) exchange rates from the Apify Actor omao/exchange-rates
// and writes data/rates.json. Never overwrites the file if anything looks wrong.
import { writeFile, mkdir } from 'node:fs/promises';

const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) {
  console.error('APIFY_TOKEN is not set.');
  process.exit(1);
}

const TARGETS = ['USD', 'EUR', 'GBP', 'CAD', 'CNY', 'JPY', 'THB', 'CHF', 'AUD', 'TRY'];
const url = 'https://api.apify.com/v2/acts/omao~exchange-rates/run-sync-get-dataset-items?timeout=120';

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
  body: JSON.stringify({ baseCurrencies: ['ILS'], targetCurrencies: TARGETS, amount: 1 }),
});
if (!res.ok) {
  console.error(`Apify request failed: HTTP ${res.status}`);
  process.exit(1);
}

const items = await res.json();
if (!Array.isArray(items) || items.length === 0) {
  console.error('Apify returned no data.');
  process.exit(1);
}

// Each item: { base: "ILS", target: "USD", rate: 0.27, ... }  (rate = target units per 1 ILS)
const rates = {};
for (const it of items) {
  const rate = Number(it.rate);
  if (it.base === 'ILS' && TARGETS.includes(it.target) && rate > 0 && Number.isFinite(rate)) {
    rates[it.target] = rate;
  }
}

const missing = TARGETS.filter((c) => !(c in rates));
if (missing.length) {
  console.error(`Missing currencies in Apify result: ${missing.join(', ')}`);
  process.exit(1);
}

await mkdir('data', { recursive: true });
await writeFile(
  'data/rates.json',
  JSON.stringify({ base: 'ILS', updatedAt: new Date().toISOString(), rates }, null, 2) + '\n'
);
console.log('Saved data/rates.json');
