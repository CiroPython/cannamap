// pages/api/cities.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Club from "@/lib/models/Club";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    // Otteniamo le città uniche e l'ultimo club aggiunto in ogni città
    const clubs = await Club.aggregate([
      {
        $group: {
          _id: "$city",
          latestClub: { $last: "$$ROOT" },
        },
      },
    ]);

    if (!clubs.length) {
      return res.status(404).json({ message: "Nessun club trovato" });
    }

    const cities = clubs.map((club) => ({
      city: club._id,
      profileImage: club.latestClub.profileImage,
    }));

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle città", error });
  }
}
