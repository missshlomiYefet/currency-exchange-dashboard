# PRACTICE – Working Rules & Definition of Done

## Language
- The dashboard language is **English** (all labels, buttons, errors, tooltips, page `lang="en"`).

## Color palette
- **Main colors:** light green and bottle green.
- **Supporting colors:** gray or turquoise.
- Suggested tokens (adjust if needed, but keep the palette):
  - Light green: `#DFF2E1`
  - Bottle green: `#0B3D2E`
  - Gray: `#6B7280` / light gray background `#F3F4F6`
  - Turquoise accent: `#14B8A6`
- Errors may use red and out-of-date notices may use yellow, because these are functional colors.
- Text must keep good contrast with its background (WCAG AA).

## Currency display
- Every currency is shown with **three things**: its **icon/symbol** (like `$`), its **3-letter code** (like `USD`), and the **real name on mouse hover** as a tooltip (like "United States Dollar").
- The tooltip must also work for keyboard focus and touch (e.g. `title` plus `aria-label`).
- This applies everywhere a currency appears: rate cards, selector and result.

## UX rules
- Simple and user friendly, for ordinary people. No finance jargon, and no data that doesn't help the user convert an amount.
- Amount input: decimals allowed, max 2 digits after the point, no text. Show a clear error message for invalid input (see SPEC section 6).
- Technical errors never reach the user as technical text (see SPEC section 8).
- Mobile-first, responsive layout. No horizontal scrolling.

## Code & repo rules
- Static site only (HTML/CSS/JS), deployable to GitHub Pages.
- Never commit secrets. `APIFY_TOKEN` lives in GitHub Secrets.
- Keep the code small and readable. No unnecessary libraries.
- Commit in small steps with clear messages.

## Checklist – verify before calling the work done
**Data**
- [ ] Rates come from `omao/exchange-rates` via the GitHub Action, and `data/rates.json` is created correctly.
- [ ] No Apify token appears anywhere in the repo or page source.
- [ ] A failed Apify run does not overwrite the last good `rates.json`.

**Functionality**
- [ ] All 10 currencies appear in the rate cards and selector.
- [ ] NIS → foreign conversion is correct (checked against a manual calculation).
- [ ] Foreign → NIS conversion is correct.
- [ ] The swap button flips the direction and keeps the amount.
- [ ] Clicking a rate card selects that currency in the converter.
- [ ] "Last updated" shows the correct date and time.

**Input validation**
- [ ] `19.99`, `100` and `0.5` work.
- [ ] Letters (`abc`, `12a`) show the error message and no result.
- [ ] 3+ decimal places (`1.234`) show the error.
- [ ] Negative numbers show the error.
- [ ] An empty field shows a hint, not an error.

**Error states**
- [ ] Missing or broken `rates.json` shows the friendly message and the **Try again** button, with no technical text.
- [ ] Data older than 24 hours shows the out-of-date notice.

**Design**
- [ ] The page is in English only.
- [ ] The palette is light green and bottle green with gray or turquoise.
- [ ] Every currency shows icon + code, and the full name on hover (and on keyboard focus).
- [ ] The screen is simple, with no unnecessary data.
- [ ] Looks good on mobile (~375px), tablet and desktop, with no horizontal scroll.
- [ ] Text contrast is readable.

**Release**
- [ ] No errors in the browser console in normal use.
- [ ] README explains the project, the GitHub Action and how to set `APIFY_TOKEN`.
- [ ] Changes are committed and pushed, GitHub Pages is enabled, and the live URL works.
