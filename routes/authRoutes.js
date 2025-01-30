const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Translation = require("../models/Translation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "91603e0e7cd618a98cb384119044774b9a34f1a617d5650cb57813c9be9f8d36";

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token }); 
  } catch (error) {
    
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/translate", authMiddleware, async (req, res) => {
  const { text } = req.body;
  const userId = req.user.userId;

  try {
    const translatedText = `Translated to French: ${text}`;

    const translation = new Translation({ userId, inputText: text, translatedText });
    await translation.save();

    res.status(201).json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: "Failed to translate text" });
  }
});

router.get("/translate/history", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const translations = await Translation.find({ userId });

    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch translation history" });
  }
});

module.exports = router;
