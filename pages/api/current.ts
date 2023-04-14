import { QueryStrings, getAPIUrl, getQueryStrings } from '@/lib/utils';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const AVAILABLE_QUERIES = ['q', 'auto', 'aqi', 'alerts'];
const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const url = getAPIUrl(req);

  const queries = getQueryStrings(req.query as QueryStrings, AVAILABLE_QUERIES);

  const weatherRes = await axios.get(
    `${url}${queries.length > 0 ? '&' : ''}${queries.join('&')}`
  );

  res.status(200).json(weatherRes.data);
});

export default handler;
