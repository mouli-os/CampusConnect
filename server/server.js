

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const events = require("./data/events");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Event registration routes
app.use("/api/events", eventRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to Campus Connect Backend!");
});

// Get all campus events
app.get("/api/events", (req, res) => {
  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Campus Connect server running on port ${PORT}`);
  });
};

startServer();
