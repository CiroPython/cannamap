import FeedbackSchema from "./FeedbackSchema"; // Assicurati di aver creato Feedback.js
import mongoose from "mongoose";
const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  geoLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description: { type: String, required: true },
  membershipCost: {
    total: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    clubFee: { type: Number, required: true },
  },
  ageMinimum: { type: Number, required: true },
  feedback: [FeedbackSchema],
  profileImage: { type: String, default: "" }, // Campo per immagine di profilo
  coverImage: { type: String, default: "" }, // Campo per immagine di copertina
  createdAt: { type: Date, default: Date.now },
  stripePriceId: { type: String },
});

export default mongoose.models.Club || mongoose.model("Club", ClubSchema);
