export type PeriodPreset = 
  // 過去のみ
  | '1week' 
  | '2weeks' 
  | '4weeks' 
  | '9weeks'
  | '12weeks'
  | '24weeks'
  | '52weeks'
  // 過去 + カスタム日まで
  | '1week_custom'
  | '2weeks_custom'
  | '4weeks_custom'
  | '9weeks_custom'
  | '12weeks_custom'
  | '24weeks_custom'
  | '52weeks_custom'
  // 過去 + Aレースまで
  | '1week_race'
  | '2weeks_race'
  | '4weeks_race'
  | '9weeks_race'
  | '12weeks_race'
  | '24weeks_race'
  | '52weeks_race'
  // カスタム期間
  | 'custom';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PeriodSelection {
  preset: PeriodPreset;
  customEndDate?: string; // カスタム終了日（YYYY-MM-DD形式）
}

// 期間設定のヘルパー関数
export const getPeriodLabel = (preset: PeriodPreset): string => {
  const labels: Record<PeriodPreset, string> = {
    // 過去のみ
    '1week': '過去1週間',
    '2weeks': '過去2週間',
    '4weeks': '過去4週間',
    '9weeks': '過去9週間',
    '12weeks': '過去12週間',
    '24weeks': '過去24週間',
    '52weeks': '過去52週間',
    // 過去 + カスタム日まで
    '1week_custom': '過去1週間＋カスタム日まで',
    '2weeks_custom': '過去2週間＋カスタム日まで',
    '4weeks_custom': '過去4週間＋カスタム日まで',
    '9weeks_custom': '過去9週間＋カスタム日まで',
    '12weeks_custom': '過去12週間＋カスタム日まで',
    '24weeks_custom': '過去24週間＋カスタム日まで',
    '52weeks_custom': '過去52週間＋カスタム日まで',
    // 過去 + Aレースまで
    '1week_race': '過去1週間＋Aレースまで',
    '2weeks_race': '過去2週間＋Aレースまで',
    '4weeks_race': '過去4週間＋Aレースまで',
    '9weeks_race': '過去9週間＋Aレースまで',
    '12weeks_race': '過去12週間＋Aレースまで',
    '24weeks_race': '過去24週間＋Aレースまで',
    '52weeks_race': '過去52週間＋Aレースまで',
    // カスタム
    'custom': 'カスタム期間',
  };
  return labels[preset];
};

// 期間から週数を取得
export const getWeeksFromPreset = (preset: PeriodPreset): number => {
  const match = preset.match(/^(\d+)week/);
  return match ? parseInt(match[1]) : 4; // デフォルトは4週間
};

// 期間のタイプを判定
export const getPeriodType = (preset: PeriodPreset): 'past_only' | 'past_custom' | 'past_race' | 'custom' => {
  if (preset === 'custom') return 'custom';
  if (preset.endsWith('_custom')) return 'past_custom';
  if (preset.endsWith('_race')) return 'past_race';
  return 'past_only';
};
