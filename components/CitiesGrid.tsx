import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { useRouter } from "next/router";

interface City {
  city: string;
  profileImage: string;
}

const CitiesGrid: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axios.get("/api/cities");
        setCities(data);
      } catch (error) {
        console.error("Errore nel recupero delle città:", error);
      }
    };

    fetchCities();
  }, []);

  const handleCityClick = (city: string) => {
    // Naviga alla pagina dei club della città selezionata
    router.push(`/clubs/${city}`);
  };

  return (
    <Container sx={{ marginTop: "30px" }}>
      <Grid container spacing={4}>
        {cities.map((city, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "300px",
                backgroundImage: `url(${
                  city.profileImage || "/images/default.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                boxShadow: 3,
                transition: "transform 0.3s ease",
                borderRadius: "15px",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: "rgba(255,255,255,0.9)", // Effetto chiaro su hover
                },
              }}
              onClick={() => handleCityClick(city.city)}
            >
              <CardContent sx={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <Typography variant="h5" component="div">
                  {city.city}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CitiesGrid;
