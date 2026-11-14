# SPEC – NIS Currency Exchange Dashboard

## 1. Purpose
A simple web dashboard that shows how much foreign currencies are worth in Israeli Shekels (NIS / ILS), and lets users convert amounts in both directions.

**Target users:** ordinary people, not finance people. A typical case is someone buying online from a US store (prices in USD) who wants to know "how many NIS is this?".

## 2. Guiding principles
- **Simple and user friendly.** A user should understand the screen in a few seconds, with no explanation needed.
- **No unnecessary data.** No charts, tables of technical numbers, or finance jargon. Every element on screen must help the user answer "how many NIS is this?" or "how many USD/EUR/... is this?".
- Mobile-first (people often check prices on their phone while shopping), and fully usable on desktop.
- Language: English only.

## 3. Data source
- **Apify Actor:** `omao/exchange-rates`.
- Base currency: NIS (ILS). The dashboard shows the value of foreign currencies in NIS and the reverse.
- The Actor's input and output format must be verified against its README/input schema before building.

### 3.1 How the data reaches the site (GitHub Pages is static)
A token placed in page code would be public, so the browser **never calls Apify directly**.
1. A **scheduled GitHub Action** (e.g. every 3 hours, plus a manual trigger) runs the Actor using the Apify token stored as a **GitHub Secret** (`APIFY_TOKEN`).
2. The Action saves the result to a static file `data/rates.json` (rates + `updatedAt` timestamp) and commits it to the repository.
3. The dashboard reads `data/rates.json` from the same site.

If the Action fails, the previous `rates.json` stays in place, so the site keeps working with the last known rates (see section 8).

## 4. Currencies shown (10)
| Icon | Code | Name (shown on hover) |
|---|---|---|
| $ | USD | United States Dollar |
| € | EUR | Euro |
| £ | GBP | British Pound Sterling |
| C$ | CAD | Canadian Dollar |
| ¥ | CNY | Chinese Yuan (Renminbi) |
| ¥ | JPY | Japanese Yen |
| ฿ | THB | Thai Baht |
| Fr | CHF | Swiss Franc |
| A$ | AUD | Australian Dollar |
| ₺ | TRY | Turkish Lira |

Every currency is shown with its **symbol/icon, its 3-letter code, and a hover tooltip with the full name** (see PRACTICE.md). Because CNY and JPY share "¥", the code always appears next to the icon.

## 5. Screen layout (top to bottom)
1. **Header:** title ("NIS Currency Converter") and a short one-line subtitle.
2. **Converter (main focus):**
   - Amount input field.
   - Currency selector (the 10 currencies above).
   - **Direction:** NIS → foreign currency, or foreign currency → NIS.
   - **Swap button (⇄):** flips the direction with one click.
   - Result shown large and clear, e.g. `100.00 USD = 365.40 NIS`.
   - Result updates as the user types or changes the currency or direction.
3. **Rate cards:** a grid with one card per currency, showing "1 [CODE] = X.XX NIS" with icon, code and hover name. Clicking a card selects that currency in the converter.
4. **Footer:** "Last updated: <date and time>" and a short note that rates are for information only and may differ slightly from bank or card rates.

### Not included (to keep it simple)
Historical charts, trend indicators, currency pair tables, news, login, settings and ads.

## 6. Amount input rules
- Numbers only, as **decimals (not only integers)**, with **up to 2 digits after the decimal point** (e.g. `19.99`, `100`, `0.5`).
- **Text is not allowed.** If the user types letters or other non-numeric characters, show the error message: *"Please enter numbers only (for example 19.99)."*
- More than 2 decimal places: *"Please use up to 2 digits after the decimal point."*
- Negative numbers: *"Please enter a positive amount."*
- Empty field: no error, and the result shows a neutral hint ("Enter an amount to convert").
- While an error is shown, no result is calculated, and the error text is shown next to the field in red (not by a pop-up).
- Results are rounded to 2 decimal places.

## 7. Conversion logic
- NIS → foreign: `amount × (foreign per 1 NIS)`
- Foreign → NIS: `amount × (NIS per 1 foreign)`
- Use the rate from `rates.json`. The rate cards and the converter must use the same data, so they never disagree.

## 8. Error handling (technical errors from Apify or data loading)
Users must never see technical text such as stack traces, HTTP codes or JSON errors.

| Situation | What the user sees |
|---|---|
| The GitHub Action gets an error from Apify (timeout, invalid token, Actor failure, empty result) | Nothing changes on the site. The last good `rates.json` stays. The Action fails visibly in GitHub so the owner is notified. The old data is never overwritten with empty or invalid data. |
| `rates.json` is older than 24 hours | Rates still shown, plus a yellow notice: *"These rates may be out of date. Last updated: <date and time>."* |
| `rates.json` can't be loaded (missing, no internet, invalid file) | Converter and rate cards are replaced by a friendly message: *"We can't load the exchange rates right now. Please try again in a few minutes."* with a **Try again** button. |
| A single currency is missing from the data | That currency's card and its option in the selector are hidden. The rest work normally. |

Technical details are written to the browser console only, for the developer.

## 9. Deployment
- Hosted on **GitHub Pages**, as a static site (HTML/CSS/JS, no server).
- `APIFY_TOKEN` is stored only as a GitHub Secret and never committed.
- The GitHub Action needs permission to commit `data/rates.json`.

## 10. Out of scope (for now)
Other languages, user accounts, saved favorites, historical charts, bank fees, and currencies beyond the 10 listed.
