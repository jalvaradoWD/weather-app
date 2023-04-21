import { GetWeatherData } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();
const AVAILABLE_ROUTES = [
  'current',
  'forecast',
  'future',
  'history',
  'ip',
  'marine',
  'search',
  'sports',
  'timezone',
];

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { route } = req.query;

  if (!AVAILABLE_ROUTES.includes(route as string))
    return res.status(404).json({ message: 'Route Not Found' });

  return res.status(200).json((await GetWeatherData(req)).data);
});

export default handler;
