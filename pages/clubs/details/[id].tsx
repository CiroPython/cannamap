import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Container, Typography, Box, Grid, Button } from "@mui/material";
import GoogleMapReact from "google-map-react";
import Image from "next/image";
import { parseCookies } from "nookies"; // Usa nookies per i cookie
import { AuthContext } from "@/contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import BuyInviteButton from "@/components/BuyButton";

interface Club {
  _id: string;
  name: string;
  description: string;
  membershipCost: {
    total: number;
    serviceFee: number;
    clubFee: number;
  };
  geoLocation: {
    lat: number;
    lng: number;
  };
  address: string;
  profileImage: string;
  coverImage: string;
  feedbacks: { user: string; message: string; rating: number }[];
}

const Marker = ({ text }: { text: string }) => (
  <div style={{ color: "red", fontWeight: "bold" }}>{text}</div>
);

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const ClubDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [club, setClub] = useState<Club | null>(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0); // Stato per il punteggio
  const userContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const { data } = await axios.get(`/api/clubs/${id}`);
        setClub(data);
      } catch (error) {
        console.error("Errore nel recupero dei dettagli del club:", error);
      }
    };

    fetchClubDetails();
  }, [id]);

  const handleFeedbackSubmit = async () => {
    const cookies = parseCookies();
    const token = cookies.token;

    if (!feedback || !rating || !userContext.isLoggedIn) {
      console.log("Devi essere loggato per lasciare un feedback.");
      return;
    }

    try {
      await axios.post(
        `/api/clubs/${id}/feedback`,
        { comment: feedback, rating }, // Invia sia il commento che la valutazione
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedback("");
      setRating(0);

      const { data } = await axios.get(`/api/clubs/${id}`);
      setClub(data);
    } catch (error) {
      console.error("Errore durante l'invio del feedback:", error);
    }
  };

  if (!club) return <div>Caricamento...</div>;
  console.log("Commento:", feedback, "Valutazione:", rating);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {club.name}
      </Typography>

      <Image
        src={club.coverImage}
        alt="Immagine di copertina"
        width={1000}
        height={200}
        style={{ width: "100%", height: "auto", borderRadius: "10px" }}
      />

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Descrizione
            </Typography>
            <Typography variant="body1" gutterBottom>
              {club.description}
            </Typography>

            <Typography variant="h5" gutterBottom>
              Costo della Membership
            </Typography>
            <Typography variant="body1">
              <strong>Totale:</strong> €{club.membershipCost.total} <br />
              <strong>Quota Servizio:</strong> €{club.membershipCost.serviceFee}{" "}
              <br />
              <strong>Quota Club:</strong> €{club.membershipCost.clubFee}
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
              Indirizzo
            </Typography>
            <Typography variant="body1">{club.address}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <div
              style={{ height: "300px", width: "100%", marginBottom: "20px" }}
            >
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
                }}
                defaultCenter={club.geoLocation}
                defaultZoom={14}
              >
                <Marker
                  lat={club.geoLocation.lat}
                  lng={club.geoLocation.lng}
                  text="Posizione del club"
                />
              </GoogleMapReact>
            </div>
            <Container>
              <Typography variant="h4">Acquista l'invito al club</Typography>
              <BuyInviteButton clubId={id} />
            </Container>
          </Grid>
        </Grid>

        <Image
          src={club.profileImage}
          alt="Immagine del profilo"
          width={200}
          height={200}
          style={{ borderRadius: "50%", display: "block", margin: "20px auto" }}
        />
      </Box>
    </Container>
  );
};

export default ClubDetails;
