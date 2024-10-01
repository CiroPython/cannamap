import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Club from "@/lib/models/Club";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { clubId } = req.body;

  await dbConnect();

  try {
    // Trova il club e il price_ID
    const club = await Club.findById(clubId);
    if (!club || !club.stripePriceId) {
      return res
        .status(404)
        .json({ message: "Club non trovato o price_ID mancante" });
    }

    // Crea la sessione di pagamento su Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: club.stripePriceId, // Utilizza il price_ID del club
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({
      message: "Errore durante la creazione della sessione di pagamento",
      error,
    });
  }
}
