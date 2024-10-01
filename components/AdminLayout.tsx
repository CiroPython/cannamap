import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import cookie from "js-cookie";

const AdminLayout = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    cookie.remove("token");
    router.push("/login");
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pannello di Amministrazione
          </Typography>
          <Link href="/admin/users" passHref>
            <Button color="inherit">Utenti</Button>
          </Link>
          <Link href="/admin/forms" passHref>
            <Button color="inherit">Formulari</Button>
          </Link>
          <Link href="/admin/clubs" passHref>
            <Button color="inherit">Gestione Club</Button>
          </Link>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box p={3}>{children}</Box>
    </Box>
  );
};

export default AdminLayout;
