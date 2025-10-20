Backend (Node.js Express)
1. Install dependencies:
   cd backend
   npm install

2. Create .env with your OpenWeatherMap API key:
   cp .env.example .env
   (edit .env and set OPENWEATHER_API_KEY)

3. Run:
   npm start
   or for development:
   npm run dev

Endpoints:
   GET /api/weather?city=London
   GET /api/weather?lat=12.97&lon=77.59

Note: The backend also serves static files from backend/public if present.

The Sample web page: https://docs.google.com/document/d/1YStg18_aKfSVx_azLOhBmwbL1TyzPcPt5f69kP0EbdA/edit?usp=drivesdk
