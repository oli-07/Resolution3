const background = document.getElementById("background");
const time = document.getElementById("time");
const weather = document.getElementById("weather");

async function getBackground() {
  const url =
    "https://api.nasa.gov/planetary/apod?api_key=qF2xtffJ6XiUgz0UcWsXzjLHo1UZQSK41EWMegeQ";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);

    if (result.media_type !== "image") {
      console.log("APOD returned a non-image media type.");
      return null;
    }

    return result.url;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

window.onload = function () {
  getBackground().then(function (imageUrl) {
    if (!imageUrl) return;

    if (background) {
      background.style["background-image"] = `url('${imageUrl}')`;
    }
  });
};

function updateTime() {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const localMillis = now.getTime() - offsetMinutes * 60 * 1000;

  const msInDay = 24 * 60 * 60 * 1000;
  const msInHour = 60 * 60 * 1000;
  const msInMinute = 60 * 1000;

  const dayMillis = localMillis % msInDay;
  const hours = Math.floor(dayMillis / msInHour);
  const minutes = Math.floor((dayMillis % msInHour) / msInMinute);
  const seconds = Math.floor((dayMillis % msInMinute) / 1000);

  time.innerText = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

updateTime();
setInterval(updateTime, 1000);

function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
      return null;
    });
}

function updateWeather() {
  navigator.geolocation.getCurrentPosition(async function (position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log("lat:", lat, "lon", lon);

    const data = await getWeather(lat, lon);
console.log(data);

    if (!data || !data.current) return;

    const temp = data.current.temperature_2m;
const wind = data.current.wind_speed_10m;
    weather.innerText = `${Math.round(temp)}°F ${Math.round(wind)} MPH`;
  });
}

updateWeather();
setInterval(updateWeather, 10 * 60 * 1000);

const fact = document.getElementById("fact");

async function getFact() {
    try {
        const response = await fetch ("https://meowfacts.herokuapp.com");
        if (!response.ok) {
            throw new Error (`response status: ${response.status}`);
        }

        const data = await response.json();
        return data.data[0];
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

function updateFact() {
    getFact().then(function (catFact) {
        if (!catFact || !fact) return;
        fact.innerText = catFact;
    });
}

updateFact();

const sun = document.getElementById("sun");

async function getSun(lat,lon) {
   const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
  try{
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status:${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

function updateSun() {
  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const data = await getSun(lat, lon);
      if (!data || !data.results) return;

      const sunrise = new Date(data.results.sunrise);
      const sunset = new Date(data.results.sunset);

      sun.innerText = `Sunrise: ${sunrise.toLocaleTimeString()} | Sunset: ${sunset.toLocaleTimeString()}`;
    },
    function (error) {
      console.log ("Geolocation error:", error.message);
    }
  );
}

updateSun();