import { GetWeatherData } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();
const AVAILABLE_QUERIES = ['q', 'dt', 'unixdt', 'hour', 'alerts', 'aqi', 'tp'];

handler.get(async (req, res) =>
  res
    .status(200)
    .json((await GetWeatherData(req, AVAILABLE_QUERIES)).data)
);

export default handler;
