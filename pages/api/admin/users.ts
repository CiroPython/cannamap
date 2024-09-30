import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import User from "@/lib/models/User";
import { isAuthenticated } from "@/lib/authMiddleware"; // Middleware per autenticazione

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Errore durante il recupero degli utenti" });
    }
  } else {
    res.status(405).json({ message: "Metodo non consentito" });
  }
};

export default isAuthenticated(handler); // Applica il middleware
