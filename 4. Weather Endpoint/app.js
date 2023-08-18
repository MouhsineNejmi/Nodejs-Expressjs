const http = require("http");
const url = require("url");
const cities = require("./cities");
const { getCityTemperature } = require("./weatherApi");

const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.path && req.method === "GET") {
    const cityName = parsedUrl.query.city;

    if (!cityName) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "City parameter is required" }));
    } else if (cities.indexOf(cityName)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "City not found" }));
    } else {
      getCityTemperature(cityName)
        .then((temperature) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ city: cityName, temperature: temperature }));
        })
        .catch((error) => {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Error fetching weather data" }));
        });
    }
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
};

const server = http.createServer(requestHandler);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
