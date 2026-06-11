import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function enviarConfirmacionCliente(
  nombre: string,
  email: string,
  fecha: string,
  hora: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Confirmación de tu sesión de Constelaciones Familiares',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2>¡Gracias, ${nombre}!</h2>
        <p>Tu sesión ha sido reservada para el <strong>${fecha}</strong> a las <strong>${hora}</strong>.</p>
        <p>Me pondré en contacto contigo pronto para confirmar los detalles.</p>
        <p>Con amor,<br/>Tu consteladora</p>
      </div>
    `,
  })
}

export async function notificarAdmin(
  nombre: string,
  email: string,
  fecha: string,
  hora: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL_NOTIFY,
    subject: `Nueva reserva: ${nombre}`,
    html: `
      <div style="font-family:sans-serif">
        <h2>Nueva reserva recibida</h2>
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Fecha:</strong> ${fecha} a las ${hora}</p>
      </div>
    `,
  })
}
