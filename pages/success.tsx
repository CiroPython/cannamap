import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import QRCode from "qrcode";

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    if (session_id) {
      const fetchTicketData = async () => {
        try {
          const { data } = await axios.post("/api/generate_ticket", {
            sessionId: session_id,
          });
          setTicketData(data);
        } catch (error) {
          console.error("Errore nel recupero del ticket:", error);
        }
      };
      fetchTicketData();
    }
  }, [session_id]);

  if (!ticketData) return <div>Caricamento...</div>;

  return (
    <Container>
      <Typography variant="h4">Acquisto completato con successo</Typography>
      <Typography variant="body1">Nome: {ticketData.name}</Typography>
      <Typography variant="body1">Data e ora: {ticketData.date}</Typography>
      <QRCode value={ticketData.qrCodeData} />

      {/* Altri dettagli del ticket */}
    </Container>
  );
};

export default SuccessPage;
