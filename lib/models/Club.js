import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  date: { type: Date, default: Date.now },
});

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
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Club || mongoose.model("Club", ClubSchema);
