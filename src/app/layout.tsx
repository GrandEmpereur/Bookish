import React from "react";
import {
  DM_Serif_Display,
  Inter,
  Poppins,
  Roboto_Mono,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { Analytics } from "@vercel/analytics/next";

// Configure DM Serif Display font
const dmSerif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

// Configure Inter font
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Métadonnées de l'application
export const metadata = {
  title: "Bookish",
  description: "Votre compagnon de lecture",
};

// Configuration du viewport
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  minimumScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr-FR">
      <body className={`${dmSerif.variable} ${poppins.variable} antialiased`}>
        <AuthProvider>
          <main className="flex flex-col min-h-screen">
            <div className="flex-1 flex flex-col h-full justify-center items-center">
              {children}
            </div>
          </main>
          <Toaster position="bottom-right" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
