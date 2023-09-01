const cities = require("./cities");
const fs = require("fs");

let cityNameFromText = fs.readFileSync("./input.txt").toString();

const selectCityFromInput = (cities, cityName) =>
  cities.filter((city) => city.name === cityName)[0];

const getCityTemperature = async () => {
  const selectedCity = await selectCityFromInput(cities, cityNameFromText);

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${Number(
      selectedCity.lat
    )}&longitude=${Number(selectedCity.lng)}&current_weather=true`;
    const response = await fetch(url);
    const data = await response.json();
    const temperature = data.current_weather.temperature;

    let fileContent = `The temperature is ${temperature} degrees Celsius in ${selectedCity.name}`;

    if (fs.existsSync(`${selectedCity.name}.txt`)) {
      fs.unlink(`${selectedCity.name}.txt`, (err) => {
        if (err) throw err;
      });
    }

    fs.writeFile(
      `${selectedCity.name}.txt`,
      fileContent,
      "utf8",
      (err, data) => {
        if (err) throw err;
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

getCityTemperature();
