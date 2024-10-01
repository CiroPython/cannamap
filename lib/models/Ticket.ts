import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  qrCodeData: { type: String, required: true },
  qrCodeImage: { type: String, required: true },
  date: { type: Date, required: true },
});

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
