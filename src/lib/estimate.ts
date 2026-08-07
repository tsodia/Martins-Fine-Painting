import { PRICING_ANCHORS } from "./pricing";

// Instant ballpark estimator: sends lead photos + description to Claude and
// gets back a preliminary range. Fails soft — any error returns null and the
// lead flow continues untouched. Lead capture must never depend on this.

export interface Estimate {
  scopeSummary: string;
  ballparkLow: number;
  ballparkHigh: number;
  confidence: "low" | "medium" | "high";
  conditionNotes: string;
  questions: string[];
}

interface EstimateLeadData {
  serviceInterest: string;
  projectDescription?: string;
  address?: string;
}

interface EstimateFile {
  content: Buffer;
  contentType: string;
}

const CLAUDE_SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ANTHROPIC_TIMEOUT_MS = 25_000;
const CABINET_INTEREST = /cabinet|built-in|builtin|fireplace/i;

export function isEstimableService(serviceInterest: string): boolean {
  return CABINET_INTEREST.test(serviceInterest);
}

function buildSystemPrompt(): string {
  const a = PRICING_ANCHORS;
  return `You are the estimating assistant for Martin's Fine Painting, a luxury one-man cabinet and built-in refinishing craftsman in Denver with 35+ years of experience. Every finish is hand-rolled, never sprayed.

Your job: from the customer's photos and description, produce a PRELIMINARY ballpark range for the project. This is a planning range, not a quote. Martin confirms all pricing in person.

Pricing anchors (USD):
- Per cabinet door: $${a.perDoor.low}-$${a.perDoor.high}
- Per drawer front: $${a.perDrawerFront.low}-$${a.perDrawerFront.high}
- Built-ins/bookshelves per linear foot of width: $${a.builtInPerLinearFoot.low}-$${a.builtInPerLinearFoot.high}
- Project minimum: $${a.projectMinimum.low}-$${a.projectMinimum.high}
- Typical full kitchen all-in: $${a.fullKitchen.low}-$${a.fullKitchen.high}

Rules:
- Count what you can actually see in the photos (doors, drawer fronts, linear feet). Never invent counts you cannot see or that the description does not state.
- If photos are missing or unclear, widen the range and set confidence to "low".
- The range must be honest and wide. Never output a range narrower than 25% of its low end.
- Factor visible condition: heavy grain, damage, dark-to-light color changes, and intricate profiles push toward the high end.
- Respond with ONLY a JSON object, no markdown fences, matching:
{"scopeSummary": string (one sentence, what the project appears to be),
 "ballparkLow": number,
 "ballparkHigh": number,
 "confidence": "low"|"medium"|"high",
 "conditionNotes": string (one or two sentences on what you observed),
 "questions": string[] (up to 3 things Martin should ask at the consultation)}`;
}

type ContentBlock =
  | { type: "text"; text: string }
  | {
      type: "image";
      source: { type: "base64"; media_type: string; data: string };
    };

export async function generateEstimate(
  data: EstimateLeadData,
  files: EstimateFile[]
): Promise<Estimate | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!isEstimableService(data.serviceInterest)) return null;

  const images = files.filter((f) =>
    CLAUDE_SUPPORTED_IMAGE_TYPES.includes(f.contentType)
  );

  // Nothing to reason about: no photos and no meaningful description.
  if (images.length === 0 && (data.projectDescription || "").trim().length < 15) {
    return null;
  }

  const content: ContentBlock[] = images.map((f) => ({
    type: "image",
    source: {
      type: "base64",
      media_type: f.contentType,
      data: f.content.toString("base64"),
    },
  }));

  content.push({
    type: "text",
    text: `Service interest: ${data.serviceInterest}\nProject description: ${
      data.projectDescription || "(none provided)"
    }\n\nProduce the preliminary ballpark JSON.`,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ESTIMATE_MODEL || "claude-sonnet-4-6",
        max_tokens: 1024,
        system: buildSystemPrompt(),
        messages: [{ role: "user", content }],
      }),
    });

    if (!res.ok) {
      console.error("Estimate API error:", res.status, await res.text());
      return null;
    }

    const body = await res.json();
    const text: string = body?.content?.[0]?.text || "";
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed = JSON.parse(cleaned);

    const low = Number(parsed.ballparkLow);
    const high = Number(parsed.ballparkHigh);
    if (!Number.isFinite(low) || !Number.isFinite(high) || low <= 0 || high < low) {
      return null;
    }

    return {
      scopeSummary: String(parsed.scopeSummary || "").slice(0, 300),
      ballparkLow: Math.round(low),
      ballparkHigh: Math.round(high),
      confidence: ["low", "medium", "high"].includes(parsed.confidence)
        ? parsed.confidence
        : "low",
      conditionNotes: String(parsed.conditionNotes || "").slice(0, 500),
      questions: Array.isArray(parsed.questions)
        ? parsed.questions.slice(0, 3).map((q: unknown) => String(q).slice(0, 200))
        : [],
    };
  } catch (error) {
    console.error("Estimate generation failed:", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Whether estimates may be shown to the customer (vs internal-only). */
export function showEstimateToCustomer(): boolean {
  return process.env.ESTIMATE_SHOW_TO_CUSTOMER === "true";
}
