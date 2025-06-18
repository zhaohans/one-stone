import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { fetchRelevantNews } from '../services/NewsFeedService';

// This is a Vite dev server middleware example
export default async function newsApiHandler(req: IncomingMessage, res: ServerResponse) {
  // For demo, get userId from query param or use a hardcoded value
  const url = new URL(req.url || '', 'http://localhost');
  const userId = url.searchParams.get('userId') || '<HARDCODED_USER_ID>';

  try {
    const articles = await fetchRelevantNews(userId);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ articles }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Failed to fetch news' }));
  }
} 