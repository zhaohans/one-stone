import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "./ui/loading-spinner";
import { useSuccessToast, useErrorToast } from "./ui/toast-manager";
import { ErrorBoundary } from "./ui/error-boundary";

export const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:5001/api/news-rss")
      .then((res) => res.text())
      .then((str) => {
        // Parse RSS XML to JSON
        const parser = new window.DOMParser();
        const xml = parser.parseFromString(str, "text/xml");
        const items = Array.from(xml.querySelectorAll("item")).map((item) => ({
          title: item.querySelector("title")?.textContent,
          link: item.querySelector("link")?.textContent,
          pubDate: item.querySelector("pubDate")?.textContent,
          description: item.querySelector("description")?.textContent,
        }));
        setArticles(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setError("Failed to load news feed");
        errorToast("News Feed Error", "Failed to load news feed");
        setLoading(false);
      });
  }, [retryCount]);

  if (loading)
    return (
      <div className="p-4">
        <LoadingSpinner size="md" text="Loading news..." />
      </div>
    );
  if (error)
    return (
      <div className="p-4 flex flex-col items-center text-center">
        <div className="text-red-600 font-semibold mb-2">{error}</div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setRetryCount((c) => c + 1)}
        >
          Retry
        </button>
      </div>
    );
  if (!articles.length) return <div className="p-4">No news found.</div>;

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {articles.map((article, idx) => (
          <a
            key={idx}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
            <div className="text-sm text-gray-500 mb-2">{article.pubDate}</div>
            <p
              className="text-sm text-gray-700 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: article.description || "" }}
            />
          </a>
        ))}
      </div>
    </ErrorBoundary>
  );
};
