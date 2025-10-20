const apiBase = window.location.origin + '/api/weather';

const $ = id => document.getElementById(id);
const card = $('card');
const errorBox = $('error');

async function fetchWeatherByCity(city) {
  showError('');
  try {
    const res = await fetch(`${apiBase}?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
      const err = await res.json();
      showError(err.error || 'Error fetching weather');
      return;
    }
    const data = await res.json();
    renderWeather(data);
  } catch (e) {
    showError(e.message);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  showError('');
  try {
    const res = await fetch(`${apiBase}?lat=${lat}&lon=${lon}`);
    if (!res.ok) {
      const err = await res.json();
      showError(err.error || 'Error fetching weather');
      return;
    }
    const data = await res.json();
    renderWeather(data);
  } catch (e) {
    showError(e.message);
  }
}

function renderWeather(data) {
  if (!data) return;
  card.classList.remove('hidden');
  $('location').textContent = `${data.name} ${data.sys && data.sys.country ? ', ' + data.sys.country : ''}`;
  $('weatherDesc').textContent = data.weather && data.weather[0] ? data.weather[0].description : '';
  $('temp').textContent = Math.round(data.main.temp) + '°C';
  $('feels').textContent = 'Feels like ' + Math.round(data.main.feels_like) + '°C';
  $('humidity').textContent = data.main.humidity;
  $('wind').textContent = data.wind.speed;
  $('coords').textContent = data.coords.lat + ', ' + data.coords.lon;
}

function showError(msg) {
  if (!msg) {
    errorBox.classList.add('hidden');
    errorBox.textContent = '';
    return;
  }
  errorBox.classList.remove('hidden');
  errorBox.textContent = msg;
}

document.getElementById('searchBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) { showError('Please enter a city'); return; }
  fetchWeatherByCity(city);
});

document.getElementById('geoBtn').addEventListener('click', () => {
  if (!navigator.geolocation) { showError('Geolocation not supported'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
  }, err => showError('Geolocation permission denied or unavailable'));
});

// Optionally search a demo city on load
window.addEventListener('DOMContentLoaded', () => {
  // fetchWeatherByCity('New Delhi');
});
