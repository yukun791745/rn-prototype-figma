/**
 * カスタムフック: ニュースの取得
 */

import { useState, useEffect } from 'react';
import { getNews, getMockNews } from '../lib/api';
import type { NewsItem } from '../types/news';

interface UseNewsOptions {
  useMock?: boolean;
  autoFetch?: boolean;
  limit?: number;
}

export function useNews(options: UseNewsOptions = {}) {
  const { useMock = true, autoFetch = true, limit = 10 } = options;

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMock) {
        // モックデータを使用
        const mockData = getMockNews();
        setNews(mockData);
      } else {
        // 実際のAPIを呼び出し
        const response = await getNews({ limit });
        if (response.success && response.data) {
          setNews(response.data);
        } else {
          throw new Error(response.error || 'データの取得に失敗しました');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラー';
      setError(errorMessage);
      console.error('News error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchNews();
    }
  }, [autoFetch, limit, useMock]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
  };
}
