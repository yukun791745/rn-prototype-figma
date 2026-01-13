/**
 * カスタムフック: フィットネスメトリクスの取得
 */

import { useState, useEffect } from 'react';
import { calculateTrainingLoad, getMockFitnessMetrics } from '../lib/api';
import type { FitnessMetrics } from '../types/metrics';

interface UseFitnessMetricsOptions {
  useMock?: boolean;
  autoFetch?: boolean;
  days?: number;
}

export function useFitnessMetrics(options: UseFitnessMetricsOptions = {}) {
  const { useMock = true, autoFetch = true, days = 90 } = options;

  const [metrics, setMetrics] = useState<FitnessMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMock) {
        // モックデータを使用
        const mockData = getMockFitnessMetrics();
        setMetrics(mockData);
      } else {
        // 実際のAPIを呼び出し
        const response = await calculateTrainingLoad({ days });
        if (response.success && response.data) {
          setMetrics(response.data);
        } else {
          throw new Error(response.error || 'データの取得に失敗しました');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラー';
      setError(errorMessage);
      console.error('Fitness metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchMetrics();
    }
  }, [autoFetch, days, useMock]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
}
