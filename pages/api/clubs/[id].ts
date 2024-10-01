import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Club from "@/lib/models/Club";
import { isAuthenticated } from "@/lib/authMiddleware"; // Middleware per autenticazione
import jwt, { JwtPayload } from "jsonwebtoken";

interface User extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  await dbConnect();

  // Gestisce la richiesta GET per recuperare i dettagli del club
  if (req.method === "GET") {
    try {
      const club = await Club.findById(id);
      if (!club) {
        return res.status(404).json({ message: "Club non trovato" });
      }
      return res.status(200).json(club);
    } catch (error) {
      return res.status(500).json({ message: "Errore del server" });
    }
  }

  // Gestisce la richiesta POST per aggiungere un feedback (richiede autenticazione)
  if (req.method === "POST") {
    return isAuthenticated(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const { message, rating } = req.body;

        // Verifica che il commento e il rating siano validi
        if (!message || !rating) {
          return res
            .status(400)
            .json({ message: "Commento e valutazione sono obbligatori" });
        }

        try {
          // Trova il club tramite l'ID
          const club = await Club.findById(id);
          if (!club) {
            return res.status(404).json({ message: "Club non trovato" });
          }

          // Decodifica il token per ottenere i dati dell'utente
          const token = req.headers.authorization?.split(" ")[1];
          if (!token) {
            return res
              .status(401)
              .json({ message: "Autenticazione necessaria" });
          }

          let decoded: User;
          try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "") as User;
          } catch (error) {
            return res.status(401).json({ message: "Token non valido" });
          }

          // Aggiungi il feedback al club
          club.feedbacks.push({
            userId: decoded.id,
            comment: message,
            rating,
            createdAt: new Date(),
          });

          // Salva il club con il nuovo feedback
          await club.save();

          return res
            .status(201)
            .json({ message: "Feedback aggiunto con successo" });
        } catch (error) {
          return res.status(500).json({ message: "Errore del server", error });
        }
      }
    )(req, res);
  }

  // Metodo non consentito
  return res
    .status(405)
    .json({ message: `Metodo ${req.method} non consentito` });
}
