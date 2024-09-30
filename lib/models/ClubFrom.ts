import mongoose from "mongoose";

const ClubFormSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
  },
  clubName: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ClubForm ||
  mongoose.model("ClubForm", ClubFormSchema);
