import { celsiusToFahrenheit } from "./index.js";

export async function TomorrowIOWeatherData() {
  const weatherData = await fetch(
    `https://api.tomorrow.io/v4/weather/forecast?location=30.2672,-97.7431&apikey=${process.env.TOMORROW_API_KEY}`
  ).then((res) => res.json());

  // Get the daily timeline data
  const dailyData = weatherData.timelines.daily;

  // Process each day's data to get max temperatures
  const maxTemperatures = dailyData.map((day) => {
    const date = new Date(day.time).toLocaleDateString();
    const maxTemp = (day.values.temperatureMax * 9) / 5 + 32; // Convert to Fahrenheit
    return {
      date,
      maxTemperature: maxTemp,
    };
  });

  return maxTemperatures;
}

export async function NWSWeatherData() {
  try {
    // Step 1: Get forecast office grid from lat/lon
    const pointRes = await fetch(
      "https://api.weather.gov/points/30.2672,-97.7431",
      {
        headers: { "User-Agent": process.env.EMAIL }, // required!
      }
    );
    const pointData = await pointRes.json();
    const forecastUrl = pointData.properties.forecast;
    console.log(forecastUrl)
    // Step 2: Get forecast
    const forecastRes = await fetch(forecastUrl, {
      headers: { "User-Agent": process.env.EMAIL },
    });
    const forecastData = await forecastRes.json();

    // Process each day's data to get max temperatures
    const maxTemperatures = forecastData.properties.periods
      .filter((period) => period.isDaytime) // Only get daytime periods
      .map((period) => ({
        date: new Date(period.startTime).toLocaleDateString(),
        maxTemperature: period.temperature,
      }));

    return maxTemperatures;
  } catch (error) {
    console.error("Error fetching NWS weather data:", error);
    throw error;
  }
}

export async function OWMWeatherData() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=30.2672&lon=-97.7431&appid=${process.env.OWM_API_KEY}&units=imperial`;
    const res = await fetch(url);
    const data = await res.json();

    // Group forecasts by date and get max temperature for each day
    const maxTemperatures = data.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      const temp = item.main.temp_max;

      // If we haven't seen this date yet, or if this temp is higher than what we have
      if (!acc[date] || temp > acc[date].maxTemperature) {
        acc[date] = {
          date,
          maxTemperature: temp,
        };
      }

      return acc;
    }, {});

    // Convert the object to an array and sort by date
    return Object.values(maxTemperatures).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  } catch (error) {
    console.error("Error fetching OWM weather data:", error);
    throw error;
  }
}

export async function AccuWeatherData() {
  try {
    // Step 1: Get location key
    const locRes = await fetch(
      `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.ACCU_WEATHER_API_KEY}&q=30.2672,-97.7431`
    );
    const locData = await locRes.json();
    const locationKey = locData[0].Key;

    // Step 2: Get 5-day forecast
    const forecastRes = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${process.env.ACCU_WEATHER_API_KEY}&details=true`
    );
    const forecast = await forecastRes.json();

    // Process each day's data to get max temperatures
    const maxTemperatures = forecast.DailyForecasts.map(day => ({
      date: new Date(day.Date).toLocaleDateString(),
      maxTemperature: day.Temperature.Maximum.Value
    }));

    return maxTemperatures;
  } catch (error) {
    console.error("Error fetching AccuWeather data:", error);
    throw error;
  }
}

export async function WeatherAPIData() {
  try {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=30.2672,-97.7431&days=7`;
    const res = await fetch(url);
    const data = await res.json();
    // Process each day's data to get max temperatures
    const maxTemperatures = data.forecast.forecastday.map(day => ({
      date: new Date(day.date).toLocaleDateString(),
      maxTemperature: day.day.maxtemp_f
    }));

    return maxTemperatures;
  } catch (error) {
    console.error("Error fetching WeatherAPI data:", error);
    throw error;
  }
}

export async function WeatherbitData() {
  try {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=30.2672&lon=-97.7431&key=${process.env.WEATHER_BIT_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    // Process each day's data to get max temperatures
    const maxTemperatures = data.data.map(day => ({
      date: new Date(day.datetime).toLocaleDateString(),
      maxTemperature: celsiusToFahrenheit(day.max_temp)
    }));

    return maxTemperatures;
  } catch (error) {
    console.error("Error fetching Weatherbit data:", error);
    throw error;
  }
}

export async function VisualCrossingData() {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/30.2672,-97.7431/next7days?unitGroup=us&key=${process.env.VISUAL_CROSSING_API_KEY}&include=days`;
    const res = await fetch(url);
    const data = await res.json();

    // Process each day's data to get max temperatures
    const maxTemperatures = data.days.map(day => ({
      date: new Date(day.datetime).toLocaleDateString(),
      maxTemperature: day.tempmax
    }));

    return maxTemperatures;
  } catch (error) {
    console.error("Error fetching Visual Crossing data:", error);
    throw error;
  }
}

export async function OpenMeteoData() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&daily=temperature_2m_max&timezone=auto&forecast_days=7`;
    const res = await fetch(url);
    const data = await res.json();

    // Process each day's data to get max temperatures
    const maxTemperatures = data.daily.time.map((date, index) => ({
      date: new Date(date).toLocaleDateString(),
      maxTemperature: celsiusToFahrenheit(data.daily.temperature_2m_max[index])
    }));

    return maxTemperatures;
  } catch (error) {
    console.error("Error fetching Open-Meteo data:", error);
    throw error;
  }
}