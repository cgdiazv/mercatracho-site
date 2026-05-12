// app/api/auth/[...nextauth]/route.ts
import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebaseAdmin";
import bcrypt from "bcrypt";

// --- EXPANSIÓN DE TIPOS PARA TYPESCRIPT ---
declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
    } & DefaultSession["user"]
  }
}

const handler = NextAuth({
  providers: [
    // 1. PROVEEDOR DE GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    // 2. PROVEEDOR DE CREDENCIALES (Email/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor ingresa correo y contraseña.");
        }

        // Buscar el usuario en la colección "users" de Firebase
        const userDoc = await db.collection("users").doc(credentials.email).get();

        if (!userDoc.exists) {
          throw new Error("No se encontró una cuenta con este correo.");
        }

        const user = userDoc.data();

        // Verificar si el usuario tiene contraseña (cuentas de Google no tienen password en DB)
        if (!user?.password) {
          throw new Error("Esta cuenta utiliza Google. Por favor inicia sesión con el botón de Google.");
        }

        // Comparar contraseña ingresada con la cifrada en Firebase
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("La contraseña es incorrecta.");
        }

        // Retornar objeto usuario para la sesión
        return {
          id: userDoc.id,
          name: user.name,
          email: user.email,
          image: user.image || null,
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Sincronización automática con Firebase solo para Google Login
      if (account?.provider === "google") {
        try {
          await db.collection("users").doc(user.email).set({
            name: user.name,
            email: user.email,
            image: user.image,
            lastLogin: new Date(),
            role: "reader", 
          }, { merge: true });
        } catch (error) {
          console.error("Error sincronizando usuario de Google en Firebase:", error);
        }
      }
      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub; // token.sub contiene el ID del usuario
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirige de vuelta al login si hay errores de autenticación
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Obligatorio cuando usas Credentials
  },
});

export { handler as GET, handler as POST };