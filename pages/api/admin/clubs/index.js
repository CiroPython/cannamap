import dbConnect from "../../../../lib/mongodb";
import Club from "../../../../lib/models/Club";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const clubs = await Club.find({});
        res.status(200).json({ success: true, data: clubs });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const {
          name,
          address,
          city,
          geoLocation,
          description,
          membershipCost,
          ageMinimum,
          profileImage,
          coverImage,
        } = req.body;

        // Validazione di base
        if (
          !name ||
          !address ||
          !city ||
          !membershipCost ||
          !membershipCost.total ||
          !membershipCost.serviceFee ||
          !membershipCost.clubFee ||
          !ageMinimum
        ) {
          return res.status(400).json({
            success: false,
            message: "Compila tutti i campi obbligatori",
          });
        }

        // Crea il prodotto su Stripe
        const product = await stripe.products.create({
          name,
          description,
        });

        // Crea il prezzo su Stripe
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: membershipCost.total * 100, // Converti in centesimi
          currency: "eur",
        });

        // Crea il nuovo club nel database con lo `stripePriceId`
        const newClub = new Club({
          name,
          address,
          city,
          geoLocation,
          description,
          membershipCost,
          ageMinimum,
          profileImage,
          coverImage,
          stripePriceId: price.id, // Aggiungi lo `stripePriceId`
        });

        await newClub.save();

        res.status(201).json({ success: true, data: newClub });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
