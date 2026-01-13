/**
 * カスタムフック: アクティビティの取得
 */

import { useState, useEffect } from 'react';
import { getActivities, getMockActivities } from '../lib/api';
import type { Activity } from '../types/activity';

interface UseActivitiesOptions {
  useMock?: boolean;
  autoFetch?: boolean;
  limit?: number;
}

export function useActivities(options: UseActivitiesOptions = {}) {
  const { useMock = true, autoFetch = true, limit = 10 } = options;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMock) {
        // モックデータを使用
        const mockData = getMockActivities();
        setActivities(mockData);
      } else {
        // 実際のAPIを呼び出し
        const response = await getActivities({ per_page: limit });
        if (response.success && response.data) {
          setActivities(response.data);
        } else {
          throw new Error(response.error || 'データの取得に失敗しました');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラー';
      setError(errorMessage);
      console.error('Activities error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchActivities();
    }
  }, [autoFetch, limit, useMock]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  };
}
