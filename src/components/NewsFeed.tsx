
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewsFeed = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>News Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">News feed component</p>
      </CardContent>
    </Card>
  );
};

export default NewsFeed;
