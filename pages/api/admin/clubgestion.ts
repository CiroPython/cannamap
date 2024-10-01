import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Club from "@/lib/models/Club";
import { isAuthenticated } from "@/lib/authMiddleware";
import jwt from "jsonwebtoken";

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

// Gestisce le operazioni sui club
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    return isAuthenticated(
      async (req: NextApiRequest, res: NextApiResponse) => {
        try {
          // Decodifica il token JWT per ottenere l'utente
          const token = req.headers.authorization?.split(" ")[1];
          const decoded = jwt.verify(
            token as string,
            process.env.JWT_SECRET || ""
          ) as User | undefined;

          // Verifica il ruolo admin
          checkAdminRole(decoded);

          const {
            name,
            address,
            city,
            geoLocation, // Accesso diretto a geoLocation
            description,
            membershipCost, // Accesso diretto a membershipCost
            ageMinimum,
            profileImage,
            coverImage,
          } = req.body;

          // Validazione di base
          if (
            !name ||
            !address ||
            !city ||
            !membershipCost ||
            !membershipCost.total ||
            !membershipCost.serviceFee ||
            !membershipCost.clubFee ||
            !ageMinimum
          ) {
            return res
              .status(400)
              .json({ message: "Compila tutti i campi obbligatori" });
          }

          // Crea il nuovo club
          const newClub = new Club({
            name,
            address,
            city,
            geoLocation, // Assicurati che contenga lat e lng
            description,
            membershipCost, // Passa l'intero oggetto membershipCost
            ageMinimum,
            profileImage,
            coverImage,
          });

          await newClub.save();

          return res.status(201).json(newClub);
        } catch {
          return res.status(500).json({
            message: "Errore durante la creazione del club",
          });
        }
      }
    )(req, res);
  }

  if (req.method === "PUT") {
    return isAuthenticated(
      async (req: NextApiRequest, res: NextApiResponse) => {
        try {
          const token = req.headers.authorization?.split(" ")[1];
          const decoded = jwt.verify(
            token as string,
            process.env.JWT_SECRET || ""
          ) as User | undefined;

          // Verifica il ruolo admin
          checkAdminRole(decoded);

          const { id, data } = req.body;

          if (!id || !data) {
            return res.status(400).json({ message: "ID o dati mancanti" });
          }

          const updatedClub = await Club.findByIdAndUpdate(id, data, {
            new: true,
          });

          if (!updatedClub) {
            return res.status(404).json({ message: "Club non trovato" });
          }

          return res.status(200).json(updatedClub);
        } catch {
          return res.status(500).json({
            message: "Errore durante l'aggiornamento del club",
          });
        }
      }
    )(req, res);
  }

  if (req.method === "DELETE") {
    return isAuthenticated(
      async (req: NextApiRequest, res: NextApiResponse) => {
        try {
          const token = req.headers.authorization?.split(" ")[1];
          const decoded = jwt.verify(
            token as string,
            process.env.JWT_SECRET || ""
          ) as User | undefined;

          // Verifica il ruolo admin
          checkAdminRole(decoded);

          const { id } = req.body;

          if (!id) {
            return res.status(400).json({ message: "ID mancante" });
          }

          const deletedClub = await Club.findByIdAndDelete(id);

          if (!deletedClub) {
            return res.status(404).json({ message: "Club non trovato" });
          }

          return res
            .status(200)
            .json({ message: "Club cancellato con successo" });
        } catch {
          return res.status(500).json({
            message: "Errore durante la cancellazione del club",
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
