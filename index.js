import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import wardrobeRoutes from "./routes/wardrobe.js";
import recommendationRoutes from "./routes/recommendation.js"
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/wardrobe", wardrobeRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
