const celsius = document.querySelector("#celsius");
const windspeed = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");
const feelslike = document.querySelector("#feelslike");
const city = document.querySelector("#location");
const searchcity = document.querySelector(".searchbtn");
const background = document.querySelector(".sec");
const maxtemp = document.querySelector("#boxmaxtemp");
const mintemp = document.querySelector("#boxmintemp");
const rain = document.querySelector("#rain");
const precipitation = document.querySelector("#precipitation");
const days = document.querySelectorAll(".days");
const maxTemps = document.querySelectorAll(".maxTemp");
const minTemps = document.querySelectorAll(".minTemp");
const icons = document.querySelectorAll(".weather-icon");
const currenticon = document.querySelector(".currentweather-icon");
const cityOption = document.querySelector("#cityoption");


async function getWeatherByCity(cityname) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityname)}&count=1&language=en&format=json`;

    let response = await fetch(geoUrl);
    let data = await response.json();

    city.innerText = `${data.results[0].name}, ${data.results[0].country}`;

    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;

    const weatherurl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,temperature_2m,rain,apparent_temperature,relative_humidity_2m,is_day,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto`;

    let weatherresponse = await fetch(weatherurl);
    let weatherdata = await weatherresponse.json();

    if (weatherdata.current.is_day === 0) {
        background.style.backgroundImage = "url('NightSky.png')"
    }
    celsius.innerText = `${Math.round(weatherdata.current.temperature_2m)}`;
    windspeed.innerText = `${Math.round(weatherdata.current.wind_speed_10m)} km/h`;
    humidity.innerText = `${weatherdata.current.relative_humidity_2m}%`;
    feelslike.innerText = `${Math.round(weatherdata.current.apparent_temperature)}°C`;
    maxtemp.innerText = `${Math.round(weatherdata.daily.temperature_2m_max[0])}°C`;
    mintemp.innerText = `${Math.round(weatherdata.daily.temperature_2m_min[0])}°C`;
    precipitation.innerText = `${Math.round(weatherdata.current.precipitation)} mm`;
    rain.innerText = `${Math.round(weatherdata.current.rain)} mm`;

    for (let i = 0; i < 5; i++) {
        const date = new Date(weatherdata.daily.time[i + 1]);

        days[i].innerText = date.toLocaleDateString("en-US", {
            weekday: "short"
        });
        maxTemps[i].innerText = `${Math.round(weatherdata.daily.temperature_2m_max[i + 1])}°C`;
        minTemps[i].innerText = `${Math.round(weatherdata.daily.temperature_2m_min[i + 1])}°C`;

        icons[i].src = weatherIcons[weatherdata.daily.weather_code[i + 1]];
    }

    currenticon.src = weatherIcons[weatherdata.current.weather_code];

    console.log(weatherdata)
} getWeatherByCity("muzaffarpur");

searchcity.addEventListener("click", () => {
    const cityname = document.querySelector("#inputcity").value;
    getWeatherByCity(cityname);


});
const inputCity = document.querySelector("#inputcity");

inputCity.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeatherByCity(inputCity.value);
    }
});


cityOption.addEventListener("change", () => {
    getWeatherByCity(cityOption.value);
});

