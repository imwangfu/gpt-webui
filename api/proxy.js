// 使用 import 代替 require
import fetch from 'node-fetch';
export const maxDuration = 60; 
export default async (req, res) => {
  const { method, headers, body } = req;
  const targetUrl = req.query.url;
  // 设置 CORS 头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // 对 OPTIONS 请求做出快速响应
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  

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
