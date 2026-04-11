export interface TopicStrength {
  label: string;
  pct: number;
  color: string;
}

export interface QuizStats {
  totalAnswered: number;
  averagePercent: number;
  weekOnWeekDelta: number;
  streakDays: number;
  hoursThisWeek: number;
  strongestArea: string;
  weakestArea: string;
  topicBreakdown: TopicStrength[];
}

export interface OsceStats {
  totalRuns: number;
  averageScore: number;
  monthOnMonthDelta: number;
}
