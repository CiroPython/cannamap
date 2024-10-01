import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import User from "@/lib/models/User";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Credenziali non valide" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenziali non valide" });
      }

      // Verifica che JWT_SECRET sia presente
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET non definito");
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role }, // Aggiungiamo il ruolo nel token
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24,
          sameSite: "strict",
          path: "/",
        })
      );

      return res.status(200).json({ message: "Login effettuato con successo" });
    } catch  {
      return res.status(500).json({ message: "Errore del server: " });
    }
  } else {
    res.status(405).json({ message: "Metodo non consentito" });
  }
}
