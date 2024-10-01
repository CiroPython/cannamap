import { Button } from "@mui/material"; // Assicurati di avere questa importazione
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext"; // Assicurati che il percorso sia corretto
import { useRouter } from "next/router";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext); // Usa il logout dal contesto
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        logout(); // Aggiorna il contesto di autenticazione
        router.push("/login"); // Redirige alla pagina di login
      } else {
        console.error("Errore durante il logout.");
      }
    } catch (err) {
      console.error("Errore di connessione con il server: " + err);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
