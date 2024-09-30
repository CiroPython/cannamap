import ClubFrom from "@/lib/models/ClubFrom";
import dbConnect from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await dbConnect();
      const {
        senderName,
        clubName,
        state,
        province,
        city,
        zipCode,
        address,
        phoneNumber,
        contactEmail,
      } = req.body;

      const newForm = new ClubFrom({
        senderName,
        clubName,
        state,
        province,
        city,
        zipCode,
        address,
        phoneNumber,
        contactEmail,
      });

      await newForm.save();
      return res.status(201).json({ message: "Form submission successful" });
    } catch (error) {
      return res.status(500).json({ error: "Error saving form data" });
    }
  } else {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }
}
