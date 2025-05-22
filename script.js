async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  // IMPORTANT: Insert your OpenWeatherMap API key below
  const apiKey = "YOUR_API_KEY_HERE"; // <-- Replace with your real API key before running locally
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  if (!city) {
    document.getElementById("result").innerHTML = `<p class="text-danger">Please enter a city name.</p>`;
    return;
  }

  document.getElementById("result").innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    const temp = data.main.temp;
    const weather = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.getElementById("result").innerHTML = `
      <h4>Weather in ${data.name}</h4>
      <img src="${iconUrl}" alt="Weather icon">
      <p>Temperature: ${temp}°C</p>
      <p>Condition: ${weather}</p>
    `;
    addToHistory(data.name);
  } catch (error) {
    document.getElementById("result").innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
}

function addToHistory(city) {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    renderHistory();
  }
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  const historyDiv = document.getElementById('history');
  if (!history.length) {
    historyDiv.innerHTML = '<p>No search history.</p>';
    return;
  }
  historyDiv.innerHTML = history.map(city => `<button class="history-btn" onclick="searchFromHistory('${city}')">${city}</button>`).join(' ') + '<br><button onclick="clearHistory()" class="clear-btn">Clear History</button>';
}

function searchFromHistory(city) {
  document.getElementById("cityInput").value = city;
  getWeather();
}

function clearHistory() {
  localStorage.removeItem('weatherHistory');
  renderHistory();
}

window.onload = renderHistory;
