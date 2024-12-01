import React from 'react';
import { Cloud, CloudRain, Sun, CloudSun, Snowflake } from 'lucide-react';
import { getForecast } from '../utils/weather';
import type { WeatherForecast } from '../types/weather';

export function Weather() {
  const [forecast, setForecast] = React.useState<WeatherForecast[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadWeather() {
      try {
        if ('geolocation' in navigator) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 0,
              enableHighAccuracy: true
            });
          });

          if (!mounted) return;

          const { latitude, longitude } = position.coords;
          const data = await getForecast(latitude, longitude);
          
          if (!mounted) return;
          
          setForecast(data);
          setError(null);
        } else {
          throw new Error('Geolocation not supported');
        }
      } catch (err) {
        if (!mounted) return;

        // Use New York coordinates as fallback
        try {
          const data = await getForecast(40.7128, -74.0060);
          setForecast(data);
          setError('Using default location (New York)');
        } catch (fallbackErr) {
          setError('Unable to fetch weather data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      mounted = false;
    };
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-5 w-5" />;
      case 'partly-cloudy':
        return <CloudSun className="h-5 w-5" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5" />;
      case 'rainy':
        return <CloudRain className="h-5 w-5" />;
      case 'snowy':
        return <Snowflake className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-t">
      <h3 className="text-sm font-medium text-gray-500 mb-3">5-Day Forecast</h3>
      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}
      <div className="space-y-2">
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-600 w-20">{day.day}</span>
            <span className="text-gray-400" title={day.description}>
              {getWeatherIcon(day.condition)}
            </span>
            <span className="text-gray-600 w-12 text-right">{day.temp}°F</span>
          </div>
        ))}
      </div>
    </div>
  );
}