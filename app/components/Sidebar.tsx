"use client";

import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import InventoryIcon from "@mui/icons-material/Inventory";
import LinkIcon from "@mui/icons-material/Link";
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 240;

const menuItems = [
  { text: "Referência de Estoque", href: "/", icon: InventoryIcon },
  { text: "Depara Fornecedor", href: "/depara-fornecedor", icon: LinkIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 64,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 64,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          transition: "width 0.3s ease",
          overflowX: "hidden",
          overflowY: "auto",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-end" : "center",
          p: 1,
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          minWidth: 0,
        }}
      >
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            color: "#1d1d1f",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Box sx={{ overflow: "auto", overflowX: "hidden", minWidth: 0 }}>
        <List sx={{ minWidth: 0 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = pathname === item.href;
            
            return (
              <ListItem key={item.href} disablePadding sx={{ minWidth: 0 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={isSelected}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: open ? 2.5 : 1,
                    minWidth: 0,
                    overflow: "hidden",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      borderRight: "3px solid #1976d2",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.12)",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 0,
                      justifyContent: "center",
                      color: isSelected ? "#1976d2" : "inherit",
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: "opacity 0.2s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      "& .MuiListItemText-primary": {
                        fontSize: "0.9375rem",
                        fontWeight: isSelected ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}




