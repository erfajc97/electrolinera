import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const FROM = import.meta.env.CONTACT_FROM ?? 'Disart Energy <onboarding@resend.dev>';
const TO = import.meta.env.CONTACT_TO ?? 'erfacrypto@gmail.com';

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: 'INVALID_JSON' });
  }

  const name = String(payload.name ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const city = String(payload.city ?? '').trim();
  const interest = String(payload.interest ?? '').trim();
  const honeypot = String(payload.website ?? '');

  if (honeypot) return json(200, { ok: true });

  if (!name || name.length > 120) return json(400, { ok: false, error: 'INVALID_NAME' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return json(400, { ok: false, error: 'INVALID_EMAIL' });
  }
  if (!city || city.length > 120) return json(400, { ok: false, error: 'INVALID_CITY' });
  if (!interest || interest.length > 120) return json(400, { ok: false, error: 'INVALID_INTEREST' });

  const subject = `Nueva solicitud de franquicia — ${name}`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#0b1f14;max-width:560px">
      <h2 style="margin:0 0 12px">Solicitud Disart Energy</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:6px 0;color:#586c5c"><b>Nombre</b></td><td>${escape(name)}</td></tr>
        <tr><td style="padding:6px 0;color:#586c5c"><b>Email</b></td><td>${escape(email)}</td></tr>
        <tr><td style="padding:6px 0;color:#586c5c"><b>Ciudad / sitio</b></td><td>${escape(city)}</td></tr>
        <tr><td style="padding:6px 0;color:#586c5c"><b>Interés</b></td><td>${escape(interest)}</td></tr>
      </table>
      <p style="margin-top:20px;color:#586c5c;font-size:12px">
        Enviado desde el formulario público de disart-energy.
      </p>
    </div>
  `.trim();

  const text =
    `Solicitud Disart Energy\n\n` +
    `Nombre: ${name}\nEmail: ${email}\nCiudad: ${city}\nInterés: ${interest}\n`;

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error('[resend]', error);
    return json(502, { ok: false, error: 'PROVIDER_ERROR' });
  }

  return json(200, { ok: true, id: data?.id });
};

export const GET: APIRoute = () =>
  json(405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
