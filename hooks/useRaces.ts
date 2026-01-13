/**
 * カスタムフック: レースの取得
 */

import { useState, useEffect } from 'react';
import { getUpcomingRaces, getMockRaces } from '../lib/api';
import type { Race } from '../types/race';

interface UseRacesOptions {
  useMock?: boolean;
  autoFetch?: boolean;
}

export function useRaces(options: UseRacesOptions = {}) {
  const { useMock = true, autoFetch = true } = options;

  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRaces = async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMock) {
        // モックデータを使用
        const mockData = getMockRaces();
        setRaces(mockData);
      } else {
        // 実際のAPIを呼び出し
        const response = await getUpcomingRaces();
        if (response.success && response.data) {
          setRaces(response.data);
        } else {
          throw new Error(response.error || 'データの取得に失敗しました');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラー';
      setError(errorMessage);
      console.error('Races error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRaces();
    }
  }, [autoFetch, useMock]);

  return {
    races,
    loading,
    error,
    refetch: fetchRaces,
  };
}
