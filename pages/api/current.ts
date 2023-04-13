import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BASE_URL = 'https://api.weatherapi.com/v1';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { q } = req.query;
  const url = `${BASE_URL}/current.json?key=${process.env.WEATHER_API!}&q=${q}`;

  const weatherRes = await axios.get(url);
  res.status(200).json(weatherRes.data);
});

export default handler;
