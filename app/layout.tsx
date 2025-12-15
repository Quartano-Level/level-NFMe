import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import Sidebar from "./components/Sidebar";
import { Box } from "@mui/material";

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
          <ThemeRegistry>
            <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
              <Sidebar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  overflow: "auto",
                }}
              >
                {children}
              </Box>
            </Box>
          </ThemeRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}
