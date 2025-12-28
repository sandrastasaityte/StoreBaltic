import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

import connectDB from "./src/Components/config/db.js";
import authRoutes from "./src/Components/routes/auth.js";
import productRoutes from "./src/Components/routes/products.js";
import orderRoutes from "./src/Components/routes/orders.js";


const app = express();

// ESM __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use("/upload", express.static("upload"));


const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5180",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (Postman/curl)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  })
);


// Ensure upload folder exists
const uploadDir = path.join(__dirname, "upload/images");
fs.mkdirSync(uploadDir, { recursive: true });

// Serve images
app.use("/images", express.static(uploadDir));

// Multer upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `img_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file" });
  res.json({ success: true, imageUrl: `/images/${req.file.filename}` });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => res.send("StoreBaltic API running ✅"));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));

connectDB(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("❌ MongoDB connection error:", e.message));

