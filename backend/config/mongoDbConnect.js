const mongoose = require("mongoose");

let isConnected = false; // Track connection status

const connectDb = async ({ mongoUri }) => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(mongoUri);
    isConnected = db.connections[0].readyState === 1; // 1 means connected
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

module.exports = { connectDb };
