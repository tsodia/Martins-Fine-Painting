import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import {
  Estimate,
  generateEstimate,
  showEstimateToCustomer,
} from "@/lib/estimate";

// Claude vision estimate can take 10-20s with photos; default serverless
// timeout is too tight for lead capture + estimate + email in one request.
export const maxDuration = 60;

interface LeadData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  serviceInterest: string;
  projectDescription?: string;
  howFoundUs?: string;
  sourcePage?: string;
}

interface ValidatedFile {
  filename: string;
  content: Buffer;
  contentType: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (client compresses before upload)
const MAX_FILES = 3;

function sanitize(value: FormDataEntryValue | string | null | undefined): string {
  if (!value || typeof value !== "string") return "";
  return value.trim().slice(0, 2000);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

async function validateAndExtractFiles(
  entries: FormDataEntryValue[]
): Promise<ValidatedFile[]> {
  const files: ValidatedFile[] = [];

  for (const entry of entries) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    if (files.length >= MAX_FILES) break;

    if (!ALLOWED_MIME_TYPES.includes(entry.type)) continue;
    if (entry.size > MAX_FILE_SIZE) continue;

    const arrayBuffer = await entry.arrayBuffer();
    files.push({
      filename: entry.name,
      content: Buffer.from(arrayBuffer),
      contentType: entry.type,
    });
  }

  return files;
}

async function appendToGoogleSheet(data: LeadData, estimate: Estimate | null) {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!privateKey || !clientEmail || !spreadsheetId) {
    console.warn("Google Sheets environment variables not configured — skipping sheet append.");
    return;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Denver",
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:J",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          timestamp,
          data.name,
          data.email,
          data.phone,
          data.address || "",
          data.serviceInterest,
          data.projectDescription || "",
          data.howFoundUs || "",
          data.sourcePage || "",
          estimate
            ? `AI ballpark: $${estimate.ballparkLow}-$${estimate.ballparkHigh} (${estimate.confidence}) — ${estimate.scopeSummary}`
            : "",
        ],
      ],
    },
  });
}

async function sendEmailNotification(
  data: LeadData,
  files: ValidatedFile[] = [],
  estimate: Estimate | null = null
) {
  const apiKey = process.env.EMAIL_SERVICE_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const toAddresses = process.env.EMAIL_TO_ADDRESSES || "msodia@live.com,tyler.sodia@outlook.com";

  if (!apiKey || !fromAddress) {
    console.warn("Email environment variables not configured — skipping email notification.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.sendgrid.net",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "apikey",
      pass: apiKey,
    },
  });

  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Denver",
  });

  const photoRow = files.length > 0
    ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744;">Photos:</td><td style="padding: 8px 0;">${files.length} photo(s) attached</td></tr>`
    : "";

  const estimateBlock = estimate
    ? `
      <div style="margin-top: 16px; padding: 16px; background: #ffffff; border-left: 4px solid #c9a84c;">
        <p style="margin: 0 0 8px; font-weight: bold; color: #1a2744;">AI Preliminary Ballpark (internal triage — verify before quoting)</p>
        <p style="margin: 0 0 6px; font-size: 20px; color: #1a2744;"><strong>$${estimate.ballparkLow.toLocaleString()} – $${estimate.ballparkHigh.toLocaleString()}</strong> <span style="font-size: 13px; color: #666;">(confidence: ${estimate.confidence})</span></p>
        <p style="margin: 0 0 6px; color: #333;">${estimate.scopeSummary}</p>
        <p style="margin: 0 0 6px; color: #666; font-size: 13px;">${estimate.conditionNotes}</p>
        ${estimate.questions.length > 0 ? `<p style="margin: 8px 0 0; font-size: 13px; color: #1a2744;"><strong>Ask at consult:</strong> ${estimate.questions.join(" · ")}</p>` : ""}
      </div>`
    : "";

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a2744; padding: 24px; text-align: center;">
        <h1 style="color: #c9a84c; margin: 0; font-size: 22px;">New Lead — Martin's Fine Painting</h1>
      </div>
      <div style="padding: 24px; background: #f5f0e8;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744; width: 140px;">Name:</td><td style="padding: 8px 0;">${data.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          ${data.address ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744;">Address:</td><td style="padding: 8px 0;">${data.address}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744;">Service:</td><td style="padding: 8px 0;">${data.serviceInterest}</td></tr>
          ${data.projectDescription ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744; vertical-align: top;">Project:</td><td style="padding: 8px 0;">${data.projectDescription}</td></tr>` : ""}
          ${data.howFoundUs ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744;">Found Us:</td><td style="padding: 8px 0;">${data.howFoundUs}</td></tr>` : ""}
          ${photoRow}
          <tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744;">Source Page:</td><td style="padding: 8px 0;">${data.sourcePage || "Unknown"}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #1a2744;">Submitted:</td><td style="padding: 8px 0;">${timestamp}</td></tr>
        </table>
        ${estimateBlock}
      </div>
      <div style="background: #1a2744; padding: 16px; text-align: center;">
        <p style="color: #c9a84c; margin: 0; font-size: 13px;">Martin's Fine Painting — Lead Pipeline</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Martin's Fine Painting" <${fromAddress}>`,
    to: toAddresses,
    subject: `LEAD - Martin's Fine Painting: ${data.name} — ${data.serviceInterest}`,
    html: htmlBody,
    text: `New Lead — Martin's Fine Painting\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n${data.address ? `Address: ${data.address}\n` : ""}Service: ${data.serviceInterest}\n${data.projectDescription ? `Project: ${data.projectDescription}\n` : ""}${data.howFoundUs ? `Found Us: ${data.howFoundUs}\n` : ""}${files.length > 0 ? `Photos: ${files.length} attached\n` : ""}Source: ${data.sourcePage || "Unknown"}\nSubmitted: ${timestamp}`,
    attachments: files.map((file) => ({
      filename: file.filename,
      content: file.content,
      contentType: file.contentType,
    })),
  });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let data: LeadData;
    let files: ValidatedFile[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = {
        name: sanitize(formData.get("name")),
        email: sanitize(formData.get("email")),
        phone: sanitize(formData.get("phone")),
        address: sanitize(formData.get("address")),
        serviceInterest: sanitize(formData.get("serviceInterest")),
        projectDescription: sanitize(formData.get("projectDescription")),
        howFoundUs: sanitize(formData.get("howFoundUs")),
        sourcePage: sanitize(formData.get("sourcePage")),
      };
      files = await validateAndExtractFiles(formData.getAll("photos"));
    } else {
      const body = await request.json();
      data = {
        name: sanitize(body.name),
        email: sanitize(body.email),
        phone: sanitize(body.phone),
        address: sanitize(body.address),
        serviceInterest: sanitize(body.serviceInterest),
        projectDescription: sanitize(body.projectDescription),
        howFoundUs: sanitize(body.howFoundUs),
        sourcePage: sanitize(body.sourcePage),
      };
    }

    if (!data.name || !data.email || !data.phone || !data.serviceInterest) {
      return NextResponse.json(
        { error: "Name, email, phone, and service interest are required." },
        { status: 400 }
      );
    }

    if (!validateEmail(data.email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!validatePhone(data.phone)) {
      return NextResponse.json(
        { error: "Please provide a valid phone number." },
        { status: 400 }
      );
    }

    // Generate the AI ballpark first (fails soft to null, never blocks the lead)
    const estimate = await generateEstimate(data, files);

    // Run Google Sheet append and email in parallel
    // Files are only passed to email — NOT to Google Sheets
    const results = await Promise.allSettled([
      appendToGoogleSheet(data, estimate),
      sendEmailNotification(data, files, estimate),
    ]);

    // Log any failures but still return success to the user
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const service = index === 0 ? "Google Sheets" : "Email";
        console.error(`${service} failed:`, result.reason);
      }
    });

    // Estimate is only exposed to the visitor once Martin has calibrated
    // pricing anchors and ESTIMATE_SHOW_TO_CUSTOMER=true is set.
    return NextResponse.json({
      success: true,
      estimate:
        estimate && showEstimateToCustomer()
          ? {
              low: estimate.ballparkLow,
              high: estimate.ballparkHigh,
              summary: estimate.scopeSummary,
            }
          : null,
    });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
