require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const translateRoutes = require("./routes/translateRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);  
app.use("/api/translate", translateRoutes);  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
