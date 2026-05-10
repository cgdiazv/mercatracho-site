import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mercatracho | Noticias de Honduras",
  description: "Claridad y precisión en información nacional, deportes y economía.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${roboto.variable} h-full antialiased`}
    >
      {/* Usamos roboto.className para asegurar que la fuente se aplique a todo el texto */}
      <body className={`${roboto.className} min-h-full flex flex-col bg-[#f5f6f7]`}>
        <Navbar />
        
        <main className="flex-grow w-full">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}