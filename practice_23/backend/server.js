const express = require('express');

const app = express();
const port = Number(process.env.PORT || 3000);
const serverId = process.env.SERVER_ID || 'backend-unknown';

app.get('/', (_req, res) => {
  res.json({ server: serverId });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', server: serverId });
});

app.listen(port, () => {
  console.log(`Server ${serverId} listening on port ${port}`);
});
