import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Estudio de Unidades - Psicología Organizacional",
  description: "Aplicación para el estudio de unidades de psicología organizacional con funciones de búsqueda avanzada y navegación interactiva.",
  keywords: ["psicología", "organizacional", "estudio", "unidades", "teorías"],
  authors: [{ name: "Sistema de Estudio" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}