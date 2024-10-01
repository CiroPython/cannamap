import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export const isAuthenticated = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as string | JwtPayload;
      req.user = decoded;  // Aggiungiamo decoded all'oggetto req
      return handler(req, res); // Chiamiamo l'handler se l'autenticazione è valida
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
