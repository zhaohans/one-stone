import { supabase } from '../integrations/supabase/client';
import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY || '<YOUR_NEWSAPI_KEY_HERE>';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

export async function fetchRelevantNews(userId: string): Promise<NewsArticle[]> {
  // 1. Gather keywords from your database
  // Example: get customer names, regions, and recent trade tickers for this user
  const keywords = new Set<string>();

  // Fetch client companies and countries
  const { data: clients } = await supabase
    .from('clients')
    .select('client_code, country, first_name, last_name')
    .eq('user_id', userId);
  if (clients) {
    clients.forEach((c: any) => {
      if (c.client_code) keywords.add(c.client_code);
      if (c.country) keywords.add(c.country);
      if (c.first_name) keywords.add(c.first_name);
      if (c.last_name) keywords.add(c.last_name);
    });
  }

  // Fetch recent trades (tickers)
  const { data: trades } = await supabase
    .from('trades')
    .select('security_id')
    .eq('created_by', userId)
    .order('trade_date', { ascending: false })
    .limit(10);
  if (trades) {
    trades.forEach((t: any) => {
      if (t.security_id) keywords.add(t.security_id);
    });
  }

  // 2. Query NewsAPI for each keyword
  const articlesMap = new Map<string, NewsArticle>();
  for (const keyword of keywords) {
    try {
      const response = await axios.get(NEWS_API_URL, {
        params: {
          q: keyword,
          apiKey: NEWS_API_KEY,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 10,
        },
      });
      const articles: NewsArticle[] = response.data.articles;
      for (const article of articles) {
        // Use URL as unique key to deduplicate
        if (!articlesMap.has(article.url)) {
          articlesMap.set(article.url, article);
        }
      }
    } catch (err) {
      // Ignore errors for individual keywords
      continue;
    }
  }

  // 3. Return deduplicated, sorted articles
  return Array.from(articlesMap.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
} 