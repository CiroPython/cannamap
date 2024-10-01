import { NextApiRequest, NextApiResponse } from "next";
import User from "@/lib/models/User"; // Importa il modello User
import dbConnect from "@/lib/mongodb"; // Connessione a MongoDB

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Errore nel server", error });
    }
  } else if (req.method === "PUT") {
    // Gestione dell'aggiornamento dell'utente (come già implementato)
    const { firstName, lastName, role } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { firstName, lastName, role },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      return res.status(200).json({ message: "Utente aggiornato", updatedUser });
    } catch (error) {
      return res.status(500).json({ message: "Errore durante l'aggiornamento", error });
    }
  } else if (req.method === "DELETE") {
    // Gestione della cancellazione dell'utente
    try {
      await User.findByIdAndDelete(id);
      return res.status(200).json({ message: "Utente eliminato" });
    } catch (error) {
      return res.status(500).json({ message: "Errore durante l'eliminazione", error });
    }
  } else if (req.method === "PATCH") {
    // Gestione del ban dell'utente
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { banned: true },
        { new: true }
      );
      return res.status(200).json({ message: "Utente bannato", updatedUser });
    } catch (error) {
      return res.status(500).json({ message: "Errore durante il ban", error });
    }
  } else {
    return res.status(405).json({ message: "Metodo non consentito" });
  }
}
