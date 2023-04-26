import WeatherCurrent from '@/types/current';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
	FeelsLike,
	Humidity,
	UVIndex,
	WeatherForecast,
	WeatherHeader,
	WeatherHourly,
	Wind,
} from '@/components/WeatherComponents';

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
		<main className="flex flex-col bg-slate-800 min-h-screen font-bold p-4">
			<h1 className="flex justify-center gap-2 text-white">
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
					<aside className="flex flex-row flex-wrap gap-4 mt-4 justify-between text-white">
						<UVIndex weather={weather} />
						<FeelsLike weather={weather} />
						<Humidity weather={weather} />
						<Wind weather={weather} />
					</aside>
				</>
			) : null}
		</main>
	);
}
