# Partner Lead Pipeline (Engine A)

Finds referral partners for Martin's Fine Painting: interior designers,
kitchen & bath studios, remodelers, stagers, and cabinet makers in the Denver
metro who regularly touch luxury kitchens but don't do fine finishing
in-house. Two designers sending one job a month each keeps a one-man shop
nearly booked.

## One-time setup

1. Create a free Apify account: https://console.apify.com/sign-up
   (free tier includes $5/month platform credit; this pipeline's full scrape
   costs about $1-2 per run at the actor's ~$1.50-4 per 1,000 places rate)
2. Copy the API token from Console -> Settings -> API & Integrations.
3. Have an Anthropic API key with a few dollars of credit.

No npm installs needed. Scripts use Node 18+ built-in fetch.

## Run it (monthly, or whenever the list runs dry)

```sh
# Stage 1: scrape candidates (~5-15 min, watch progress in Apify console)
APIFY_TOKEN=xxx node leads/scrape-partners.mjs

# Stage 2: score all (Haiku) + draft outreach for the top 20 (Sonnet)
ANTHROPIC_API_KEY=xxx node leads/score-partners.mjs
```

Output lands in `leads/output/` (gitignored):
- `partners-raw.json` — deduped scrape
- `partners-scored.json` — scored + drafts
- `partners-outreach.csv` — open in Sheets; review, edit, send by hand

## Sending rules (non-negotiable)

- **Nothing sends automatically.** Every draft gets human review and goes out
  by hand from Martin's or Tyler's real email, one at a time, 5-10 per day.
- This is B2B commercial outreach, so CAN-SPAM applies: sign with the real
  business name and a physical mailing address in the signature, and if
  anyone says "not interested," they never get a second email.
- No email found for a partner? Use their website contact form with the same
  draft, or call. Designers answer their phones.
- Log every send + reply in a "Partners" tab on the existing lead sheet.

## Tuning

Edit `leads/config.json`:
- `searchTerms` / `locationQuery` — what and where to scrape
- `maxPlacesPerSearch` — 60 default (6 terms = ~360 places max per run)
- `draftTopN` — how many Sonnet drafts per run
- If the actor's input schema ever changes, check
  https://apify.com/compass/crawler-google-places/input-schema

## What good looks like

Goal: 10 active partners. Track in the sheet: contacted -> replied -> met ->
first referral. A designer who sends one $5k job a month is worth ~$60k/year;
treat the first referral from every partner like gold (flawless job, fast
communication, thank-you).
