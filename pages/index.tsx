import WeatherCurrent from '@/types/current';
import axios from 'axios';
import Image from 'next/image';
import { FC, useState } from 'react';

export default function Home() {
  const [weather, setWeather] = useState<WeatherCurrent>();

  const getWeather = async () => {
    return navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const { data } = await axios.get(`/api/current`, {
          params: { q: `${latitude},${longitude}` },
        });
        setWeather(data);
      },
      console.error,
      { timeout: 5000 }
    );
  };

  return (
    <main className="flex flex-col ">
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

      {weather ? <WeatherHeader weather={weather} /> : null}

      <button
        className="w-11/12 bg-blue-500 p-2 rounded-md text-white text-center mx-auto"
        onClick={getWeather}
      >
        Get Weather
      </button>
    </main>
  );
}

const WeatherHeader: FC<{ weather: WeatherCurrent }> = ({ weather }) => {
  return (
    <div className="mx-auto w-11/12 grid grid-cols-2 grid-rows-3 bg-purple-800 text-white rounded-xl opacity-75 mb-4 border-4 border-blue-500 border-opacity-40">
      <h2 className="text-2xl col-span-1 text-center self-center font-bold">
        {weather.location.name}
      </h2>
      <Image
        src={`https:${weather.current.condition.icon}`}
        className="col-span-1 self-center place-self-end mr-4 w-[75px]"
        alt="Weather Icon"
        width="50"
        height="50"
      />
      <span className="text-6xl col-span-2 text-center self-center">
        {weather.current.temp_f}°F
      </span>
      <p className="col-span-2 text-center self-center">
        {weather.current.condition.text}
      </p>
    </div>
  );
};
