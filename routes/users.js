// routes/users.js
import express from "express";
import sql from "../db/index.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // For now use plain text (in production use bcrypt)
  try {
    const result = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${password})
      RETURNING id
    `;
    res.status(201).json({ message: "User created", userId: result[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User creation failed" });
  }
});

export default router;
