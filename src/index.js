import 'dotenv/config';
import { 
  TomorrowIOWeatherData, 
  OWMWeatherData, 
  NWSWeatherData, 
  AccuWeatherData, 
  WeatherAPIData, 
  WeatherbitData, 
  VisualCrossingData, 
  OpenMeteoData 
} from './utils/fetch_weather_data.js';
import { objectToCsv } from './utils/csv.js';

const main = async () => {
  try {
    // Fetch data from all sources independently
    const weatherSources = [
      { name: 'Tomorrow.io', fetch: TomorrowIOWeatherData },
      { name: 'OpenWeatherMap', fetch: OWMWeatherData },
      { name: 'National Weather Service', fetch: NWSWeatherData },
      { name: 'AccuWeather', fetch: AccuWeatherData },
      { name: 'WeatherAPI', fetch: WeatherAPIData },
      { name: 'Weatherbit', fetch: WeatherbitData },
      { name: 'Visual Crossing', fetch: VisualCrossingData },
      { name: 'Open-Meteo', fetch: OpenMeteoData }
    ];

    // First, collect all unique dates from all sources
    const allDates = new Set();
    
    // Fetch data from each source independently
    for (const source of weatherSources) {
      try {
        console.log(`\nAttempting to fetch from ${source.name}...`);
        const data = await source.fetch();
        if (!data || data.length === 0) {
          console.error(`No data received from ${source.name}`);
          continue;
        }
        // Add all dates to the set
        data.forEach(item => allDates.add(item.date));
        console.log(`Successfully fetched ${data.length} days of data from ${source.name}`);
      } catch (error) {
        console.error(`Error fetching data from ${source.name}:`, error.message);
      }
    }

    // Create a map with all dates initialized with empty strings for all sources
    const dateMap = new Map();
    Array.from(allDates).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
      const dateObj = { date };
      // Initialize all source names with empty strings
      weatherSources.forEach(source => {
        dateObj[source.name] = "";
      });
      dateMap.set(date, dateObj);
    });

    // Helper function to add data to the map
    const addToMap = (data, source) => {
      console.log(`\nAdding data from ${source}:`);
      console.log('Sample data:', data.slice(0, 2));
      
      data.forEach(item => {
        if (dateMap.has(item.date)) {
          dateMap.get(item.date)[source] = item.maxTemperature;
        }
      });
    };

    // Now fetch data again and add it to the map
    for (const source of weatherSources) {
      try {
        const data = await source.fetch();
        if (data && data.length > 0) {
          addToMap(data, source.name);
        }
      } catch (error) {
        console.error(`Error fetching data from ${source.name}:`, error.message);
      }
    }

    // Convert map to array
    const combinedData = Array.from(dateMap.values());

    console.log('\nFinal combined data sample:');
    console.log(combinedData.slice(0, 2));

    // Get today's date for the filename
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '_');

    // Save to CSV
    await objectToCsv(combinedData, `./data/weather_data_${dateStr}.csv`);
    console.log('\nWeather data saved successfully!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
};

main();