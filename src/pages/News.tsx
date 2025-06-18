import React from 'react';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { NewsFeed } from '@/components/NewsFeed';

const News = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-4">Please log in to view your news feed.</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Relevant News Feed</h1>
      <NewsFeed userId={user.id} />
    </div>
  );
};

export default News;
