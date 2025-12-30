import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import Sidebar from "./components/Sidebar";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Level - Referência de Estoque",
  description: "Interface para Referência de estoque Level",
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
            <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", overflowX: "hidden" }}>
              <Sidebar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  overflow: "auto",
                  overflowX: "hidden",
                  minWidth: 0,
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
