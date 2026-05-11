// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // AQUÍ CONECTAREMOS CON TU BASE DE DATOS LUEGO
        // Por ahora, un usuario de prueba:
        if (credentials?.email === "admin@mercatracho.com" && credentials?.password === "admin123") {
          return { id: "1", name: "Carlos Diaz", email: "admin@mercatracho.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // Le decimos que nuestra página de login es la que creamos
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };