/**
 * アクティビティの型定義
 * Strava API レスポンスに基づく
 */

export type ActivityType = 'Swim' | 'Bike' | 'Run' | 'Triathlon' | 'Other';

export interface Activity {
  id: number;
  name: string;
  type: ActivityType;
  sport_type?: string;
  distance: number; // メートル
  moving_time: number; // 秒
  elapsed_time: number; // 秒
  total_elevation_gain?: number; // メートル
  start_date: string;
  start_date_local: string;
  average_speed?: number; // m/s
  max_speed?: number; // m/s
  average_heartrate?: number;
  max_heartrate?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  calories?: number;
  suffer_score?: number; // Strava独自のスコア
}

export interface ActivityDetail extends Activity {
  description?: string;
  laps?: Lap[];
  splits_metric?: Split[];
  best_efforts?: BestEffort[];
  segment_efforts?: SegmentEffort[];
  tss?: number; // カスタム計算
  normalized_power?: number; // カスタム計算
  intensity_factor?: number; // カスタム計算
}

export interface Lap {
  id: number;
  name: string;
  elapsed_time: number;
  moving_time: number;
  distance: number;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_watts?: number;
  lap_index: number;
}

export interface Split {
  distance: number;
  elapsed_time: number;
  moving_time: number;
  average_speed: number;
  pace_zone?: number;
}

export interface BestEffort {
  name: string;
  elapsed_time: number;
  distance: number;
  start_date: string;
  pr_rank?: number;
}

export interface SegmentEffort {
  id: number;
  name: string;
  elapsed_time: number;
  distance: number;
  average_heartrate?: number;
  average_watts?: number;
}

export interface ActivityStream {
  time: number[];
  distance: number[];
  velocity_smooth?: number[];
  heartrate?: number[];
  watts?: number[];
  altitude?: number[];
  cadence?: number[];
  temp?: number[];
  moving?: boolean[];
  grade_smooth?: number[];
}

export interface ActivitySummary {
  id: number;
  name: string;
  type: ActivityType;
  date: string;
  dateFormatted: string;
  distance: number;
  distanceFormatted: string;
  duration: number;
  durationFormatted: string;
  pace?: string;
  speed?: number;
  tss?: number;
  heartrate?: number;
}
