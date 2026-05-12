// app/api/auth/forgot-password/route.ts
import { db } from "@/lib/firebaseAdmin";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: "Si el correo existe, se envió un enlace." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); 

    await userRef.update({
      resetToken: token,
      resetExpires: expires,
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${email}`;

    // CAMBIO AQUÍ: Usamos tu dominio validado
    const { data, error } = await resend.emails.send({
      from: "Mercatracho <soporte@indevasa.com>", // Puedes usar soporte, hola, info, etc.
      to: email,
      subject: "Restablecer tu contraseña - Mercatracho",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #222; text-align: center;">¿Olvidaste tu contraseña?</h2>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Mercatracho</strong>.</p>
          <p>Para continuar, haz clic en el botón de abajo. Este enlace será válido por 1 hora.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #222222; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px;">
              RESTABLECER CONTRASEÑA
            </a>
          </div>
          <p style="color: #666; font-size: 12px; text-align: center;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error de Resend:", error);
      return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
    }

    return NextResponse.json({ message: "Correo enviado" });

  } catch (error) {
    console.error("Error en forgot-password API:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}