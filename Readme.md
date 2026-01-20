# HackX - Public Health & Urban Risk Dashboard

**Open Bharat Track - Hackathon MVP**

A MERN stack application for monitoring and visualizing public health incidents, sanitation complaints, and environmental data across urban areas.

---

## 📋 Project Overview

This dashboard aims to provide real-time insights into:
- 🏥 Health incidents (disease outbreaks, epidemics, food poisoning)
- 🚰 Sanitation complaints (waste management, drainage, public facilities)
- 🌍 Environmental data (air quality, water quality)
- 🗺️ Geographic risk visualization

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

### Future Integrations
- **Leaflet** - Interactive maps
- **Recharts/Chart.js** - Data visualization

---

## 📁 Project Structure

```
HackX/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── HealthIncident.js        # Health incident schema
│   │   ├── SanitationComplaint.js   # Sanitation complaint schema
│   │   └── EnvironmentalData.js     # Environmental data schema
│   ├── routes/
│   │   └── health.js                # Health check routes
│   ├── controllers/
│   │   └── healthController.js      # Route handlers
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── server.js                    # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Navigation component
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   └── MapView.jsx          # Map visualization
│   │   ├── services/
│   │   │   └── api.js               # Axios API service
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind CSS
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Update .env file with your MongoDB URI
# Default: mongodb://localhost:27017/hackx-dashboard

# Start the server
npm run dev
```

The backend server will start on **http://localhost:5000**

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:5173**

---

## 🔌 API Endpoints

### Health Check
- **GET** `/api/health`
  - Returns server status and database connection info
  - Response:
    ```json
    {
      "status": "Server running",
      "timestamp": "2026-01-20T10:30:00.000Z",
      "environment": "development",
      "database": "connected"
    }
    ```

### Future Endpoints (Phase 2+)
- `POST /api/health-incidents` - Create health incident
- `GET /api/health-incidents` - Get all health incidents
- `POST /api/sanitation-complaints` - Create complaint
- `GET /api/sanitation-complaints` - Get all complaints
- `POST /api/environmental-data` - Add environmental reading
- `GET /api/environmental-data` - Get environmental data

---

## 📊 Database Models

### HealthIncident
```javascript
{
  type: String,              // disease_outbreak, epidemic, food_poisoning, other
  area: String,              // Geographic area
  location: {
    lat: Number,
    lng: Number
  },
  date: Date,
  severity: String,          // low, medium, high, critical
  description: String,
  affectedCount: Number
}
```

### SanitationComplaint
```javascript
{
  category: String,          // waste_management, drainage, public_toilet, etc.
  area: String,
  location: {
    lat: Number,
    lng: Number
  },
  status: String,            // pending, in_progress, resolved, rejected
  date: Date,
  description: String,
  priority: String,          // low, medium, high
  reportedBy: String
}
```

### EnvironmentalData
```javascript
{
  type: String,              // air, water
  aqi: Number,               // Air Quality Index
  pm25: Number,              // Particulate matter
  pm10: Number,
  co2: Number,
  ph: Number,                // Water pH
  turbidity: Number,
  dissolvedOxygen: Number,
  area: String,
  location: {
    lat: Number,
    lng: Number
  },
  date: Date,
  qualityLevel: String       // good, moderate, poor, hazardous
}
```

---

## ✅ Phase 1 Checklist

- [x] Backend Express server setup
- [x] MongoDB connection with Mongoose
- [x] Environment configuration (.env)
- [x] Proper folder structure (config, models, routes, controllers)
- [x] Health check API endpoint
- [x] Three database schemas (Health, Sanitation, Environmental)
- [x] Frontend React + Vite setup
- [x] Tailwind CSS configuration
- [x] React Router navigation
- [x] Dashboard and MapView pages
- [x] Axios API service
- [x] Frontend-Backend connection test

---

## 🎯 Next Steps (Phase 2)

1. **CRUD Operations**
   - Implement controllers for all models
   - Add routes for data creation and retrieval

2. **Data Visualization**
   - Integrate Chart.js or Recharts
   - Create charts for trends and statistics

3. **Map Integration**
   - Add Leaflet for interactive maps
   - Implement markers, clustering, and heat maps

4. **Filters & Search**
   - Date range filtering
   - Area-based filtering
   - Status/severity filters

5. **UI Enhancements**
   - Loading states
   - Error handling
   - Responsive design improvements

---

## 🤝 Contributing

This is a hackathon project. Feel free to fork and modify as needed!

---

## 📝 License

MIT

---

## 👨‍💻 Author

Built for HackX - Open Bharat Track

---

## 🙏 Acknowledgments

- Open data initiatives
- Public health monitoring systems
- Urban planning communities
