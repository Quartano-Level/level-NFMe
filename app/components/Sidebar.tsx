"use client";

import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const DRAWER_WIDTH_EXPANDED = 240;
const DRAWER_WIDTH_COLLAPSED = 64;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    icon: <HomeIcon />,
    path: "/",
  },
  {
    label: "Depara Fornecedor",
    icon: <BusinessIcon />,
    path: "/depara-fornecedor",
  },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = expanded ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED;

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleItemClick = (path: string) => {
    router.push(path);
    if (isMobile) {
      setExpanded(false);
    }
  };

  return (
    <Box sx={{ position: "relative", display: "flex", height: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
            overflowX: "hidden",
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
            position: "relative",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: expanded ? "flex-start" : "center",
              p: 1.5,
              minHeight: 64,
            }}
          >
            {expanded && (
              <Box
                sx={{
                  ml: 1,
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: theme.palette.text.primary,
                }}
              >
                Menu
              </Box>
            )}
          </Box>

          <Divider />

          {/* Lista de navegação */}
          <List sx={{ flexGrow: 1, pt: 1 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <ListItem key={item.path} disablePadding sx={{ px: 1, mb: 0.5 }}>
                  {expanded ? (
                    <ListItemButton
                      onClick={() => handleItemClick(item.path)}
                      selected={isActive}
                      sx={{
                        borderRadius: 2,
                        py: 1.25,
                        "&.Mui-selected": {
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                          "& .MuiListItemIcon-root": {
                            color: theme.palette.primary.contrastText,
                          },
                        },
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: isActive
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.secondary,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontWeight: isActive ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  ) : (
                    <Tooltip title={item.label} placement="right" arrow>
                      <ListItemButton
                        onClick={() => handleItemClick(item.path)}
                        selected={isActive}
                        sx={{
                          borderRadius: 2,
                          justifyContent: "center",
                          py: 1.25,
                          "&.Mui-selected": {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            },
                            "& .MuiListItemIcon-root": {
                              color: theme.palette.primary.contrastText,
                            },
                          },
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            justifyContent: "center",
                            color: isActive
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.secondary,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                      </ListItemButton>
                    </Tooltip>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Botão de toggle posicionado na borda */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: expanded ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
          transform: "translate(-50%, -50%)",
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create("left", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Tooltip title={expanded ? "Recolher" : "Expandir"} placement="right">
          <IconButton
            onClick={handleToggle}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              width: 32,
              height: 32,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
            }}
          >
            {expanded ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

