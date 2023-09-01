const cities = require("./cities");

const selectRandomCity = (cities) => {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
};

const getCityTemperatures = async () => {
  const randomCity = await selectRandomCity(cities);
  const { name, lat, lng } = await randomCity;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${Number(
    lat
  )}&longitude=${Number(lng)}&current_weather=true`;
  const response = await fetch(url);
  const data = await response.json();

  console.log(
    `The temperature in ${name} today is ${data.current_weather.temperature} °C`
  );
};

getCityTemperatures();
