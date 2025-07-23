const express = require("express");
const cors = require("cors");
const { connectDb } = require("../config/mongodbconnect");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDb({
  mongoUri: process.env.MONGODB_URL,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.send("Server is up and running...");
});

// Import all routes
const stateRoutes = require("../routes/stateRoutes");

// Routes
app.use("/api/state", stateRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
