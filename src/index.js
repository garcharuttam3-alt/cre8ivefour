import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/auth.route.js";
import workRoutes from "./routes/work.route.js";

dotenv.config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In your Express backend index.js


app.use(cors({
   origin: "*",
   credentials: true
}));


app.use(cookieParser());

/* ===============================
   DATABASE
================================ */
connectDB();

/* ===============================
   API ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/work", workRoutes);

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
   res.send("Server is running 🚀");
});

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
   console.log(`Server running on port ${PORT}`)
);
