import React from 'react';
import { NewsScreen as NewsComponent } from '../components/news/NewsScreen';
import { useParams } from 'react-router-dom';

export function NewsScreen() {
  const { id } = useParams();

  return (
    <NewsComponent initialSelectedArticleId={id || null} />
  );
}
