import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  await dbConnect();

  const { firstName, lastName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    
    // Aggiungi il token all'utente prima di salvarlo
    user.token = token;
    
    await user.save();


    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24,
        sameSite: "strict",
        path: "/",
      })
    );

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error });
  }
}
