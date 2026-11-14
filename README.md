# NIS Currency Converter

A simple dashboard showing how much 10 major currencies (USD, EUR, GBP, CAD, CNY, JPY, THB, CHF, AUD, TRY) are worth in Israeli Shekels (NIS), with a converter that works in both directions. See [SPEC.md](SPEC.md) and [PRACTICE.md](PRACTICE.md).

## How it works
- A GitHub Action (`.github/workflows/update-rates.yml`) runs every 3 hours (and on demand). It calls the Apify Actor [`omao/exchange-rates`](https://apify.com/omao/exchange-rates) with base `ILS` and saves `data/rates.json`.
- The static site (`index.html`, `style.css`, `app.js`) reads `data/rates.json`. The browser never talks to Apify, so no token is exposed.
- If Apify fails, `rates.json` is left unchanged.

## Setup
1. Create an Apify API token (Apify Console → Settings → API & Integrations).
2. In the GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**, name `APIFY_TOKEN`.
3. **Settings → Actions → General → Workflow permissions**: set to *Read and write*.
4. **Settings → Pages**: deploy from branch `main`, folder `/ (root)`.
5. Run the **Update exchange rates** workflow once from the Actions tab.

`data/rates.json` initially contains **sample values only**; the first successful workflow run replaces them with real rates.

## Run locally
```bash
node scripts/serve.mjs 8080
```
Then open http://localhost:8080.
