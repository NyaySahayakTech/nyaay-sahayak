const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Basic Health Route to test if server is running
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Nyaya Sahayak API is running" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
