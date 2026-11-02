/**
 * Shared delivery primitives for form endpoints (server only): a signed JSON
 * webhook and transactional email through Resend. Callers decide what record
 * goes where; these helpers never log message contents.
 */
import { createHmac } from "node:crypto";

export type Fetch = typeof fetch;
const TIMEOUT_MS = 10_000;

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const envValue = (v: string | undefined) => (v && v.trim() !== "" ? v.trim() : null);

/** POST a JSON record; adds X-Green-Valor-Signature (HMAC-SHA256 of the body) when a secret is set. */
export async function postWebhook(url: string, record: unknown, secret: string | null, f: Fetch) {
  const body = JSON.stringify(record);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "GreenValorWebsite/1.0",
  };
  if (secret)
    headers["X-Green-Valor-Signature"] = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const res = await f(url, { method: "POST", headers, body, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`webhook responded ${res.status}`);
}

export type EmailMessage = {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

/** Send through the Resend API (https://resend.com). */
export async function sendResendEmail(m: EmailMessage, f: Fetch) {
  const res = await f("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${m.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: m.from,
      to: [m.to],
      reply_to: m.replyTo,
      subject: m.subject,
      text: m.text,
      html: m.html,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`email provider responded ${res.status}`);
}

/** Render label/value rows as a plain-text and escaped HTML email body. */
export function renderRows(heading: string, note: string, rows: [string, string][], submittedAt: string) {
  const text = [heading, note, `Submitted: ${submittedAt}`, "", ...rows.map(([k, v]) => `${k}: ${v}`)].join(
    "\n",
  );
  const html = `<h2>${escapeHtml(heading)}</h2><p>${escapeHtml(note)}</p><table cellpadding="6">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left" valign="top">${escapeHtml(k)}</th><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table><p>Submitted ${escapeHtml(submittedAt)}</p>`;
  return { text, html };
}

/** Run every channel; delivered when at least one succeeds. Logs channel names and errors only. */
export async function runChannels(tag: string, jobs: { name: string; run: () => Promise<void> }[]) {
  const results = await Promise.allSettled(jobs.map((j) => j.run()));
  const channels = jobs.map((j, i) => ({ name: j.name, ok: results[i]!.status === "fulfilled" }));
  for (const [i, r] of results.entries()) {
    if (r.status === "rejected")
      console.error(
        `[${tag}] ${jobs[i]!.name} delivery failed: ${String((r.reason as Error)?.message ?? r.reason)}`,
      );
  }
  return { delivered: channels.some((c) => c.ok), channels };
}
