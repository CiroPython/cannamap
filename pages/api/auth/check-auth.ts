import { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../lib/authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ message: "Authenticated" });
};

export default isAuthenticated(handler);
