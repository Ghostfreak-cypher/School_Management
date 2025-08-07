const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initializeDatabase } = require("./lib/database");
const {
  validateSchoolData,
  validateUserLocation,
} = require("./middleware/validation");
const { addSchool, listSchools } = require("./Controllers/controllers");

const app = express();
const PORT = process.env.PORT || 3306;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Add School API
app.post("/addSchool", validateSchoolData, addSchool);

// List Schools API
app.get("/listSchools", validateUserLocation, listSchools);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "School Management API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
  });
});

// Initialize database and start server
async function startServer() {
  try {
     //await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`School Management API is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Add School: POST http://localhost:${PORT}/addSchool`);
      console.log(
        `List Schools: GET http://localhost:${PORT}/listSchools?latitude={lat}&longitude={lng}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
