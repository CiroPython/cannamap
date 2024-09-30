import { isAuthenticated } from "../../../lib/authMiddleware";

const handler = async (req, res) => {
  return res.status(200).json({ message: "Authenticated" });
};

export default isAuthenticated(handler);
