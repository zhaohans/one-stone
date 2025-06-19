const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const {
  fetchRelevantNews,
} = require("./dist/services/services/NewsFeedService.js");
const app = express();
const PORT = 5001;

// Enable CORS for all routes
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.get("/api/news", async (req, res) => {
  const userId = req.query.userId || "<HARDCODED_USER_ID>";
  try {
    const articles = await fetchRelevantNews(userId);
    res.json({ articles });
  } catch (err) {
    console.error("Error in /api/news:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// Proxy endpoint for Google News RSS
app.get("/api/news-rss", async (req, res) => {
  try {
    console.log("Fetching news from Google News RSS...");
    const response = await fetch(
      "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xml = await response.text();
    console.log("Successfully fetched RSS feed");

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Error in /api/news-rss:", err);
    res.status(500).json({
      error: "Failed to fetch news",
      details: err.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
