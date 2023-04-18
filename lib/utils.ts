import axios, { AxiosResponse } from 'axios';
import { NextApiRequest } from 'next';

const BASE_URL = 'https://api.weatherapi.com/v1';
const AVAILABLE_QUERIES: { [key: string]: string[] } = {
  current: ['q', 'lang'],
  forecast: ['q', 'days', 'dt', 'unixdt', 'hour', 'alerts', 'aqi', 'lang'],
  future: ['q', 'lang'],
  history: ['q', 'dt', 'unixdt', 'end_dt', 'unixend_dt', 'hour', 'lang'],
  ip: ['q', 'lang'],
  marine: ['q', 'tides', 'lang'],
  search: ['q', 'lang'],
  sports: ['q', 'lang'],
  timezone: ['q', 'lang'],
};

interface QueryStruct {
  queryName: string;
  value: string | number | boolean;
}

export interface QueryStrings {
  [key: string]: string | number | 'yes' | 'no';
}

/**
 * @param something
 * and a test
 */
export const getQueryStrings = (
  queries: QueryStrings,
  AVAILABLE_QUERIES: string[]
): string[] => {
  const queryStrings: string[] = [];

  Object.keys(queries)
    .filter((key) => {
      return AVAILABLE_QUERIES.includes(key);
    })
    .forEach((key) => {
      const query: QueryStruct = {
        queryName: key,
        value: queries[key],
      };
      queryStrings.push(`${query.queryName}=${query.value}`);
    });

  return queryStrings;
};

export const getApiRequest = (
  req: NextApiRequest
): { url: string; AVAILABLE_QUERIES: string[] } => {
  const routePath = req.url?.split('/')[2].split('?')[0];
  const url = `${BASE_URL}/${routePath}.json?key=${process.env.WEATHER_API}`;

  return { url, AVAILABLE_QUERIES: AVAILABLE_QUERIES[routePath!] };
};

export const GetWeatherData = async (
  req: NextApiRequest
): Promise<AxiosResponse<any, any>> => {
  const { url, AVAILABLE_QUERIES } = getApiRequest(req);
  const queries = getQueryStrings(req.query as QueryStrings, AVAILABLE_QUERIES);

  const weatherResponse = await axios.get(
    `${url}${queries.length > 0 ? '&' : ''}${queries.join('&')}`
  );

  return weatherResponse;
};
