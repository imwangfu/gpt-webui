// 使用 import 代替 require
import fetch from 'node-fetch';

export default async (req, res) => {
  const { method, headers, body } = req;
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: { ...headers, host: new URL(targetUrl).host },
      body: method === 'GET' ? null : JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch data', details: data });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
