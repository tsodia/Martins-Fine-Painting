#!/usr/bin/env node
// Stage 1: scrape referral-partner candidates from Google Maps via Apify.
//
// Usage:  APIFY_TOKEN=xxx node leads/scrape-partners.mjs
// Output: leads/output/partners-raw.json
//
// Actor: compass/crawler-google-places (Apify's Google Maps Scraper).
// Pay-per-result (~$1.50-4 per 1,000 places) — a full run of this config
// (~360 places max) costs roughly $1-2 and fits in Apify's $5/mo free credit.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "config.json"), "utf8"));

const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) {
  console.error("Set APIFY_TOKEN (free account: https://console.apify.com/settings/integrations)");
  process.exit(1);
}

const ACTOR = "compass~crawler-google-places"; // "/" becomes "~" in API paths
const API = "https://api.apify.com/v2";

async function startRun() {
  // Input fields per the actor's input schema — if the actor changes its
  // schema, check https://apify.com/compass/crawler-google-places/input-schema
  const input = {
    searchStringsArray: config.searchTerms,
    locationQuery: config.locationQuery,
    maxCrawledPlacesPerSearch: config.maxPlacesPerSearch,
    language: "en",
    skipClosedPlaces: true,
  };

  const res = await fetch(`${API}/acts/${ACTOR}/runs?token=${TOKEN}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to start run: ${res.status} ${await res.text()}`);
  const { data } = await res.json();
  return data;
}

async function waitForRun(runId) {
  for (;;) {
    const res = await fetch(`${API}/actor-runs/${runId}?token=${TOKEN}`);
    if (!res.ok) throw new Error(`Failed to poll run: ${res.status}`);
    const { data } = await res.json();
    process.stdout.write(`\r  status: ${data.status}   `);
    if (["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"].includes(data.status)) {
      console.log();
      if (data.status !== "SUCCEEDED") throw new Error(`Run ended: ${data.status}`);
      return data;
    }
    await new Promise((r) => setTimeout(r, 10_000));
  }
}

async function fetchDataset(datasetId) {
  const res = await fetch(
    `${API}/datasets/${datasetId}/items?token=${TOKEN}&format=json&clean=true`
  );
  if (!res.ok) throw new Error(`Failed to fetch dataset: ${res.status}`);
  return res.json();
}

function normalize(items) {
  const seen = new Set();
  const out = [];
  for (const p of items) {
    const key = (p.placeId || `${p.title}|${p.address}`).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if ((p.reviewsCount ?? 0) < config.minReviews) continue;
    out.push({
      name: p.title,
      category: p.categoryName || "",
      address: p.address || "",
      phone: p.phone || "",
      website: p.website || "",
      mapsUrl: p.url || "",
      rating: p.totalScore ?? null,
      reviewsCount: p.reviewsCount ?? 0,
      searchTerm: p.searchString || "",
    });
  }
  return out;
}

const run = await startRun();
console.log(`Run started: https://console.apify.com/actors/runs/${run.id}`);
const finished = await waitForRun(run.id);
const items = await fetchDataset(finished.defaultDatasetId);
const partners = normalize(items);

mkdirSync(join(__dirname, "output"), { recursive: true });
const outPath = join(__dirname, "output", "partners-raw.json");
writeFileSync(outPath, JSON.stringify(partners, null, 2));
console.log(`${items.length} places scraped -> ${partners.length} after dedupe/min-reviews`);
console.log(`Saved: ${outPath}`);
console.log("Next: ANTHROPIC_API_KEY=xxx node leads/score-partners.mjs");
