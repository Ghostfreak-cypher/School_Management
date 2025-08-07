const { pool } = require("../lib/database");
const { calculateDistance } = require("../utils/utils");

// Add School API Controller
async function addSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body;

    const query =
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    const [result] = await pool.execute(query, [
      name,
      address,
      latitude,
      longitude,
    ]);

    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
      school: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({
      error: "Internal server error while adding school",
    });
  }
}

// List Schools API Controller
async function listSchools(req, res) {
  try {
    const userLatitude = req.query.latitude;
    const userLongitude = req.query.longitude;

    // Fetch all schools from database
    const query = "SELECT * FROM schools";
    const [schools] = await pool.execute(query);

    // Calculate distance for each school and add to the school object
    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance: calculateDistance(
        userLatitude,
        userLongitude,
        school.latitude,
        school.longitude
      ),
    }));

    // Sort schools by distance (proximity)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({
      message: "Schools retrieved successfully",
      userLocation: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      schools: schoolsWithDistance,
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      error: "Internal server error while fetching schools",
    });
  }
}

module.exports = {
  addSchool,
  listSchools,
};
