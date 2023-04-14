import { NextApiRequest } from 'next';
export const BASE_URL = 'https://api.weatherapi.com/v1';

interface QueryStruct {
  queryName: string;
  value: string | number | boolean;
}

export interface QueryStrings {
  [key: string]: string | number | boolean;
}

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

export const getAPIUrl = (req: NextApiRequest): string => {
  const route = req.headers['x-invoke-path'] as string;
  return `${BASE_URL}/${route.split('/')[2]}.json?key=${
    process.env.WEATHER_API
  }`;
};