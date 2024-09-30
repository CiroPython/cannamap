import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"], // Definiamo i ruoli possibili
    default: "user", // Il ruolo di default è "user"
  },
  orders: [
    {
      name: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
