import dbConnect from "../../../lib/mongodb";
import Club from "../../../lib/models/Club";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const clubs = await Club.find({}); // Ottieni tutti i club
        res.status(200).json({ success: true, data: clubs });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {
        const club = await Club.create(req.body); // Crea un nuovo club
        res.status(201).json({ success: true, data: club });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}
