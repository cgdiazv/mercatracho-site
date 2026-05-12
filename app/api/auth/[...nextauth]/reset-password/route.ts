// app/api/auth/reset-password/route.ts
import { db } from "@/lib/firebaseAdmin";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: "Faltan datos obligatorios." }, { status: 400 });
    }

    // 1. Buscar al usuario en Firebase
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    const user = userDoc.data();

    // 2. Validar el Token y su expiración
    if (!user?.resetToken || user.resetToken !== token) {
      return NextResponse.json({ error: "El enlace es inválido o ya fue utilizado." }, { status: 400 });
    }

    const now = new Date();
    const expires = user.resetExpires?.toDate(); // Firebase guarda fechas como Timestamps

    if (!expires || now > expires) {
      return NextResponse.json({ error: "El enlace ha expirado." }, { status: 400 });
    }

    // 3. Cifrar la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Actualizar usuario y LIMPIAR los campos del token (por seguridad)
    await userRef.update({
      password: hashedPassword,
      resetToken: null,    // IMPORTANTE: Para que el link no sirva dos veces
      resetExpires: null,
      lastPasswordChange: new Date()
    });

    return NextResponse.json({ message: "Contraseña actualizada con éxito." }, { status: 200 });

  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}