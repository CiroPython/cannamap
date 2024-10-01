import { NextApiRequest, NextApiResponse } from "next";
import express, { Request, Response } from "express";
import multer from "multer";
import { IncomingMessage, ServerResponse } from "http";

// Configura Multer per gestire l'upload dei file
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Configura Express e Multer
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route di upload
app.post(
  "/api/upload",
  upload.single("file"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "Nessun file caricato" });
    } else {
      res.status(200).json({ url: `/uploads/${req.file.filename}` });
    }
  }
);

// Gestisce altri metodi HTTP
app.all("*", (req: Request, res: Response): void => {
  res.status(405).json({ error: `Metodo ${req.method} non consentito` });
});

// Funzione handler principale
export default async function handler(
  req: IncomingMessage & NextApiRequest,
  res: ServerResponse & NextApiResponse
): Promise<void> {
  // Utilizza Express per gestire la logica dell'upload
  app(req as unknown as Request, res as unknown as Response);
}

export const config = {
  api: {
    bodyParser: false, // Disabilita il body parser di Next.js per Multer
  },
};
