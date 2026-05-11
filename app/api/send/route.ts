// app/api/send/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Esto jala la llave automáticamente desde tu archivo .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, empresa, email, telefono, interes, mensaje } = body;

    const data = await resend.emails.send({
      // Usando tu dominio verificado
      from: 'Mercatracho Ads <publicidad@indevasa.com>', 
      to: ['info@mercatracho.com'],
      subject: `🚀 Nuevo Lead Publicitario: ${empresa}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
          <h2 style="color: #2175eb;">Nuevo prospecto de publicidad</h2>
          <p>Has recibido un nuevo mensaje desde el formulario de <strong>Mercatracho</strong>.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Empresa:</strong> ${empresa}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${telefono}</p>
          <p><strong>Interés:</strong> ${interes}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 10px; border: 1px solid #ebf0f6;">
            ${mensaje}
          </div>
          <footer style="margin-top: 20px; font-size: 12px; color: #999;">
            Enviado automáticamente desde el portal Mercatracho vía Indevasa.
          </footer>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error al procesar el envío' }, { status: 500 });
  }
}