import { fetchRelevantNews } from '../src/services/NewsFeedService';

export default async function handler(req, res) {
  const { userId = '<HARDCODED_USER_ID>' } = req.query;
  try {
    const articles = await fetchRelevantNews(userId);
    res.status(200).json({ articles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
} 