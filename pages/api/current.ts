import { GetWeatherData } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const AVAILABLE_QUERIES = ['q', 'auto', 'aqi', 'alerts'];
const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req: NextApiRequest, res: NextApiResponse) =>
  res.status(200).json((await GetWeatherData(req, AVAILABLE_QUERIES)).data)
);

export default handler;
