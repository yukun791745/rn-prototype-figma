import React from 'react';
import { NewsScreen as NewsComponent } from '../components/news/NewsScreen';

export function NewsScreen() {
  const [selectedNewsArticleId, setSelectedNewsArticleId] = React.useState<string | null>(null);

  return <NewsComponent initialSelectedArticleId={selectedNewsArticleId} />;
}
