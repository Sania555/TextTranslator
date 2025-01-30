const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { translateText, getHistory } = require("../controllers/translateController");

const router = express.Router();

router.post("/", authMiddleware, translateText);
router.get("/history", authMiddleware, getHistory);

module.exports = router;
