import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import GoogleMapReact from "google-map-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Marker = ({ text }: { text: string; lat: number; lng: number }) => (
  <div style={{ color: "red", fontWeight: "bold" }}>{text}</div>
);

const EditClub = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    lat: 0,
    lng: 0,
    description: "",
    totalMembershipCost: 0,
    serviceFee: 0,
    clubFee: 0,
    ageMinimum: 18,
    profileImage: "",
    coverImage: "",
  });

  const [mapPosition, setMapPosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (id) {
      fetchClubDetails(id);
    }
  }, [id]);

  // Funzione per recuperare i dettagli del club
  const fetchClubDetails = async (clubId: string | string[]) => {
    try {
      const { data } = await axios.get(`/api/admin/clubs/${clubId}`);
      setFormData({
        name: data.name,
        address: data.address,
        city: data.city,
        lat: data.geoLocation.lat,
        lng: data.geoLocation.lng,
        description: data.description,
        totalMembershipCost: data.membershipCost.total,
        serviceFee: data.membershipCost.serviceFee,
        clubFee: data.membershipCost.clubFee,
        ageMinimum: data.ageMinimum,
        profileImage: data.profileImage,
        coverImage: data.coverImage,
      });
      setMapPosition({ lat: data.geoLocation.lat, lng: data.geoLocation.lng });
    } catch (error) {
      toast.error("Errore nel recupero dei dettagli del club.");
    }
  };

  // Funzione per gestire il cambiamento dei dati
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funzione per il caricamento delle immagini
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.error("Nessun file selezionato.");
      return;
    }
    const file = files[0];
    const imageFormData = new FormData();
    imageFormData.append("file", file);

    try {
      const res = await axios.post("/api/upload", imageFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
      toast.success("Immagine caricata con successo.");
    } catch {
      toast.error("Errore nel caricamento dell'immagine.");
    }
  };

  // Funzione per la gestione della posizione sulla mappa
  // Funzione per la gestione della posizione sulla mappa
  const handleMapClick = async ({ lat, lng }: { lat: number; lng: number }) => {
    setMapPosition({ lat, lng });
    setFormData({ ...formData, lat, lng });

    try {
      // Usa il servizio Geocoding di Google per ottenere l'indirizzo dall'API
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;
        const address = response.data.results[0].formatted_address;

        let city = "";

        // Trova la città tra i componenti dell'indirizzo
        addressComponents.forEach((component: any) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
        });

        // Aggiorna il form con indirizzo e città
        setFormData((prevFormData) => ({
          ...prevFormData,
          address: address,
          city: city,
        }));
      } else {
        console.error("Errore nel recupero dell'indirizzo dalla mappa.");
      }
    } catch (error) {
      console.error("Errore nell'uso del servizio Geocoding:", error);
    }
  };

  // Funzione per l'invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedClubData = {
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
      await axios.put(`/api/admin/clubs/${id}`, updatedClubData);
      toast.success("Club aggiornato con successo!");
      router.push(`/admin/clubs/edit/${id}`);
    } catch (error) {
      toast.error("Errore durante l'aggiornamento del club.");
    }
  };

  return (
    <Container maxWidth="md">
      <ToastContainer /> {/* Aggiungi il contenitore dei toast */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" align="center">
          Modifica Club
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

          {/* Immagine del profilo */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Immagine attuale del profilo:
          </Typography>
          <Image
            width={50}
            height={50}
            src={formData.profileImage}
            alt="Immagine del profilo attuale"
            style={{ width: "200px", height: "auto" }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Modifica immagine del profilo:
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "profile")}
          />

          {/* Immagine di copertina */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Immagine attuale di copertina:
          </Typography>
          <Image
            width={50}
            height={50}
            src={formData.coverImage}
            alt="Immagine di copertina attuale"
            style={{ width: "200px", height: "auto" }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Modifica immagine di copertina:
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
            Salva modifiche
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default EditClub;
