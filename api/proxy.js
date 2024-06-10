// api/proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url, ...options } = req.body;

  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    const response = await fetch(url, options);
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
