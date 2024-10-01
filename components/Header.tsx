import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Icona di logout

import { useRouter } from "next/router";
import cookie from "js-cookie";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato di login
  const router = useRouter();

  // Funzione per verificare se l'utente è loggato
  useEffect(() => {
    const token = cookie.get("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    cookie.remove("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        (event as React.KeyboardEvent).key === "Tab"
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const menuItems = [
    { text: "Home", href: "/" },
    { text: "Clubs", href: "/clubs" },
    { text: "Contatti", href: "/contact" },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: "#4caf50" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Icona del menu per il mobile */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Menu allineato a sinistra per desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1, gap: 2 }}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} passHref legacyBehavior>
              <Button
                color="inherit"
                sx={{ borderRadius: "0.3em", padding: "10px 15px" }}
              >
                {item.text}
              </Button>
            </Link>
          ))}
        </Box>

        {/* Login e Carrello per mobile */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "flex-end",
            flexGrow: 1,
          }}
        >
          {!isLoggedIn ? (
            <Link href="/login" passHref legacyBehavior>
              <IconButton color="inherit">
                <AccountCircleIcon />
              </IconButton>
            </Link>
          ) : (
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToAppIcon />
            </IconButton>
          )}
          <Link href="/cart" passHref legacyBehavior>
            <IconButton color="inherit">
              <ShoppingCartIcon />
            </IconButton>
          </Link>
        </Box>

        {/* Login e Carrello per desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {!isLoggedIn ? (
            <Link href="/login" passHref legacyBehavior>
              <IconButton color="inherit">
                <AccountCircleIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Link>
          ) : (
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToAppIcon sx={{ color: "#fff" }} />
            </IconButton>
          )}
          <Link href="/cart" passHref legacyBehavior>
            <IconButton color="inherit">
              <ShoppingCartIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Link>
        </Box>
      </Toolbar>

      {/* Drawer per il menu mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href} passHref legacyBehavior>
                <ListItem component={"a"}>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
