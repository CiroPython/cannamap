import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";
import QRCode from "qrcode";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    const { sessionId } = req.body;

    try {
      // Recupera i dettagli della sessione di pagamento da Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const customer = await stripe.customers.retrieve(
        session.customer as string
      );

      // Genera il QR code con le informazioni del ticket
      const qrCodeData = `Ticket per ${customer.name}, club: ${session.metadata.clubId}, email: ${customer.email}`;
      const qrCode = await QRCode.toDataURL(qrCodeData);

      // Salva il ticket nel database
      const ticket = await Ticket.create({
        name: customer.name,
        email: customer.email,
        clubId: session.metadata.clubId,
        qrCodeData: qrCodeData,
        qrCodeImage: qrCode,
        date: new Date(),
      });

      res.status(200).json(ticket);
    } catch (error) {
      console.error("Errore durante la generazione del ticket:", error);
      res
        .status(500)
        .json({ message: "Errore nella generazione del ticket", error });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Metodo non consentito");
  }
}
