import { NextApiRequest, NextApiResponse } from "next";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { isAuthenticated } from "@/lib/authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { banDuration } = req.body;

  await dbConnect();

  try {
    const bannedUntil = new Date();
    bannedUntil.setDate(bannedUntil.getDate() + banDuration); // Impostiamo la durata del ban

    const bannedUser = await User.findByIdAndUpdate(
      id,
      { role: "banned", bannedUntil },
      { new: true }
    );
    return res.status(200).json({ message: "Utente bannato", bannedUser });
  } catch (error) {
    return res.status(500).json({ message: "Errore durante il bannamento", error });
  }
};

export default isAuthenticated(handler);
