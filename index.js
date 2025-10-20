/**
 * Simple Express server that proxies requests to OpenWeatherMap.
 * Usage:
 *   - create a .env file in the backend folder with OPENWEATHER_API_KEY=your_api_key
 *   - npm install
 *   - npm run dev  (or npm start)
 *
 * Endpoints:
 *   GET /api/weather?city=London
 *   GET /api/weather?lat=12.97&lon=77.59
 *
 * Note: This is a teaching/demo project. For production, add rate-limiting and cache responses.
 */
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.warn("WARNING: OPENWEATHER_API_KEY not set. Create a .env file with your key.");
}

app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    let url;
    if (city) {
      const q = encodeURIComponent(city);
      url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=${API_KEY}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    } else {
      return res.status(400).json({ error: "Provide ?city=CityName OR ?lat=..&lon=.." });
    }

    const resp = await fetch(url);
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: text });
    }
    const data = await resp.json();
    // Send only useful bits to the frontend
    const out = {
      name: data.name,
      coords: data.coord,
      weather: data.weather,
      main: data.main,
      wind: data.wind,
      sys: data.sys
    };
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend static files when placed in backend/public
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
