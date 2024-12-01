import { format, addDays } from 'date-fns';
import type { WeatherForecast } from '../types/weather';

// OpenWeatherMap API key
const API_KEY = 'dc19c4b3e592f0fb95051dbb1bc9869a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache'
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Weather API error: ${errorData.message || response.status}`);
    }

    const data = await response.json();
    
    if (!data.list || !Array.isArray(data.list)) {
      throw new Error('Invalid weather data format');
    }

    const dailyForecasts: WeatherForecast[] = [];
    const today = new Date();

    // Get one forecast per day for the next 5 days
    for (let i = 0; i < 5; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find the noon forecast for each day (most representative)
      const dayData = data.list.find((item: any) => 
        item.dt_txt.startsWith(dateStr) && item.dt_txt.includes('12:00:00')
      ) || data.list.find((item: any) => item.dt_txt.startsWith(dateStr)); // fallback to any time

      if (dayData) {
        dailyForecasts.push({
          day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(date, 'EEE'),
          temp: Math.round(dayData.main.temp),
          condition: mapWeatherCondition(dayData.weather[0].main),
          icon: dayData.weather[0].icon,
          description: dayData.weather[0].description,
        });
      }
    }

    if (dailyForecasts.length === 0) {
      throw new Error('No forecast data available');
    }

    return dailyForecasts;
  } catch (error) {
    console.error('Error fetching weather:', error);
    // Return mock data as fallback
    return getMockForecast();
  }
}

export async function getSunTimes(lat: number, lon: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch sun times');
    }

    const data = await response.json();
    
    if (!data.sys?.sunrise || !data.sys?.sunset) {
      throw new Error('Invalid sun times data');
    }

    // Convert Unix timestamps to formatted times
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);

    return {
      sunrise: format(sunrise, 'h:mm a'),
      sunset: format(sunset, 'h:mm a')
    };
  } catch (error) {
    console.error('Error fetching sun times:', error);
    // Return mock data as fallback
    return {
      sunrise: '6:30 AM',
      sunset: '7:30 PM'
    };
  }
}

function getMockForecast(): WeatherForecast[] {
  const today = new Date();
  return [
    {
      day: 'Today',
      temp: 72,
      condition: 'sunny',
      icon: '01d',
      description: 'Clear sky'
    },
    {
      day: 'Tomorrow',
      temp: 68,
      condition: 'partly-cloudy',
      icon: '02d',
      description: 'Few clouds'
    },
    {
      day: format(addDays(today, 2), 'EEE'),
      temp: 65,
      condition: 'cloudy',
      icon: '03d',
      description: 'Scattered clouds'
    },
    {
      day: format(addDays(today, 3), 'EEE'),
      temp: 70,
      condition: 'rainy',
      icon: '10d',
      description: 'Light rain'
    },
    {
      day: format(addDays(today, 4), 'EEE'),
      temp: 75,
      condition: 'sunny',
      icon: '01d',
      description: 'Clear sky'
    }
  ];
}

function mapWeatherCondition(condition: string): string {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'sunny';
    case 'clouds':
      return 'cloudy';
    case 'rain':
    case 'drizzle':
      return 'rainy';
    case 'snow':
      return 'snowy';
    default:
      return 'partly-cloudy';
  }
}