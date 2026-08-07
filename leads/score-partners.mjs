#!/usr/bin/env node
// Stage 2: score scraped partner candidates (Haiku, cheap) and draft
// personalized first-touch emails for the top N (Sonnet, quality).
//
// Usage:  ANTHROPIC_API_KEY=xxx node leads/score-partners.mjs
// Input:  leads/output/partners-raw.json   (from scrape-partners.mjs)
// Output: leads/output/partners-scored.json
//         leads/output/partners-outreach.csv  (open in Numbers/Sheets)
//
// Nothing is sent automatically. Every draft is reviewed by a human and sent
// by hand from Martin's or Tyler's real account.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "config.json"), "utf8"));

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("Set ANTHROPIC_API_KEY");
  process.exit(1);
}

const partners = JSON.parse(
  readFileSync(join(__dirname, "output", "partners-raw.json"), "utf8")
);

async function claude(model, system, user, maxTokens = 1500) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
  const body = await res.json();
  return body.content?.[0]?.text || "";
}

function parseJson(text) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleaned);
}

// ---------- Pass 1: score in batches of 20 with Haiku ----------

const SCORING_SYSTEM = `You score referral-partner candidates for Martin's Fine Painting, a luxury one-man cabinet and built-in refinishing craftsman in Denver (35+ years, hand-rolled finishes, high-end residential).

An ideal partner regularly touches luxury residential kitchens/built-ins and does NOT do fine finishing in-house: interior designers, kitchen & bath studios, high-end residential remodelers, home stagers, custom cabinet makers without a finishing arm, luxury realtors.

Poor fits: painters (competitors), commercial-only firms, big-box franchises, handyman services, businesses far outside the Denver metro.

For each candidate return: {"name": string, "score": 0-10, "type": short category, "why": one short sentence}. Respond with ONLY a JSON array.`;

async function scoreAll() {
  const scored = [];
  for (let i = 0; i < partners.length; i += 20) {
    const batch = partners.slice(i, i + 20);
    const user = JSON.stringify(
      batch.map((p) => ({
        name: p.name,
        category: p.category,
        address: p.address,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        website: p.website,
      }))
    );
    try {
      const result = parseJson(await claude(config.scoringModel, SCORING_SYSTEM, user, 2000));
      for (const r of result) {
        const match = batch.find((p) => p.name === r.name);
        if (match) scored.push({ ...match, score: r.score, type: r.type, why: r.why });
      }
      console.log(`Scored ${Math.min(i + 20, partners.length)}/${partners.length}`);
    } catch (err) {
      console.error(`Batch ${i} failed, skipping:`, err.message);
    }
  }
  return scored.sort((a, b) => b.score - a.score);
}

// ---------- Pass 2: fetch homepage + draft outreach for top N ----------

async function fetchHomepageText(url) {
  if (!url) return "";
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 (partner research)" },
    });
    clearTimeout(t);
    if (!res.ok) return "";
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 3000);
  } catch {
    return "";
  }
}

function extractEmail(html) {
  const m = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m && !/example|sentry|wixpress|schema/.test(m[0]) ? m[0] : "";
}

const DRAFT_SYSTEM = `You write first-touch partnership emails from Martin Sodia of Martin's Fine Painting (Denver, 35+ years, luxury one-man craftsman). He hand-rolls cabinet and built-in finishes that lay down smoother than spray; gallery at martinsfinepainting.com.

The email is TO a potential referral partner (designer, remodeler, stager, cabinet maker). Goal: open a relationship, not close a sale.

Rules:
- 90-130 words. Plain, warm, craftsman voice. No marketing-speak, no exclamation points, no em dashes.
- First line references something real and specific about THEIR business from the provided website text (a project type, a phrase they use, their specialty). If the text is empty, open with their trade and neighborhood instead. Never invent details.
- The offer: when their projects need cabinet/built-in finishing, he is the finishing craftsman who will not embarrass them in front of their client.
- One ask: a 15-minute call or coffee, their choice.
- Sign off: Martin Sodia, Martin's Fine Painting, martinsfinepainting.com
- Return ONLY JSON: {"subject": string, "body": string}`;

async function draftTopN(scored) {
  const top = scored.filter((p) => p.score >= 6).slice(0, config.draftTopN);
  console.log(`Drafting outreach for top ${top.length} (score >= 6)...`);
  for (const p of top) {
    const homepage = await fetchHomepageText(p.website);
    p.contactEmail = extractEmail(homepage);
    try {
      const draft = parseJson(
        await claude(
          config.draftModel,
          DRAFT_SYSTEM,
          JSON.stringify({
            partner: { name: p.name, type: p.type, category: p.category, address: p.address },
            websiteText: homepage,
          }),
          800
        )
      );
      p.draftSubject = draft.subject;
      p.draftBody = draft.body;
      console.log(`  drafted: ${p.name}${p.contactEmail ? ` (${p.contactEmail})` : ""}`);
    } catch (err) {
      console.error(`  draft failed for ${p.name}:`, err.message);
    }
  }
  return scored;
}

// ---------- Output ----------

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const scored = await scoreAll();
const final = await draftTopN(scored);

writeFileSync(
  join(__dirname, "output", "partners-scored.json"),
  JSON.stringify(final, null, 2)
);

const header = "score,name,type,why,phone,contactEmail,website,mapsUrl,draftSubject,draftBody";
const rows = final.map((p) =>
  [p.score, p.name, p.type, p.why, p.phone, p.contactEmail || "", p.website, p.mapsUrl, p.draftSubject || "", p.draftBody || ""]
    .map(csvEscape)
    .join(",")
);
writeFileSync(join(__dirname, "output", "partners-outreach.csv"), [header, ...rows].join("\n"));

console.log(`\nDone. ${final.length} scored, drafts for score >= 6 (top ${config.draftTopN}).`);
console.log("Review leads/output/partners-outreach.csv and send approved drafts BY HAND.");
