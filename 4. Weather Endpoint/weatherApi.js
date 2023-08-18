const cities = require("./cities");

const selectCityFromQuery = (cities, cityName) =>
  cities.filter(
    (city) => city.name.trim().toLowerCase() === cityName.trim().toLowerCase()
  )[0];

const getCityTemperature = async (cityName) => {
  const selectedCity = await selectCityFromQuery(cities, cityName);
  if (!selectedCity) {
    console.log("city not found");
    return;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${Number(
      selectedCity.lat
    )}&longitude=${Number(selectedCity.lng)}&current_weather=true`;
    const response = await fetch(url);
    const data = await response.json();
    const temperature = data.current_weather.temperature;

    return temperature;
  } catch (error) {
    throw new Error("Error fetching weather data");
  }
};

module.exports = { getCityTemperature };
