// Enquiry form handler for theanabio.com.
// POST /api/enquiry -> emails hello@theanabio.com. Everything else is a static asset.

const TO = "hello@theanabio.com";
const FROM = { email: "website@theanabio.com", name: "Theana website" };
const TYPES = {
  samples: "Sample request",
  reserve: "2027 volume reservation",
  "white-label": "White label",
  deck: "Investor deck request",
  other: "General enquiry",
};
const LIMITS = { name: 120, email: 200, company: 160, country: 80, business: 80, volume: 40, message: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/enquiry") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
      }
      return handleEnquiry(request, env, url);
    }
    if (url.pathname.startsWith("/api/")) return new Response("Not found", { status: 404 });
    return env.ASSETS.fetch(request);
  },
};

export async function handleEnquiry(request, env, url) {
  const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
  const reply = (status, body) =>
    wantsJson
      ? Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
      : status < 300
        ? Response.redirect(new URL("/thanks", url).toString(), 303)
        : new Response(body.error || "Error", { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

  // Same-origin only.
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== url.host) return reply(403, { error: "forbidden" });

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(400, { error: "bad_request" });
  }

  // Honeypot: bots fill it, people don't. Pretend success.
  if ((form.get("website") || "").toString().trim()) return reply(200, { ok: true });

  const field = (k) => {
    const v = (form.get(k) || "").toString().trim().slice(0, LIMITS[k] || 200);
    return k === "message" ? v : v.replace(/\s+/g, " ");
  };
  const data = {
    type: TYPES[field("type")] ? field("type") : "other",
    name: field("name"),
    email: field("email"),
    company: field("company"),
    country: field("country"),
    business: field("business"),
    volume: field("volume"),
    products: form.getAll("products").map(String).filter((p) => /^[a-z-]{1,30}$/.test(p)).slice(0, 10),
    message: field("message"),
  };
  if (!data.name || !EMAIL_RE.test(data.email)) return reply(422, { error: "invalid" });

  const label = TYPES[data.type];
  const rows = [
    ["Type", label],
    ["Name", data.name],
    ["Email", data.email],
    ["Company", data.company],
    ["Country", data.country],
    ["Business", data.business],
    ["Volume / month", data.volume],
    ["Products", data.products.join(", ")],
  ].filter(([, v]) => v);
  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    (data.message ? `\n\nMessage:\n${data.message}` : "") +
    `\n\nSent from ${url.host}/enquire`;
  const html =
    `<table cellpadding="4">${rows.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>` +
    (data.message ? `<p><b>Message</b></p><p>${esc(data.message).replace(/\n/g, "<br>")}</p>` : "") +
    `<p style="color:#888">Sent from ${esc(url.host)}/enquire</p>`;

  try {
    await env.EMAIL.send({
      to: TO,
      from: FROM,
      replyTo: { email: data.email, name: data.name },
      subject: `${label}: ${data.company || data.name}`.replace(/[\r\n]+/g, " ").slice(0, 150),
      text,
      html,
    });
  } catch (e) {
    console.error("enquiry send failed", e && e.code, e && e.message);
    return reply(502, { error: "send_failed" });
  }
  return reply(200, { ok: true });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
