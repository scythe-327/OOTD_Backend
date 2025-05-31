import express from "express";
import sql from "../db/index.js";
import axios from "axios"; 

const router = express.Router();

// This assumes your engine is hosted or accessible locally
const RECOMMENDER_URL = process.env.RECOMMENDER_URL || "http://localhost:8000/recommend";

router.post("/generate", async (req, res) => {
  const { userId, age, height, weight, skin_color, event } = req.body;
  console.log("Inside the recomendation path /generate");
  if (!userId || !event || !age || !height || !weight || !skin_color) {
    return res.status(400).json({ error: "Missing fields" });
  }
conso
  try {
    // Fetch wardrobe items
    const wardrobe = await sql`
      SELECT category, item_name FROM wardrobe WHERE user_id = ${userId}
    `;

    const categorized = {
      shirts: [],
      pants: [],
      jackets: [],
      shoes: [],
      ethnic_wear: [],
      accessories: [],
    };

    wardrobe.forEach(item => {
      categorized[item.category].push(item.item_name);
    });

    // Prepare payload
    const payload = {
      age,
      height,
      weight,
      skin_color,
      event,
      ...categorized,
    };

    // Call recommendation engine
    const response = await axios.post(RECOMMENDER_URL, payload);

    const recommendations = response.data;

    // Save in DB
    await sql`
      INSERT INTO recommendations (user_id, event_prompt, result_json)
      VALUES (${userId}, ${event}, ${sql.json(recommendations)})
    `;

    res.status(200).json({ recommendations });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error generating recommendation" });
  }
});

export default router;
