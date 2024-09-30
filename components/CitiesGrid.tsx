import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

interface City {
  name: string;
  description: string;
  imageUrl: string;
}

const cities: City[] = [
  {
    name: "Barcellona",
    description: "I migliori club di cannabis a Barcellona.",
    imageUrl: "/images/barcelona.jpg",
  },
  {
    name: "Madrid",
    description: "Scopri i club di cannabis a Madrid.",
    imageUrl: "/images/madrid.jpg",
  },
  {
    name: "Valencia",
    description: "Trova i club di cannabis a Valencia.",
    imageUrl: "/images/valencia.jpg",
  },
];

const CitiesGrid: React.FC = () => {
  return (
    <Container sx={{ marginTop: "30px" }}>
      <Grid container spacing={4}>
        {cities.map((city, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "300px",
                backgroundImage: `url(${city.imageUrl})`,
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
            >
              <CardContent sx={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <Typography variant="h5" component="div">
                  {city.name}
                </Typography>
                <Typography variant="body2" color="inherit">
                  {city.description}
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
