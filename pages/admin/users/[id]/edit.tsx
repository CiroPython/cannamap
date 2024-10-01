import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const roles = ["Admin", "User", "Banned"];

const EditUser = () => {
  const router = useRouter();
  const { id } = router.query; // Otteniamo l'id utente dalla URL
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    // Funzione per ottenere i dettagli utente
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (res.ok) {
          const data: User = await res.json();
          setUser(data);
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
          });
        } else {
          console.error("Errore nel caricamento dei dettagli dell'utente");
        }
      } catch (error) {
        console.error("Errore nella richiesta:", error);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/users/${id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Utente aggiornato con successo");
        router.push("/admin/users"); // Torna alla lista utenti
      } else {
        alert("Errore nell'aggiornamento dell'utente");
      }
    } catch (error) {
      console.error("Errore nel server:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Modifica Utente
      </Typography>
      {user ? (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            name="firstName"
            fullWidth
            margin="normal"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            label="Cognome"
            name="lastName"
            fullWidth
            margin="normal"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
          <TextField
            select
            label="Ruolo"
            name="role"
            fullWidth
            margin="normal"
            value={formData.role}
            onChange={handleChange}
            required
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Aggiorna Utente
            </Button>
          </Box>
        </form>
      ) : (
        <Typography>Caricamento...</Typography>
      )}
    </Container>
  );
};

export default EditUser;
