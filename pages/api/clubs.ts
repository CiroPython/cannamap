import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Club from "@/lib/models/Club";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { city } = req.query;
  await dbConnect();

  try {
    const clubs = await Club.find({ city: city as string });

    if (!clubs.length) {
      return res
        .status(404)
        .json({ message: "Nessun club trovato per questa città" });
    }

    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei club", error });
  }
}
