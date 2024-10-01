import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

const provinces = {
  Germania: [
    "Baden-Württemberg",
    "Baviera",
    "Berlino",
    "Brandenburgo",
    "Brema",
    "Amburgo",
    "Assia",
    "Meclenburgo-Pomerania Anteriore",
    "Bassa Sassonia",
    "Renania Settentrionale-Vestfalia",
    "Renania-Palatinato",
    "Saarland",
    "Sassonia",
    "Sassonia-Anhalt",
    "Schleswig-Holstein",
    "Turingia",
  ],
  Spagna: [
    "Álava",
    "Albacete",
    "Alicante",
    "Almería",
    "Asturie",
    "Ávila",
    "Badajoz",
    "Baleari",
    "Barcellona",
    "Burgos",
    "Cáceres",
    "Cadice",
    "Cantabria",
    "Castellón",
    "Ciudad Real",
    "Cordova",
    "Cuenca",
    "Girona",
    "Granada",
    "Guadalajara",
    "Guipúzcoa",
    "Huelva",
    "Huesca",
    "Jaén",
    "La Coruña",
    "La Rioja",
    "Las Palmas",
    "León",
    "Lleida",
    "Lugo",
    "Madrid",
    "Malaga",
    "Murcia",
    "Navarra",
    "Ourense",
    "Palencia",
    "Pontevedra",
    "Salamanca",
    "Santa Cruz de Tenerife",
    "Segovia",
    "Siviglia",
    "Soria",
    "Tarragona",
    "Teruel",
    "Toledo",
    "Valencia",
    "Valladolid",
    "Vizcaya",
    "Zamora",
    "Zaragoza",
  ],
};

const ClubRegistrationForm = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    clubName: "",
    state: "",
    province: "",
    city: "",
    zipCode: "",
    address: "",
    phoneNumber: "",
    contactEmail: "",
  });

  const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "state") {
      const selectedState = e.target.value as keyof typeof provinces; // Aggiunta type assertion
      setAvailableProvinces(provinces[selectedState] || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/clubs/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 201) {
        router.push("/thank-you"); // Redireziona a una pagina di ringraziamento
      } else {
        console.error("Errore durante l'invio del form");
      }
    } catch (error) {
      console.error("Errore nel server:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Iscrivi il tuo club
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome del mittente"
          name="senderName"
          fullWidth
          margin="normal"
          value={formData.senderName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Nome del club"
          name="clubName"
          fullWidth
          margin="normal"
          value={formData.clubName}
          onChange={handleChange}
          required
        />
        <TextField
          select
          label="Stato"
          name="state"
          fullWidth
          margin="normal"
          value={formData.state}
          onChange={handleChange}
          required
        >
          {Object.keys(provinces).map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
        {availableProvinces.length > 0 && (
          <TextField
            select
            label="Provincia"
            name="province"
            fullWidth
            margin="normal"
            value={formData.province}
            onChange={handleChange}
            required
          >
            {availableProvinces.map((province) => (
              <MenuItem key={province} value={province}>
                {province}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label="Città"
          name="city"
          fullWidth
          margin="normal"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <TextField
          label="CAP"
          name="zipCode"
          fullWidth
          margin="normal"
          value={formData.zipCode}
          onChange={handleChange}
          required
        />
        <TextField
          label="Indirizzo"
          name="address"
          fullWidth
          margin="normal"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <TextField
          label="Numero di telefono"
          name="phoneNumber"
          fullWidth
          margin="normal"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email di contatto"
          name="contactEmail"
          fullWidth
          margin="normal"
          value={formData.contactEmail}
          onChange={handleChange}
          required
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Invia Iscrizione
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ClubRegistrationForm;
