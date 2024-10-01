import { NextApiRequest, NextApiResponse } from "next";
import User from "@/lib/models/User"; // Importa il modello User
import dbConnect from "@/lib/mongodb"; // Connessione a MongoDB
import jwt, { JwtPayload } from "jsonwebtoken";
import { parse } from "cookie";

interface UserToken {
  id: string;
  role: string;
  email: string;
}

// Middleware per verificare se l'utente è autenticato e ha un token valido
const authenticateUser = (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token; // Recupera il token JWT

  if (!token) {
    return res.status(401).json({ message: "Token mancante" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as UserToken;
    return decoded; // Ritorna i dati dell'utente decodificati
  } catch (error) {
    throw new Error("Token non valido o scaduto");
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;

  try {
    // Verifica che l'utente sia autenticato
    const authenticatedUser = authenticateUser(req);

    // Se il metodo è GET
    if (req.method === "GET") {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      return res.status(200).json(user);

      // Se il metodo è PUT (aggiornamento utente)
    } else if (req.method === "PUT") {
      const { firstName, lastName, role } = req.body;

      // Verifica se l'utente è un admin o se sta aggiornando il proprio account
      if (authenticatedUser.role !== "admin" && authenticatedUser.id !== id) {
        return res.status(403).json({ message: "Accesso negato" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { firstName, lastName, role },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      return res
        .status(200)
        .json({ message: "Utente aggiornato", updatedUser });

      // Se il metodo è DELETE (eliminazione utente)
    } else if (req.method === "DELETE") {
      // Solo gli admin possono eliminare utenti
      if (authenticatedUser.role !== "admin") {
        return res.status(403).json({ message: "Accesso negato" });
      }

      await User.findByIdAndDelete(id);
      return res.status(200).json({ message: "Utente eliminato" });

      // Se il metodo è PATCH (ban utente)
    } else if (req.method === "PATCH") {
      // Solo gli admin possono bannare utenti
      if (authenticatedUser.role !== "admin") {
        return res.status(403).json({ message: "Accesso negato" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { banned: true },
        { new: true }
      );
      return res.status(200).json({ message: "Utente bannato", updatedUser });

      // Metodo non consentito
    } else {
      return res.status(405).json({ message: "Metodo non consentito" });
    }
  } catch (error) {
    return res.status(401).json({ message: (error as Error).message });
  }
}
