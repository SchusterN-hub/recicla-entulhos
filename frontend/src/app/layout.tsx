import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Nicolas Schuster | Teste Técnico | Recicla Entulhos — Gestão de Caçambas",
  description:
    "Sistema de gerenciamento de caçambas para descarte de resíduos de construção",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#3d3228",
              color: "#f0ede6",
              border: "1px solid #5e4f3f",
              borderRadius: "0",
              fontFamily: "Barlow, sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#facc15", secondary: "#0f0d09" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#0f0d09" },
            },
          }}
        />
      </body>
    </html>
  );
}
