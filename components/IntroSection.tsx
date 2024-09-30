import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const IntroSection: React.FC = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #e8f5e9, #f1f8e9)", // Sfondo verde chiaro e morbido
        padding: "50px 0",
        textAlign: "center",
        color: "#4caf50", // Verde per il testo principale
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Benvenuto su Cannabook
        </Typography>
        <Typography variant="body1" paragraph>
          Se sei un fumatore alla ricerca del miglior club o dispensario di
          cannabis vicino a te, sei nel posto giusto! Trova il tuo club ideale
          con Cannabook.
        </Typography>
        <Typography variant="body1" paragraph>
          Sei un gestore di un cannabis club? Unisciti a Cannabook per portare
          più persone al tuo club e aumentare la tua visibilità.
        </Typography>
      </Container>
    </Box>
  );
};

export default IntroSection;
