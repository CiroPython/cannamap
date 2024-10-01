import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

interface Club {
  _id: string; // Assicurati che il club abbia un ID per creare il link verso la pagina dei dettagli
  name: string;
  description: string;
  profileImage: string;
}

const ClubsByCity = () => {
  const router = useRouter();
  const { city } = router.query;
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    if (city) {
      const fetchClubs = async () => {
        try {
          const { data } = await axios.get(`/api/clubs?city=${city}`);
          setClubs(data);
        } catch (error) {
          console.error("Errore nel recupero dei club:", error);
        }
      };

      fetchClubs();
    }
  }, [city]);

  // Funzione per gestire la navigazione ai dettagli del club
  const handleCardClick = (clubId: string) => {
    router.push(`/clubs/details/${clubId}`); // Naviga alla pagina di dettaglio del club
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center">
        Club di {city}
      </Typography>
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {clubs.map((club) => (
          <Grid item xs={12} sm={6} md={4} key={club._id}>
            <Card
              sx={{
                height: "100%",
                boxShadow: 3,
                borderRadius: "15px",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              onClick={() => handleCardClick(club._id)} // Aggiunge l'evento click per navigare
            >
              <CardMedia
                component="img"
                height="200"
                image={club.profileImage} // Immagine del profilo del club
                alt={`Immagine del club ${club.name}`}
                sx={{
                  objectFit: "cover", // Adatta l'immagine al contenitore mantenendo le proporzioni
                  objectPosition: "center", // Centra l'immagine
                  height: "200px", // Imposta un'altezza fissa
                  width: "100%", // Assicura che l'immagine si estenda per tutta la larghezza del contenitore
                }}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {club.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {club.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ClubsByCity;
