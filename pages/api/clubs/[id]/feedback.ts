import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Club from "@/lib/models/Club";
import { isAuthenticated } from "@/lib/authMiddleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { parse } from "cookie";

interface Feedback {
  userId: string;
  comment: string;
  rating: number;
}

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

  if (req.method === "POST") {
    return isAuthenticated(
      async (req: NextApiRequest, res: NextApiResponse) => {
        try {
          const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
          const token = cookies.token;

          if (!token) {
            return res.status(401).json({ message: "Token mancante" });
          }

          let decoded: User;
          try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "") as User;
          } catch (error) {
            return res.status(401).json({ message: "Token non valido" });
          }

          const { comment, rating } = req.body;
          console.log(comment, rating);
          // Validazione dell'input
          if (!comment || rating < 1 || rating > 5) {
            return res.status(400).json({
              message: "Commento e valutazione (1-5) sono obbligatori",
            });
          }

          const club = await Club.findById(id);
          if (!club) {
            return res.status(404).json({ message: "Club non trovato" });
          }

          const newFeedback: Feedback = {
            userId: decoded.id,
            comment,
            rating,
          };

          // Aggiungi il feedback al club
          club.feedbacks.push(newFeedback);
          await club.save();

          return res.status(200).json({
            message: "Feedback aggiunto con successo",
            feedback: newFeedback,
          });
        } catch (error) {
          console.error("Errore dettagliato:", error);
          return res
            .status(500)
            .json({ message: "Errore durante l'aggiunta del feedback", error });
        }
      }
    )(req, res);
  }

  return res
    .status(405)
    .json({ message: `Metodo ${req.method} non consentito` });
}
