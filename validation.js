// Validation middleware for school data
function validateSchoolData(req, res, next) {
  const { name, address, latitude, longitude } = req.body;

  // Check if all required fields are present
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      error: "All fields are required: name, address, latitude, longitude",
    });
  }

  // Validate name (non-empty string)
  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      error: "Name must be a non-empty string",
    });
  }

  // Validate address (non-empty string)
  if (typeof address !== "string" || address.trim().length === 0) {
    return res.status(400).json({
      error: "Address must be a non-empty string",
    });
  }

  // Validate latitude (valid number between -90 and 90)
  const lat = parseFloat(latitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({
      error: "Latitude must be a valid number between -90 and 90",
    });
  }

  // Validate longitude (valid number between -180 and 180)
  const lng = parseFloat(longitude);
  if (isNaN(lng) || lng < -180 || lng > 180) {
    return res.status(400).json({
      error: "Longitude must be a valid number between -180 and 180",
    });
  }

  // Set validated values
  req.body.latitude = lat;
  req.body.longitude = lng;
  req.body.name = name.trim();
  req.body.address = address.trim();

  next();
}

// Validation middleware for user location parameters
function validateUserLocation(req, res, next) {
  const { latitude, longitude } = req.query;

  // Check if latitude and longitude are provided
  if (!latitude || !longitude) {
    return res.status(400).json({
      error: "Both latitude and longitude query parameters are required",
    });
  }

  // Validate latitude
  const lat = parseFloat(latitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({
      error: "Latitude must be a valid number between -90 and 90",
    });
  }

  // Validate longitude
  const lng = parseFloat(longitude);
  if (isNaN(lng) || lng < -180 || lng > 180) {
    return res.status(400).json({
      error: "Longitude must be a valid number between -180 and 180",
    });
  }

  // Set validated values
  req.query.latitude = lat;
  req.query.longitude = lng;

  next();
}

module.exports = {
  validateSchoolData,
  validateUserLocation,
};
