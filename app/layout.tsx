import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { QueryProvider } from "@/lib/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Savixx - Referência de Estoque",
  description: "Interface para Referência de estoque Savixx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}
