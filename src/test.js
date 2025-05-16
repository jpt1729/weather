import "dotenv/config";

import {
  NWSWeatherData,
  AccuWeatherData,
  WeatherAPIData,
  WeatherbitData,
  VisualCrossingData,
  OpenMeteoData,
} from "./utils/fetch_weather_data.js";

const main = async () => {
  const test = await NWSWeatherData();

  console.log(test);
};

main();
