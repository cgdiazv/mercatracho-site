import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import "./globals.css";
import Script from "next/script";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mercatracho | Noticias de Honduras",
  description: "Claridad y precisión en información nacional, deportes y economía.",
  // --- CAMBIO AQUÍ: AGREGANDO ICONOS ---
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
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
      <body className={`${roboto.className} min-h-full flex flex-col bg-[#f5f6f7]`}>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-CVPZ51XZ6L`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CVPZ51XZ6L');
            `,
          }}
        />
        {/* Providers envuelve a Navbar y children para que useSession funcione en todos lados */}
        <Providers>
          <Navbar />
          
          <main className="flex-grow w-full">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}