const express = require("express");
const Datastore = require("nedb");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("database.db");
database.loadDatabase();

app.post("/api", (req, res) => {
  const { latitude, longitude, weather, air_quality } = req.body;
  const timeStamp = Date.now();

  req.body.timeStamp = timeStamp;

  database.insert(req.body);

  res.status(200).json({
    status: "success",
    timeStamp: timeStamp,
    latitudine: latitude,
    longitudine: longitude,
    weather: weather,
    air_quality: air_quality
  });
});

app.get("/api", (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }
    res.status(200).json(data);
  });
});

app.get("/weather/:latlon", async (req, res) => {
  const latlon = req.params.latlon.split(",");
  const lat = latlon[0];
  const lon = latlon[1];

  const api_key = process.env.API_KEY;
  const weather_key = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}?units=si`;
  const weather_response = await fetch(weather_key);
  const weather_data = await weather_response.json();

  const aq_key = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const aq_response = await fetch(aq_key);
  const aq_data = await aq_response.json();

  const data = {
    weather: weather_data,
    air_quality: aq_data
  };

  res.json(data);
});

app.listen(3000, () => console.log("Listen port 3000"));
