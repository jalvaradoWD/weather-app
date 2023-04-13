import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [weather, setWeather] = useState({});

  const getCurrentWeather = async () => {
    let currLoc: GeolocationPosition;
    navigator.geolocation.getCurrentPosition(async (position) => {
      currLoc = position;
      const url = `/api/current?q=${currLoc.coords.latitude},${currLoc.coords.longitude}`;

      const res = await axios.get(url);

      setWeather(res.data);
    }, null);
    console.log(weather);
  };

  return (
    <main>
      <h1 className="text-center font-bold">Raindrop</h1>
      <Image
        src="/RainDrop.svg"
        alt="The RainDrop Logo"
        height="300"
        width="300"
      />
      <div className="current-weather"></div>
      <button onClick={getCurrentWeather}>Get Current Weather</button>
    </main>
  );
}
