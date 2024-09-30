import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    cookie.remove("token", { path: "/" }); // Rimuovi il token
    router.push("/login"); // Reindirizza alla pagina di login
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pannello di Amministrazione
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/users")}
          >
            Utenti
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/form-submissions")}
          >
            Formulari Inviati
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/clubs")}
          >
            Clubs Attivi
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/purchases")}
          >
            Registro Acquisti
          </Button>
        </Box>
        {children}
      </Container>
    </Box>
  );
};

export default AdminLayout;
