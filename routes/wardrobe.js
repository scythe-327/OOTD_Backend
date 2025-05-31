import express from "express";
import sql from "../db/index.js";

const router = express.Router();

const allowedCategories = ['shirts', 'pants', 'jackets', 'shoes', 'ethnic_wear', 'accessories'];

router.post("/add", async (req, res) => {
  const { userId, ...categories } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const inserts = [];

  for (const category in categories) {
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: `Invalid category: ${category}` });
    }

    const items = categories[category];
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: `Items for ${category} must be an array` });
    }

    items.forEach(item => {
      inserts.push(sql`
        INSERT INTO wardrobe (user_id, category, item_name)
        VALUES (${userId}, ${category}, ${item})
      `);
    });
  }

  try {
    await Promise.all(inserts);
    res.status(201).json({ message: "Items added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
export default router;
