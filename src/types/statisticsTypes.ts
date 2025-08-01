// Reading Statistics Types

export interface CurrentPeriod {
  daily: number | null;
  weekly: number | null;
  monthly: number | null;
  yearly: number | null;
}

export interface ComparisonReport {
  user_rank: number;
  total_users: number;
  percentile: number;
  better_than_percent: number;
  comparison_metrics: Record<string, any>;
}

export interface TrendsAnalysis {
  periods: string[];
  trends: {
    books_read: number[];
    pages_read: number[];
    reading_minutes: number[];
    completion_rate: number[];
  };
  growth_rates: {
    books_read: number;
    pages_read: number;
    reading_minutes: number;
    completion_rate: number;
  };
}

export interface ReadingStatsSummary {
  total_books_read: number;
  total_pages_read: number;
  total_reading_time: number;
  current_streak: number;
  performance_level: string;
  reading_score: number;
  consistency_score: number;
  reading_efficiency: number;
}

export interface BehavioralAnalytics {
  overview: {
    total_reading_time: number;
    total_pages_read: number;
    total_books_completed: number;
    average_reading_speed: number;
    consistency_score: number;
    last_analysis: string;
  };
  insights: {
    reading_pattern: {
      preferredHours: number[];
      averageSessionDuration: number;
      preferredGenres: string[];
      readingSpeed: number;
      consistency: number;
    };
    most_active_hour: number;
    longest_session: number;
    preferred_genres: string[];
    reading_consistency: {
      score: number;
      trend: string;
    };
  };
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
    expected_impact: string;
  }>;
}

export interface ReadingStatistics {
  current_period: CurrentPeriod;
  comparison_report: ComparisonReport;
  trends_analysis: TrendsAnalysis;
  behavioral_analytics: BehavioralAnalytics;
  summary: ReadingStatsSummary;
}

export interface ReadingStatisticsResponse {
  status: "success";
  data: ReadingStatistics;
}
