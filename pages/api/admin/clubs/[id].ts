import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Club from "@/lib/models/Club";
import { isAuthenticated } from "@/lib/authMiddleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { parse } from "cookie";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Verifica se l'utente è admin
const checkAdminRole = (user: User | undefined) => {
  if (!user || user.role !== "admin") {
    throw new Error(
      "Accesso negato. Solo gli admin possono eseguire questa operazione."
    );
  }
};

// Gestisce le operazioni su un club specifico
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // Ottieni l'id del club dai parametri della query

  await dbConnect();

  // Gestisce la richiesta GET per recuperare i dettagli di un club
  if (req.method === "GET") {
    try {
      const club = await Club.findById(id); // Cerca il club tramite l'id

      if (!club) {
        return res.status(404).json({ message: "Club non trovato" });
      }

      return res.status(200).json(club); // Restituisci i dettagli del club
    } catch (error) {
      return res.status(500).json({
        message: "Errore durante il recupero del club",
        error: (error as Error).message,
      });
    }
  }

  // Gestisce la richiesta PUT per aggiornare un club
  if (req.method === "PUT") {
    return isAuthenticated(
      async (req: NextApiRequest, res: NextApiResponse) => {
        try {
          const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
          const token = cookies.token; // Recupera il token JWT

          if (!token) {
            return res.status(401).json({ message: "Token mancante" });
          }
          let decoded: User | JwtPayload | undefined;
          try {
            decoded = jwt.verify(
              token as string,
              process.env.JWT_SECRET || ""
            ) as User | JwtPayload;
          } catch (error) {
            return res.status(401).json({ message: "Token non valido" });
          }

          // Verifica il ruolo admin
          checkAdminRole(decoded as User);

          const {
            name,
            address,
            city,
            geoLocation,
            description,
            membershipCost,
            ageMinimum,
            profileImage,
            coverImage,
          } = req.body;

          // Verifica se tutti i campi obbligatori sono presenti
          if (
            !name ||
            !address ||
            !city ||
            !geoLocation ||
            !membershipCost ||
            !ageMinimum
          ) {
            return res
              .status(400)
              .json({ message: "Compila tutti i campi obbligatori" });
          }

          const updatedClub = await Club.findByIdAndUpdate(
            id,
            {
              name,
              address,
              city,
              geoLocation,
              description,
              membershipCost,
              ageMinimum,
              profileImage,
              coverImage,
            },
            { new: true }
          );

          if (!updatedClub) {
            return res.status(404).json({ message: "Club non trovato" });
          }

          return res.status(200).json(updatedClub);
        } catch (error) {
          return res.status(500).json({
            message: "Errore durante l'aggiornamento del club",
            error: (error as Error).message,
          });
        }
      }
    )(req, res);
  }

  // Gestisce la richiesta DELETE per eliminare un club
  if (req.method === "DELETE") {
    return isAuthenticated(
      async (req: NextApiRequest, res: NextApiResponse) => {
        try {
          const token = req.headers.authorization?.split(" ")[1];
          if (!token) {
            return res.status(401).json({ message: "Token mancante" });
          }

          let decoded: User | JwtPayload | undefined;
          try {
            decoded = jwt.verify(
              token as string,
              process.env.JWT_SECRET || ""
            ) as User | JwtPayload;
          } catch (error) {
            return res.status(401).json({ message: "Token non valido" });
          }

          // Verifica il ruolo admin
          checkAdminRole(decoded as User);

          const deletedClub = await Club.findByIdAndDelete(id);

          if (!deletedClub) {
            return res.status(404).json({ message: "Club non trovato" });
          }

          return res
            .status(200)
            .json({ message: "Club cancellato con successo" });
        } catch (error) {
          return res.status(500).json({
            message: "Errore durante la cancellazione del club",
            error: (error as Error).message,
          });
        }
      }
    )(req, res);
  }

  // Se il metodo non è supportato
  return res
    .status(405)
    .json({ message: `Metodo ${req.method} non consentito` });
}
