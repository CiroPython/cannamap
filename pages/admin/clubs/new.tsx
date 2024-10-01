import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import GoogleMapReact from "google-map-react";
import { ToastContainer, toast } from "react-toastify"; // Importa react-toastify
import "react-toastify/dist/ReactToastify.css"; // Importa il CSS per i toast

const Marker = ({ text }: { text: string; lat: number; lng: number }) => (
  <div style={{ color: "red", fontWeight: "bold" }}>{text}</div>
);

const NewClub = () => {
  const router = useRouter();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    lat: 40.4168, // Coordinate iniziali di Madrid
    lng: -3.7038,
    description: "",
    totalMembershipCost: "",
    serviceFee: "",
    clubFee: "",
    ageMinimum: "",
    profileImage: "",
    coverImage: "",
  });

  const [mapPosition, setMapPosition] = useState({
    lat: 40.4168,
    lng: -3.7038,
  }); // Coordinate di Madrid

  // Funzione per gestire il cambiamento dei dati
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funzione per il caricamento delle immagini
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("Nessun file selezionato");
      return;
    }

    const file = e.target.files[0];
    const imageFormData = new FormData();
    imageFormData.append("file", file);

    try {
      const res = await axios.post("/api/upload", imageFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Aggiorna solo il campo corrispondente (profileImage o coverImage)
      if (type === "profile") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          profileImage: res.data.url,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          coverImage: res.data.url,
        }));
      }
    } catch {
      console.error("Errore nel caricamento dell'immagine:");
    }
  };

  // Funzione per la gestione della posizione sulla mappa
  const handleMapClick = ({ lat, lng }: { lat: number; lng: number }) => {
    setMapPosition({ lat, lng });
    setFormData({ ...formData, lat, lng });
  };

  // Funzione per l'invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const clubData = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      description: formData.description,
      membershipCost: {
        total: formData.totalMembershipCost,
        serviceFee: formData.serviceFee,
        clubFee: formData.clubFee,
      },
      geoLocation: {
        lat: formData.lat,
        lng: formData.lng,
      },
      ageMinimum: formData.ageMinimum,
      profileImage: formData.profileImage,
      coverImage: formData.coverImage,
    };

    try {
      await axios.post("/api/admin/clubs", clubData);
      toast.success("Club creato con successo!"); // Mostra un toast di successo
      setFormData({
        name: "",
        address: "",
        city: "",
        lat: 40.4168,
        lng: -3.7038,
        description: "",
        totalMembershipCost: "",
        serviceFee: "",
        clubFee: "",
        ageMinimum: "",
        profileImage: "",
        coverImage: "",
      }); // Reset del form
      router.push("/admin/clubs");
    } catch {
      toast.error("Errore durante la creazione del club!"); // Mostra un toast di errore
    }
  };

  const geocodeAddress = useCallback(async (address: string, city: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address},${city}&key=${apiKey}`
      );
      const { lat, lng } = response.data.results[0].geometry.location;
      setMapPosition({ lat, lng });
      setFormData((prevFormData) => ({ ...prevFormData, lat, lng }));
    } catch (error) {
      console.error("Errore nella geocodifica dell'indirizzo:", error);
    }
  }, []);

  useEffect(() => {
    if (formData.address && formData.city) {
      if (debounceTimeout) clearTimeout(debounceTimeout); // Cancella il timeout precedente
      const timeoutId = setTimeout(() => {
        geocodeAddress(formData.address, formData.city);
      }, 500); // Ritardo di 1000ms
      setDebounceTimeout(timeoutId); // Salva il timeout
    }
  }, [debounceTimeout, geocodeAddress, formData.address, formData.city]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" align="center">
          Crea Nuovo Club
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome del Club"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
          <TextField
            label="Indirizzo"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address || ""}
            onChange={handleChange}
            required
          />
          <TextField
            label="Città"
            name="city"
            fullWidth
            margin="normal"
            value={formData.city || ""}
            onChange={handleChange}
            required
          />
          <TextField
            label="Descrizione"
            name="description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={formData.description || ""}
            onChange={handleChange}
            required
          />
          <TextField
            label="Costo totale membership"
            name="totalMembershipCost"
            fullWidth
            type="number"
            margin="normal"
            value={formData.totalMembershipCost || ""}
            onChange={handleChange}
            required
          />
          <TextField
            label="Quota servizio"
            name="serviceFee"
            fullWidth
            type="number"
            margin="normal"
            value={formData.serviceFee || ""}
            onChange={handleChange}
            required
          />
          <TextField
            label="Quota al club"
            name="clubFee"
            fullWidth
            type="number"
            margin="normal"
            value={formData.clubFee || ""}
            onChange={handleChange}
            required
          />
          <TextField
            label="Età minima"
            name="ageMinimum"
            fullWidth
            type="number"
            margin="normal"
            value={formData.ageMinimum || ""}
            onChange={handleChange}
            required
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Carica Immagine del Profilo
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "profile")}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Carica Immagine di Copertina
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "cover")}
          />

          <Typography variant="h6" sx={{ mt: 4 }}>
            Seleziona la posizione sulla mappa:
          </Typography>
          <div style={{ height: "400px", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
              }}
              center={mapPosition}
              zoom={11}
              onClick={handleMapClick}
            >
              <Marker
                lat={mapPosition.lat}
                lng={mapPosition.lng}
                text="Posizione selezionata"
              />
            </GoogleMapReact>
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4 }}
          >
            Crea Club
          </Button>
        </form>
        <ToastContainer /> {/* Aggiunge il contenitore dei toast */}
      </Box>
    </Container>
  );
};

export default NewClub;
