import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Club from "@/lib/models/Club";

// Gestisce le operazioni sui club
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "PUT") {
    try {
      const { id, data } = req.body; // Aggiorna i dati del club
      const updatedClub = await Club.findByIdAndUpdate(id, data, { new: true });
      return res.status(200).json(updatedClub);
    } catch (error) {
      return res.status(500).json({ message: "Errore aggiornamento club", error });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      await Club.findByIdAndDelete(id);
      return res.status(200).json({ message: "Club cancellato" });
    } catch (error) {
      return res.status(500).json({ message: "Errore cancellazione club", error });
    }
  }
}
