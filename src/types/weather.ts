export interface WeatherForecast {
  day: string;
  temp: number;
  condition: string;
  icon: string;
  description: string;
}

export interface WeatherError {
  message: string;
}