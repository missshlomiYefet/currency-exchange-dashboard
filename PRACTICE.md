# PRACTICE – Working Rules & Definition of Done

## Language
- The dashboard language is **English** (all labels, buttons, errors, tooltips, page `lang="en"`).

## Color palette
- **Main colors:** light, soft greens.
- **Supporting colors:** gray and turquoise.
- **Do not use dark green** (including bottle green) for backgrounds, headers, buttons or icons. Keep the look light and friendly.
- Text uses a soft gray-green or gray (not black, not dark green).
- Current tokens:
  - Light green: `#CFEED3`, very light green `#EFF9F0`, mid green `#8FD19E` (header gradient)
  - Text: `#2F4F4A` and gray `#5B6470`, with light gray background `#F3F4F6`
  - Turquoise accent: `#0E8F83` (buttons, currency icons)
- Errors may use red and out-of-date notices may use yellow, because these are functional colors.
- Text must keep good contrast with its background (WCAG AA).

## Currency display
- Every currency is shown with **three things**: its **icon/symbol** (like `$`), its **3-letter code** (like `USD`), and the **real name on mouse hover** as a tooltip (like "United States Dollar").
- The tooltip must also work for keyboard focus and touch (e.g. `title` plus `aria-label`).
- This applies everywhere a currency appears: rate cards, selector and result.
- Each rate tile also shows the **country flag and the country name below the currency icon/code**. Flags are local SVG files in `flags/` (emoji flags do not show on Windows).

## UX rules
- Simple and user friendly, for ordinary people. No finance jargon, and no data that doesn't help the user convert an amount.
- Amount input: decimals allowed, max 2 digits after the point, no text. Show a clear error message for invalid input (see SPEC section 6).
- Technical errors never reach the user as technical text (see SPEC section 8).
- Mobile-first, responsive layout. No horizontal scrolling.
- The page explains in plain words what it can do, and says clearly that the rates are live online data, naming the source (not a link).

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
- [ ] The palette is light greens with gray or turquoise, and **no dark green anywhere**.
- [ ] Every currency shows icon + code, and the full name on hover (and on keyboard focus).
- [ ] Every rate tile shows the country flag and country name below the currency icon/code.
- [ ] The "What can you do here?" explanation and the live-data source note are visible.
- [ ] The screen is simple, with no unnecessary data.
- [ ] Looks good on mobile (~375px), tablet and desktop, with no horizontal scroll.
- [ ] Text contrast is readable.

**Release**
- [ ] No errors in the browser console in normal use.
- [ ] README explains the project, the GitHub Action and how to set `APIFY_TOKEN`.
- [ ] Changes are committed and pushed, GitHub Pages is enabled, and the live URL works.
