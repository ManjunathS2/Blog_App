import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const port = process.env.PORT || 4001;
const MONOGO_URL = process.env.MONOG_URI;

// --- Middleware Configuration ---
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Configure file uploads to use temporary files for Cloudinary
app.use(
  fileUpload({
    useTempFiles: true, 
    tempFileDir: "./tmp/",
  }),
);

// --- Database Connection ---
try {
  mongoose.connect(MONOGO_URL);
  console.log("Connected to MongoDB database successfully");
} catch (error) {
  console.log("Error connecting to MongoDB:", error);
}

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// --- API Routes ---
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);

app.listen(port, () => {
  console.log(`Server is running and listening on port ${port}`);
});
