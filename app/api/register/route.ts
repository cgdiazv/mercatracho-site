// app/api/register/route.ts
import { db } from "@/lib/firebaseAdmin";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 1. Verificar si el usuario ya existe
    const userDoc = await db.collection("users").doc(email).get();
    if (userDoc.exists) {
      return NextResponse.json({ error: "Este correo ya está registrado." }, { status: 400 });
    }

    // 2. Cifrar la contraseña (Seguridad máxima)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Guardar en Firebase
    await db.collection("users").doc(email).set({
      name,
      email,
      password: hashedPassword, // Guardamos la versión cifrada
      role: "reader",
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    return NextResponse.json({ message: "Usuario creado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}