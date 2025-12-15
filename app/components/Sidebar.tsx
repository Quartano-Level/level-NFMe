"use client";

import { Box, List, ListItem, ListItemButton, ListItemText, Drawer } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 240;

const menuItems = [
  { text: "Referência de Estoque", href: "/" },
  { text: "Depara Fornecedor", href: "/depara-fornecedor" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Box sx={{ overflow: "auto", mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                    borderRight: "3px solid #1976d2",
                  },
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
