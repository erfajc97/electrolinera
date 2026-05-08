import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const FROM = import.meta.env.CONTACT_FROM ?? 'Disart Energy <onboarding@resend.dev>';
const TO = import.meta.env.CONTACT_TO ?? 'erfacrypto@gmail.com';
const WHATSAPP = import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '';

const LIMITS = {
  name: 120,
  email: 200,
  phone: 30,
  city: 120,
  interest: 120,
} as const;

const PHONE_RE = /^\+?[0-9\s()\-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Reject control bytes (0x00-0x1F, 0x7F) and collapse exotic whitespace silently.
const isControl = (c: number) => (c >= 0x00 && c <= 0x1F) || c === 0x7F;
const isExoticSpace = (c: number) =>
  c === 0x00A0 || (c >= 0x200B && c <= 0x200D) ||
  c === 0x2028 || c === 0x2029 || c === 0x202F ||
  c === 0x205F || c === 0x3000 || c === 0xFEFF;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const cleanString = (raw: unknown, max: number): string => {
  if (typeof raw !== 'string') return '';
  let out = '';
  for (const ch of raw) {
    const code = ch.codePointAt(0)!;
    if (isControl(code)) continue;
    out += isExoticSpace(code) ? ' ' : ch;
  }
  return out.replace(/\s+/g, ' ').trim().slice(0, max);
};

const renderEmail = ({
  name,
  email,
  phone,
  city,
  interest,
}: {
  name: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
}) => {
  const waDigits = WHATSAPP.replace(/\D/g, '');
  const waText = encodeURIComponent(
    `Hola ${name}, soy del equipo Disart Energy. Vi tu solicitud y quería ponerme en contacto.`
  );
  const phoneClean = phone.replace(/\s+/g, '');
  const dialLink = `tel:${phoneClean}`;
  const replyLink = `mailto:${email}?subject=${encodeURIComponent('Re: tu solicitud Disart Energy')}`;
  const waLink = waDigits ? `https://wa.me/${waDigits}?text=${waText}` : '';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Nueva solicitud — Disart Energy</title>
</head>
<body style="margin:0;padding:0;background:#f3f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;color:#0b1f14;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Nueva solicitud de franquicia &mdash; ${escape(name)} desde ${escape(city)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f6f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px -12px rgba(20,40,30,.18);">
          <!-- HEADER -->
          <tr>
            <td style="background:#0d3a23;background-image:linear-gradient(135deg,#1a7b4c 0%,#0d3a23 100%);padding:28px 32px;color:#ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="vertical-align:middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#ffffff;border-radius:10px;width:40px;height:40px;text-align:center;vertical-align:middle;font-family:'Segoe UI',Arial,sans-serif;font-weight:800;font-size:22px;color:#1a7b4c;line-height:40px;">
                          &#9889;
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <div style="font-size:18px;font-weight:700;letter-spacing:-0.01em;color:#ffffff;">
                            Disart<span style="color:#86efac;">Energy</span>
                          </div>
                          <div style="font-size:11px;color:#bbf7d0;letter-spacing:.12em;text-transform:uppercase;">
                            Electrolineras inteligentes
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle" style="vertical-align:middle;">
                    <span style="display:inline-block;background:rgba(255,255,255,.14);color:#ffffff;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:6px 12px;border-radius:9999px;">
                      Nuevo lead
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <h1 style="margin:0;font-size:24px;font-weight:700;line-height:1.2;color:#0b1f14;letter-spacing:-0.01em;">
                ${escape(name)} quiere una franquicia.
              </h1>
              <p style="margin:8px 0 0 0;font-size:14px;line-height:1.55;color:#445248;">
                Acaba de enviar una solicitud desde el sitio web. Tienes 24 horas para responder seg&uacute;n el SLA p&uacute;blico.
              </p>
            </td>
          </tr>

          <!-- DETAIL CARD -->
          <tr>
            <td style="padding:24px 32px 8px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f7f3;border:1px solid #d4e6da;border-radius:14px;">
                <tr><td style="padding:16px 20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;">
                    <tr>
                      <td style="padding:6px 0;color:#586c5c;width:35%;">Nombre</td>
                      <td style="padding:6px 0;color:#0b1f14;font-weight:600;">${escape(name)}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#586c5c;border-top:1px solid #e1ece3;">Email</td>
                      <td style="padding:6px 0;color:#0b1f14;border-top:1px solid #e1ece3;">
                        <a href="${replyLink}" style="color:#1a7b4c;text-decoration:none;font-weight:600;">${escape(email)}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#586c5c;border-top:1px solid #e1ece3;">Tel&eacute;fono</td>
                      <td style="padding:6px 0;color:#0b1f14;border-top:1px solid #e1ece3;">
                        <a href="${dialLink}" style="color:#1a7b4c;text-decoration:none;font-weight:600;">${escape(phone)}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#586c5c;border-top:1px solid #e1ece3;">Ciudad / sitio</td>
                      <td style="padding:6px 0;color:#0b1f14;font-weight:600;border-top:1px solid #e1ece3;">${escape(city)}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#586c5c;border-top:1px solid #e1ece3;">Inter&eacute;s</td>
                      <td style="padding:6px 0;border-top:1px solid #e1ece3;">
                        <span style="display:inline-block;background:#dcfce7;color:#166534;font-size:12px;font-weight:600;padding:3px 10px;border-radius:9999px;">${escape(interest)}</span>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- ACTION BUTTONS -->
          <tr>
            <td style="padding:20px 32px 8px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-right:6px;">
                    <a href="${replyLink}" style="display:inline-block;background:#0d3a23;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 18px;border-radius:9999px;">
                      Responder por correo
                    </a>
                  </td>
                  ${
                    waLink
                      ? `<td align="center" style="padding-left:6px;">
                          <a href="${waLink}" style="display:inline-block;background:#22c55e;color:#0b1f14;font-size:14px;font-weight:700;text-decoration:none;padding:12px 18px;border-radius:9999px;">
                            Abrir WhatsApp
                          </a>
                        </td>`
                      : ''
                  }
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 32px 28px 32px;border-top:1px solid #e1ece3;">
              <p style="margin:0;font-size:11px;line-height:1.5;color:#7a8c7f;">
                Enviado desde el formulario p&uacute;blico de <strong style="color:#1a7b4c;">disart-energy</strong>.
                Para cambiar el destino edita <code style="background:#f3f6f4;padding:1px 4px;border-radius:4px;">CONTACT_TO</code> en <code style="background:#f3f6f4;padding:1px 4px;border-radius:4px;">.env</code>.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0 0;font-size:11px;color:#7a8c7f;">
          &copy; ${new Date().getFullYear()} Disart Energy &middot; Energ&iacute;a limpia que tambi&eacute;n es buen negocio.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const POST: APIRoute = async ({ request }) => {
  const lengthHeader = request.headers.get('content-length');
  if (lengthHeader && Number(lengthHeader) > 16 * 1024) {
    return json(413, { ok: false, error: 'PAYLOAD_TOO_LARGE' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: 'INVALID_JSON' });
  }

  const name = cleanString(payload.name, LIMITS.name);
  const email = cleanString(payload.email, LIMITS.email).toLowerCase();
  const phone = cleanString(payload.phone, LIMITS.phone);
  const city = cleanString(payload.city, LIMITS.city);
  const interest = cleanString(payload.interest, LIMITS.interest);
  const honeypot = cleanString(payload.website, 200);

  if (honeypot) return json(200, { ok: true });

  if (!name || name.length < 2) return json(400, { ok: false, error: 'INVALID_NAME' });
  if (!EMAIL_RE.test(email)) return json(400, { ok: false, error: 'INVALID_EMAIL' });
  if (!PHONE_RE.test(phone)) return json(400, { ok: false, error: 'INVALID_PHONE' });
  if (!city || city.length < 2) return json(400, { ok: false, error: 'INVALID_CITY' });
  if (!interest || interest.length < 2) return json(400, { ok: false, error: 'INVALID_INTEREST' });

  const subject = `Nueva franquicia — ${name} (${city})`;
  const html = renderEmail({ name, email, phone, city, interest });
  const text =
    `Solicitud Disart Energy\n\n` +
    `Nombre: ${name}\n` +
    `Email: ${email}\n` +
    `Teléfono: ${phone}\n` +
    `Ciudad: ${city}\n` +
    `Interés: ${interest}\n`;

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
