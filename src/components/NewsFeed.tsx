
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  Globe, 
  Bookmark,
  RefreshCw,
  Filter
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: { name: string };
  category: string;
  relevanceScore: number;
}

const NewsFeed = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());

  // Mock news data for demonstration
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Global Markets Rally as Inflation Concerns Ease',
      description: 'Stock markets worldwide surge as latest economic data suggests inflation may be peaking, providing relief to investors and central banks.',
      url: 'https://example.com/article1',
      urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Financial Times' },
      category: 'markets',
      relevanceScore: 95
    },
    {
      id: '2',
      title: 'Fed Signals Potential Rate Cut in Q4 2024',
      description: 'Federal Reserve officials hint at possible interest rate reduction later this year if economic conditions continue to improve.',
      url: 'https://example.com/article2',
      urlToImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Reuters' },
      category: 'policy',
      relevanceScore: 90
    },
    {
      id: '3',
      title: 'ESG Investing Trends Reshape Portfolio Strategies',
      description: 'Environmental, Social, and Governance factors increasingly influence investment decisions as sustainable investing gains mainstream adoption.',
      url: 'https://example.com/article3',
      urlToImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Bloomberg' },
      category: 'investing',
      relevanceScore: 85
    },
    {
      id: '4',
      title: 'Cryptocurrency Market Shows Signs of Stabilization',
      description: 'After months of volatility, digital assets begin to show more stable trading patterns as institutional adoption continues.',
      url: 'https://example.com/article4',
      urlToImage: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: { name: 'CoinDesk' },
      category: 'crypto',
      relevanceScore: 80
    },
    {
      id: '5',
      title: 'Emerging Markets Outperform in Q2 Earnings',
      description: 'Companies in emerging markets report stronger than expected earnings, attracting renewed investor interest in the sector.',
      url: 'https://example.com/article5',
      urlToImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: { name: 'Wall Street Journal' },
      category: 'markets',
      relevanceScore: 75
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setArticles(mockArticles);
      } catch (error) {
        toast({
          title: "Error Loading News",
          description: "Failed to fetch news articles. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [toast]);

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'markets', label: 'Markets' },
    { value: 'policy', label: 'Policy' },
    { value: 'investing', label: 'Investing' },
    { value: 'crypto', label: 'Crypto' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookmark = (articleId: string) => {
    const newBookmarks = new Set(bookmarkedArticles);
    if (newBookmarks.has(articleId)) {
      newBookmarks.delete(articleId);
      toast({
        title: "Bookmark Removed",
        description: "Article removed from bookmarks."
      });
    } else {
      newBookmarks.add(articleId);
      toast({
        title: "Article Bookmarked",
        description: "Article saved to your bookmarks."
      });
    }
    setBookmarkedArticles(newBookmarks);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setArticles([...mockArticles].sort(() => Math.random() - 0.5));
      setLoading(false);
      toast({
        title: "News Refreshed",
        description: "Latest articles have been loaded."
      });
    }, 1000);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      markets: 'bg-blue-100 text-blue-800',
      policy: 'bg-purple-100 text-purple-800',
      investing: 'bg-green-100 text-green-800',
      crypto: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Market News & Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Market News & Insights
            <Badge variant="secondary" className="ml-2">
              {filteredArticles.length} articles
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search news..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="border-b pb-6 last:border-b-0">
                <div className="flex gap-4">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg leading-tight hover:text-primary cursor-pointer">
                        {article.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(article.id)}
                        className={bookmarkedArticles.has(article.id) ? 'text-yellow-600' : ''}
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="font-medium">{article.source.name}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(article.publishedAt)}
                        </div>
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{article.relevanceScore}% relevant</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" asChild>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Read More
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsFeed;
