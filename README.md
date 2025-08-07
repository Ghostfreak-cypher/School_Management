# School Management API

A Node.js REST API for managing school data with MySQL database integration. The API allows users to add schools and retrieve them sorted by proximity to a specified location.

## Features

- **Add School API**: Add new schools with validation
- **List Schools API**: Retrieve schools sorted by proximity to user location
- **MySQL Database**: Persistent storage with proper schema
- **Input Validation**: Comprehensive validation for all inputs
- **Distance Calculation**: Uses Haversine formula for geographical distance

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Installation

1. Clone or download the project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your MySQL database:

   - Update `.env` file with your MySQL credentials
   - The application will automatically create the database and table

4. Start the server:

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

## Database Configuration

Update the `.env` file with your MySQL configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
DB_PORT=3306
PORT=3000
```

## Database Schema

The application automatically creates a `schools` table with the following structure:

```sql
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);
```

## API Endpoints

### 1. Add School API

**Endpoint:** `POST /addSchool`

**Description:** Adds a new school to the database with proper validation.

**Request Body:**

```json
{
  "name": "ABC School",
  "address": "123 Main Street, City, State",
  "latitude": 40.7128,
  "longitude": -74.006
}
```

**Response (Success - 201):**

```json
{
  "message": "School added successfully",
  "schoolId": 1,
  "school": {
    "id": 1,
    "name": "ABC School",
    "address": "123 Main Street, City, State",
    "latitude": 40.7128,
    "longitude": -74.006
  }
}
```

**Validation Rules:**

- `name`: Required, non-empty string
- `address`: Required, non-empty string
- `latitude`: Required, valid number between -90 and 90
- `longitude`: Required, valid number between -180 and 180

### 2. List Schools API

**Endpoint:** `GET /listSchools`

**Description:** Retrieves all schools sorted by proximity to the user's location.

**Query Parameters:**

- `latitude`: User's latitude (required)
- `longitude`: User's longitude (required)

**Example Request:**

```
GET /listSchools?latitude=40.7128&longitude=-74.0060
```

**Response (Success - 200):**

```json
{
  "message": "Schools retrieved successfully",
  "userLocation": {
    "latitude": 40.7128,
    "longitude": -74.006
  },
  "schools": [
    {
      "id": 1,
      "name": "Nearest School",
      "address": "123 Main Street, City, State",
      "latitude": 40.713,
      "longitude": -74.0058,
      "distance": 0.025
    },
    {
      "id": 2,
      "name": "Second Nearest School",
      "address": "456 Oak Avenue, City, State",
      "latitude": 40.72,
      "longitude": -74.01,
      "distance": 0.892
    }
  ]
}
```

### 3. Health Check

**Endpoint:** `GET /health`

**Description:** Simple health check endpoint to verify API status.

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:

- **400 Bad Request**: Invalid input data or missing required fields
- **404 Not Found**: Endpoint not found
- **500 Internal Server Error**: Database or server errors

**Error Response Format:**

```json
{
  "error": "Error description"
}
```

## Distance Calculation

The API uses the Haversine formula to calculate geographical distances between coordinates. Distances are returned in kilometers.

## Testing the API

### Using curl:

**Add a school:**

```bash
curl -X POST http://localhost:3000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "address": "123 Test Street",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

**List schools:**

```bash
curl "http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060"
```

### Using Postman:

1. **Add School:**

   - Method: POST
   - URL: `http://localhost:3000/addSchool`
   - Headers: `Content-Type: application/json`
   - Body: Raw JSON with school data

2. **List Schools:**
   - Method: GET
   - URL: `http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.0060`

## Project Structure

```
school-management-api/
├── server.js          # Main application file
├── database.js        # Database configuration and initialization
├── controllers.js     # API route handlers
├── validation.js      # Input validation middleware
├── utils.js          # Utility functions (distance calculation)
├── package.json      # Project dependencies and scripts
├── .env             # Environment configuration
└── README.md        # This file
```

## Environment Variables

- `DB_HOST`: MySQL host (default: localhost)
- `DB_USER`: MySQL username (default: root)
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name (default: school_management)
- `DB_PORT`: MySQL port (default: 3306)
- `PORT`: Server port (default: 3000)

## Security Considerations

- Input validation for all API endpoints
- SQL injection prevention using parameterized queries
- CORS enabled for cross-origin requests
- Environment variables for sensitive configuration

## License

ISC
