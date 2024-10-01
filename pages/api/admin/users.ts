import { NextApiRequest, NextApiResponse } from "next";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { isAuthenticated } from "@/lib/authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const { method } = req;

  if (method === "PUT") {
    const { id, data } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      return res.status(200).json({ message: "Utente aggiornato", updatedUser });
    } catch (error) {
      return res.status(500).json({ message: "Errore durante l'aggiornamento", error });
    }
  } else if (method === "DELETE") {
    const { id } = req.body;

    try {
      await User.findByIdAndDelete(id);
      return res.status(200).json({ message: "Utente eliminato" });
    } catch (error) {
      return res.status(500).json({ message: "Errore durante l'eliminazione", error });
    }
  } else if (method === "PATCH") {
    const { id } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(id, { banned: true }, { new: true });
      return res.status(200).json({ message: "Utente bannato", updatedUser });
    } catch (error) {
      return res.status(500).json({ message: "Errore durante il bannamento", error });
    }
  } else {
    return res.status(405).json({ message: "Metodo non consentito" });
  }
};

export default isAuthenticated(handler);
