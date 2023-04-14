import WeatherCurrent from '@/types/current';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [weather, setWeather] = useState<WeatherCurrent>();
  const [weatherError, setWeatherError] = useState<GeolocationPositionError>();

  const getWeather = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const { data } = await axios.get(`/api/current`, {
          params: { q: `${latitude},${longitude}` },
        });
        setWeather(data);
      },
      async (err) => {
        console.error(err);
        setWeatherError(err);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <main>
      <h1 className="font-bold flex justify-center gap-2">
        <span>Raindrop</span>
        <Image
          src="/RainDrop.svg"
          alt="The RainDrop Logo"
          height="30"
          width="30"
          className="inline-block"
        />
      </h1>

      <div className="weather">
        {weather ? (
          <>
            <h2 className="text-2xl">{weather.location.name}</h2>
            <div className="condition">
              <Image
                src={`https:${weather.current.condition.icon}`}
                alt="Weather Icon"
                width="50"
                height="50"
              />
              <span className="text-2xl">{weather.current.temp_f}°F</span>
            </div>
            <p>Last Update: {weather.current.last_updated}</p>
          </>
        ) : null}
      </div>

      <button
        type="button"
        className="text-center p-2 bg-blue-600 text-white rounded-md"
        onClick={getWeather}
      >
        Get Weather
      </button>
    </main>
  );
}
