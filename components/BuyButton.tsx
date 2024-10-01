import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const BuyInviteButton = ({ clubId }) => {
  const router = useRouter();
  console.log("mi passa id" + clubId);
  const handlePurchase = async () => {
    try {
      const response = await axios.post("/api/checkout", {
        clubId, // Passa l'ID del club
      });

      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (error) {
      console.error(
        "Errore durante la creazione della sessione di pagamento",
        error
      );
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handlePurchase}>
      Compra Invito
    </Button>
  );
};

export default BuyInviteButton;
