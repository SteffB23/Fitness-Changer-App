import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';
import { getSunTimes } from '../utils/weather';

interface SunTime {
  sunrise: string;
  sunset: string;
}

export function SunTimes() {
  const [sunTimes, setSunTimes] = React.useState<SunTime | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function loadSunTimes() {
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
          const times = await getSunTimes(latitude, longitude);
          
          if (!mounted) return;
          setSunTimes(times);
        } else {
          // Use New York coordinates as fallback
          const times = await getSunTimes(40.7128, -74.0060);
          setSunTimes(times);
        }
      } catch (err) {
        console.error('Error fetching sun times:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSunTimes();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-3 border-t">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!sunTimes) return null;

  return (
    <div className="px-4 py-3 border-t">
      <div className="flex justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <Sunrise className="h-5 w-5 text-amber-500" />
          <span className="text-sm text-gray-600">{sunTimes.sunrise}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Sunset className="h-5 w-5 text-orange-500" />
          <span className="text-sm text-gray-600">{sunTimes.sunset}</span>
        </div>
      </div>
    </div>
  );
}