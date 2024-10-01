import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../../../lib/models/User";
import dbConnect from "../../../lib/mongodb";

// Definisci il tipo specifico per i dati che decodifichi dal JWT
interface DecodedToken extends JwtPayload {
  userId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token mancante o non valido" });
  }

  const token = authorization.split(" ")[1];

  try {
    // Specifica che decoded è del tipo DecodedToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Errore nella verifica del token:", err); // Log dell'errore per debug
    return res.status(401).json({ message: "Token non valido o scaduto" });
  }
}
