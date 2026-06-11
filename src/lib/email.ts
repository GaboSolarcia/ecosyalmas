import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Ecos y Almas <noreply@ecosyalmas.com>";
const ADMIN = process.env.ADMIN_EMAIL_NOTIFY ?? "";

export async function enviarConfirmacionCliente(
  nombre: string,
  email: string,
  fecha: string,
  hora: string
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirmación de tu sesión de Constelaciones Familiares",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1c1917">
        <div style="background:#064e3b;padding:32px 40px;border-radius:12px 12px 0 0">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700">Ecos y Almas</h1>
          <p style="color:#a7f3d0;margin:4px 0 0;font-size:14px">Constelaciones Familiares</p>
        </div>
        <div style="background:#f9fafb;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
          <h2 style="margin:0 0 16px;font-size:20px">¡Hola, ${nombre}!</h2>
          <p style="margin:0 0 24px;color:#44403c;line-height:1.6">
            Tu sesión ha sido confirmada. Aquí están los detalles:
          </p>
          <div style="background:#ffffff;border:1px solid #d1fae5;border-radius:8px;padding:20px 24px;margin-bottom:24px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:14px;width:120px">Fecha</td>
                <td style="padding:6px 0;font-weight:600;font-size:14px;text-transform:capitalize">${fecha}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:14px">Horario</td>
                <td style="padding:6px 0;font-weight:600;font-size:14px">${hora}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:14px">Duración</td>
                <td style="padding:6px 0;font-weight:600;font-size:14px">2 horas</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:14px">Modalidad</td>
                <td style="padding:6px 0;font-weight:600;font-size:14px">Online (enlace por confirmar)</td>
              </tr>
            </table>
          </div>
          <p style="margin:0 0 16px;color:#44403c;line-height:1.6">
            Me pondré en contacto contigo pronto para coordinar los detalles finales de la sesión.
          </p>
          <p style="margin:0;color:#44403c;line-height:1.6">
            Con amor y gratitud,<br/>
            <strong>Tu consteladora</strong>
          </p>
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px">
          Ecos y Almas · Constelaciones Familiares
        </p>
      </div>
    `,
  });
}

export async function notificarAdmin(
  nombre: string,
  email: string,
  fecha: string,
  hora: string
) {
  if (!ADMIN) return;
  await resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: `Nueva reserva: ${nombre}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1c1917">
        <div style="background:#064e3b;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#ffffff;margin:0;font-size:20px">Nueva reserva recibida</h1>
        </div>
        <div style="background:#f9fafb;padding:24px 32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px;width:100px">Cliente</td>
              <td style="padding:8px 0;font-weight:600;font-size:14px">${nombre}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px">Email</td>
              <td style="padding:8px 0;font-size:14px">${email}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px">Fecha</td>
              <td style="padding:8px 0;font-size:14px;text-transform:capitalize">${fecha}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px">Horario</td>
              <td style="padding:8px 0;font-size:14px">${hora}</td>
            </tr>
          </table>
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e5e7eb">
            <a href="${process.env.NEXTAUTH_URL ?? ""}/admin/reservas"
               style="background:#064e3b;color:#ffffff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">
              Ver en el panel
            </a>
          </div>
        </div>
      </div>
    `,
  });
}
