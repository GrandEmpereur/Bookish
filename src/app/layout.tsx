"use client";

import React from "react";
import { Neuton, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";

/*––––  Google Fonts  ––––*/
const headingFont = Neuton({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const bodyFont = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

/*––––  Root Layout  ––––*/
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      /* next/font variables + scroll smoothing */
      className={`${headingFont.variable} ${bodyFont.variable} scroll-smooth bg-primary`}
    >
      <head>
        {/* ****  Viewport & PWA meta  **** */}
        <meta
          name="viewport"
          /* “device-width” active | dynamic viewport for safe areas */
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Empêche iOS de zoomer sur les <input type="tel"> etc. */}
        <meta name="format-detection" content="telephone=no" />
      </head>

      {/* ****  Body  ****
          • 100 svh/dvh = hauteur réellement visible (sans la barre d’adresse)
          • Safe-area insets pour l’encoche / Dynamic Island
          • antialiased + sélection color      */}
      <body
        className="font-body antialiased"
        style={{
          minHeight: "100dvh", /* fallback Android / Safari < 16.4 */
          WebkitTapHighlightColor: "transparent", /* supprime le flash bleu */
        }}
      >
        <AuthProvider>
          {/* Flex column → sticky footer possible, évite le “reflow” clavier */}
          <div id="app" className="flex min-h-full flex-col">
            {children}
          </div>
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
