import {
	CustomMarker,
	CustomMeasure,
	CustomRange,
} from '@/components/nivoComponents';
import WeatherCurrent from '@/types/current';
import { ResponsiveBullet } from '@nivo/bullet';
import axios from 'axios';
import { format, hoursToMilliseconds } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

import HourlyWeatherStyles from '@/styles/weather';

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
		<main className="flex flex-col bg-slate-800 h-max">
			<h1 className="font-bold flex justify-center gap-2 text-white">
				<span>Raindrop</span>
				<Image
					src="/RainDrop.svg"
					alt="The RainDrop Logo"
					height="30"
					width="30"
					className="inline-block"
				/>
			</h1>

			{weather ? (
				<>
					<WeatherHeader weather={weather} />
					<WeatherHourly weather={weather} />
					<WeatherForecast weather={weather} />
				</>
			) : null}
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

const WeatherForecast: FC<{ weather: WeatherCurrent }> = ({ weather }) => {
	return (
		<section className="px-2 text-white text-xs">
			<p className="text-center pb-4">10 Day Forecast</p>

			<div className="flex flex-col gap-2 font-bold">
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
									<span className="flex flex-row items-center w-full col-start-2 col-end-4 justify-center">
										<Image
											src="/weather/64x64/day/308.png"
											width="20"
											height="20"
											alt="Rain"
										/>
										{forecastDay.day.daily_chance_of_rain}%
									</span>
									<span className="text-right col-start-4 col-end-5 mr-2 self-center">
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
													markers: index === 0 ? [weather.current.temp_f] : [],
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
									<span className="ml-2 col-start-8 col-end-9 self-center">
										{forecastDay.day.maxtemp_f}°F
									</span>
								</div>
							);
					  })}
			</div>
		</section>
	);
};

const WeatherHourly: FC<{ weather: WeatherCurrent }> = ({ weather }) => {
	const dayInMilli = hoursToMilliseconds(24);
	const currentTime = weather.location.localtime_epoch;
	const imageSize = 64;
	const weather24Hr = [
		...weather.forecast?.forecastday[0].hour!,
		...weather.forecast?.forecastday[1].hour!,
	]
		.sort((a, b) => {
			return a.time_epoch - b.time_epoch;
		})
		.filter((weatherDay) => {
			return currentTime < weatherDay.time_epoch && currentTime;
		})
		.slice(0, 24)
		.map((weatherDay) => {
			return {
				icon: weatherDay.condition.icon,
				temp: weatherDay.temp_f,
				time: weatherDay.time_epoch,
			};
		});

	return (
		<>
			<HourlyWeatherStyles className="flex flex-row overflow-x-auto text-white bg-gray-600 h-[10rem] gap-4 my-4 -scroll weather-styles">
				{weather24Hr.map((day, index) => (
					<div
						key={index}
						className="shrink-0 basis-auto flex flex-col text-center justify-evenly"
					>
						<span>{format(new Date(0).setUTCSeconds(day.time), 'h a')}</span>
						<Image
							src={`https:${day.icon}`}
							width={imageSize}
							height={imageSize}
							alt="Weather condition"
						/>
						<span>{day.temp}°F</span>
					</div>
				))}
			</HourlyWeatherStyles>
		</>
	);
};
