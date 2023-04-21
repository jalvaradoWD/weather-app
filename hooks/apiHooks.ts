import axios from 'axios';
import useSwr from 'swr';

const fetcher = (url: string) => axios.get('/api/current');

export const getCurrentWeather = async () => {};
