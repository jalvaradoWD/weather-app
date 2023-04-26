import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Raindrop</title>
				<meta
					name="description"
					content="A weather app created by Jose Alvarado"
				/>
				<link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
			</Head>
			<Component {...pageProps} />
		</>
	);
}
