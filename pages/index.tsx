import WeatherCurrent from '@/types/current';
import {
  BulletRectsItemProps,
  ResponsiveBullet,
  BulletMarkersItemProps,
} from '@nivo/bullet';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

export default function Home() {
  const [weather, setWeather] = useState<WeatherCurrent>();

  const getWeather = async () => {
    return navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const { data } = await axios.get<WeatherCurrent>(`/api/forecast`, {
          params: { q: `${latitude},${longitude}`, days: 10 },
        });
        setWeather(data);
      },
      console.error,
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <main className="flex flex-col bg-slate-800 h-screen">
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

      <section className="px-2">
        <p className="text-center pb-4">10 Day Forecast</p>

        <section className="flex flex-col gap-2 font-bold">
          {!weather
            ? null
            : weather.forecast?.forecastday.map((forecastDay, index) => {
                return (
                  <div key={index} className="grid grid-cols-8">
                    <span className="text-left col-start-1 col-end-2 self-center">
                      {index !== 0
                        ? formatInTimeZone(
                            new Date(`${forecastDay.date} CST`),
                            weather.location.tz_id,
                            'EEE'
                          )
                        : 'Today'}
                    </span>
                    <span className="flex flex-row items-center">
                      <Image
                        src="/weather/64x64/day/308.png"
                        width="20"
                        height="20"
                        alt="Rain"
                      />
                      {forecastDay.day.daily_chance_of_rain}%
                    </span>
                    <span className="text-right col-start-4 col-end-5 mr-4 self-center">
                      {forecastDay.day.mintemp_f}°F
                    </span>
                    <span className="col-start-5 col-end-8">
                      <ResponsiveBullet
                        data={[
                          {
                            title: '',
                            id: '123',
                            measures: [
                              forecastDay.day.mintemp_f,
                              forecastDay.day.maxtemp_f,
                            ],
                            ranges: [],
                            markers:
                              index === 0 ? [weather.current.temp_f] : [],
                          },
                        ]}
                        isInteractive={false}
                        layout="horizontal"
                        minValue={weather.current.temp_f - 25}
                        maxValue={weather.current.temp_f + 25}
                        rangeColors={['rgba(125,125,125,.8)']}
                        rangeComponent={CustomRange}
                        markerColors={'black'}
                        markerComponent={CustomMarker}
                        measureColors={['rgba(0,0,0,0)', 'white']}
                        measureBorderWidth={10}
                        measureBorderColor={'green'}
                        measureComponent={CustomMeasure}
                      />
                    </span>
                    <span className="text-center col-start-8 col-end-9 self-center">
                      {forecastDay.day.maxtemp_f}°F
                    </span>
                  </div>
                );
              })}
        </section>
      </section>
    </main>
  );
}

const WeatherHeader: FC<{ weather: WeatherCurrent }> = ({ weather }) => {
  return (
    <div className="mx-auto w-full bg-green-600 text-white mb-4 flex flex-col gap-4 py-4">
      <h2 className="text-2xl col-span-1 text-center self-center font-bold relative right-[-25px]">
        <span className="inline-block text-center">
          {weather.location.name}
        </span>
        <Image
          src={`https:${weather.current.condition.icon}`}
          className="inline-block"
          alt="Weather Icon"
          width="50"
          height="50"
        />
      </h2>

      <span className="text-6xl col-span-2 text-center self-center">
        {weather.current.temp_f}°F
      </span>
      <p className="col-span-2 text-center self-center">
        {weather.current.condition.text}
      </p>
    </div>
  );
};

const CustomMeasure: FC<BulletRectsItemProps> = ({
  x,
  y,
  width,
  height,
  color,
}) => {
  return (
    <rect
      x={x}
      y={y}
      rx={5}
      width={width}
      height={height}
      strokeLinejoin="round"
      fill={color}
    ></rect>
  );
};

const CustomRange: FC<BulletRectsItemProps> = ({
  x,
  y,
  width,
  height,
  color,
}) => {
  return (
    <rect
      x={x}
      y={y}
      rx={7}
      width={width}
      height={height}
      strokeLinejoin="round"
      fill={color}
    ></rect>
  );
};

const CustomMarker: FC<BulletMarkersItemProps> = ({ x, y, color }) => {
  return (
    <rect x={x} y={y + 3} ry={5} strokeLinejoin="round" fill={color}></rect>
  );
};
