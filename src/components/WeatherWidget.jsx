import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSun, MapPin, Sun } from "lucide-react";

const weatherLabels = {
  0: ["Clear skies", Sun],
  1: ["Mostly clear", CloudSun],
  2: ["Partly cloudy", CloudSun],
  3: ["Overcast", Cloud],
  45: ["Misty", Cloud],
  48: ["Misty", Cloud],
  51: ["Light drizzle", CloudRain],
  53: ["Drizzle", CloudRain],
  55: ["Heavy drizzle", CloudRain],
  61: ["Light rain", CloudRain],
  63: ["Rain", CloudRain],
  65: ["Heavy rain", CloudRain],
  80: ["Rain showers", CloudRain],
  81: ["Rain showers", CloudRain],
  82: ["Heavy showers", CloudRain],
};

function getWeatherLabel(code) {
  return weatherLabels[code] || ["Changing skies", CloudSun];
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const params = new URLSearchParams({ latitude: coords.latitude, longitude: coords.longitude, current: "temperature_2m,weather_code", timezone: "auto" });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        if (!response.ok) throw new Error("Weather request failed");
        const result = await response.json();
        setWeather(result.current);
        setStatus("ready");
      } catch {
        setStatus("unavailable");
      }
    }, () => setStatus("unavailable"), { enableHighAccuracy: false, timeout: 8000, maximumAge: 900000 });
  }, []);

  if (status === "loading") return <div className="weather-note"><CloudSun size={16} /><div><strong>Reading weather</strong><span>Looking outside...</span></div></div>;
  if (status !== "ready") return <div className="weather-note"><MapPin size={16} /><div><strong>Reading weather</strong><span>Allow location for local skies</span></div></div>;

  const [label, Icon] = getWeatherLabel(weather.weather_code);
  return <div className="weather-note"><Icon size={16} /><div><strong>Reading weather</strong><span>{label}, {Math.round(weather.temperature_2m)}°C</span></div></div>;
}
