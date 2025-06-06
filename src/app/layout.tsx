"use client";

import React from "react";
import { DM_Serif_Display, Inter } from "next/font/google"; // Correct import for Google fonts
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";

// Configure DM Serif Display font
const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

// Configure Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="fr-FR" className={`${dmSerif.variable} ${inter.variable}`}>
      <head>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>

      <body className="font-body">
        <AuthProvider>
          <main className="flex flex-col min-h-screen">
            <div className="flex-1 flex flex-col h-full justify-center items-center">
              {children}
            </div>
          </main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
};

export default Layout;
