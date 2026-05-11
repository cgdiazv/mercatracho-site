// app/api/auth/[...nextauth]/route.ts
import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/firebaseAdmin";

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        await db.collection("users").doc(user.email).set({
          name: user.name,
          email: user.email,
          image: user.image,
          lastLogin: new Date(),
          role: "reader", 
        }, { merge: true });

        return true;
      } catch (error) {
        console.error("Error sincronizando con Firebase:", error);
        return true; 
      }
    },

    async session({ session, token }) {
      // Ahora TypeScript reconocerá .id porque lo declaramos arriba
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };