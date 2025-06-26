
import React from 'react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import NewsFeed from '@/components/NewsFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Newspaper, 
  TrendingUp, 
  Globe, 
  Bookmark, 
  Settings,
  Bell
} from 'lucide-react';

const News = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <Newspaper className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please log in to view your news feed</h2>
            <p className="text-gray-600">Access personalized market news and insights.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Newspaper className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Market News & Analysis</h1>
            <p className="text-gray-600">Stay informed with relevant financial news and insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </Button>
        </div>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            News Feed
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Bookmarks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main News Feed */}
            <div className="lg:col-span-3">
              <NewsFeed />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Market Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">S&P 500</span>
                    <div className="text-right">
                      <div className="font-semibold">4,185.47</div>
                      <div className="text-green-600 text-xs">+1.2%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">NASDAQ</span>
                    <div className="text-right">
                      <div className="font-semibold">12,943.87</div>
                      <div className="text-green-600 text-xs">+0.8%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">DOW</span>
                    <div className="text-right">
                      <div className="font-semibold">33,875.23</div>
                      <div className="text-red-600 text-xs">-0.3%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Highlights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Articles Read</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bookmarked</span>
                    <Badge variant="secondary">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Categories</span>
                    <Badge variant="secondary">5</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Personalized Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Portfolio Management</Badge>
                    <Badge variant="outline">ESG Investing</Badge>
                    <Badge variant="outline">Fed Policy</Badge>
                    <Badge variant="outline">Emerging Markets</Badge>
                    <Badge variant="outline">Cryptocurrency</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle>Trending Stories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Trending analysis coming soon...</p>
                <p className="text-sm text-gray-400 mt-2">
                  We'll show the most popular stories based on engagement and relevance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle>Saved Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bookmark className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No bookmarked articles yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Bookmark articles from the news feed to save them here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default News;
