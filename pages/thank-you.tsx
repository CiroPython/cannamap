import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

const ThankYouPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Grazie per la tua iscrizione!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Il tuo form è stato inviato con successo e verrà gestito al più
          presto. Ti contatteremo a breve.
        </Typography>

        <Box mt={4}>
          <Link href="/" passHref>
            <Button variant="contained" color="primary">
              Torna alla Home
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ThankYouPage;
