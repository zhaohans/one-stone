import express = require('express');
import cors = require('cors');
import { fetchRelevantNews } from './src/services/NewsFeedService';
const app = express();
const PORT = 5001;

app.use(cors());

app.get('/api/news', async (req, res) => {
  const userId = (req.query.userId as string) || '<HARDCODED_USER_ID>';
  try {
    const articles = await fetchRelevantNews(userId);
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
}); 