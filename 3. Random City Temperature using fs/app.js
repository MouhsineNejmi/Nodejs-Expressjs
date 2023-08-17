const cities = require("./cities");
const fs = require("fs");

let cityNameFromText = fs.readFileSync("./input.txt").toString();

const selectCityFromInput = (cities, cityName) =>
  cities.filter((city) => city.name === cityName)[0];

const getCityTemperature = async () => {
  const selectedCity = await selectCityFromInput(cities, cityNameFromText);
  const { name, lat, lng } = await selectedCity;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${Number(
    lat
  )}&longitude=${Number(lng)}&current_weather=true`;
  const response = await fetch(url);
  const data = await response.json();

  console.log(
    `The temperature in ${name} today is ${data.current_weather.temperature} °C`
  );
};

getCityTemperature();
