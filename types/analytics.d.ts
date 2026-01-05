export interface AnalyticsReponse {
  statusCode: number;
  data: AnalyticsStats;
}

export interface AnalyticsStats {
  total_revenue: {
    total: string;
    raw_total: string;
    breakdown: {
      courses: string;
      subscriptions: string;
      products: string;
      tickets: string;
    };
    details: BusinessEarningsAnalytics;
  };
  active_subscriptions: {
    active_subscriptions: any[];
    statistics: {
      total: number;
      active: number;
      expired: number;
    };
  };
  all_clients: {
    clients: AnalyticsClient[];
    statistics: {
      total: number;
      verified_email: number;
      verified_phone: number;
      with_payments: number;
      with_enrollments: number;
      business_contacts: number;
    };
  };
  course_completions: {
    courses: AnalyticsCourse[];
    completion_statistics: AnalyticsCourseCompletionStats[];
    overall_statistics: {
      total_courses: number;
      total_enrollments: number;
      total_completions: number;
      overall_completion_rate: number;
    };
  };
}

export interface AnalyticsClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  business_contacts: AnalyticsBusinessContact[];
  payments: any[];
  enrolled_courses: any[];
}

export interface AnalyticsBusinessContact {
  id: string;
  role: string;
  status: string;
  joined_at: string;
}

export interface AnalyticsCourse {
  id: string;
  title: string;
  created_at: string;
  enrolled: AnalyticsCourseEnrollment[];
  modules: AnalyticsCourseModule[];
}

export interface AnalyticsCourseEnrollment {
  id: string;
  progress: number;
  status: string;
  completed_lessons: number;
  total_lessons: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AnalyticsCourseModule {
  id: string;
  title: string;
  contents: AnalyticsCourseContent[];
}

export interface AnalyticsCourseContent {
  id: string;
  title: string;
  progress: any[];
}

export interface AnalyticsCourseCompletionStats {
  course_id: string;
  course_title: string;
  total_enrollments: number;
  completed_enrollments: number;
  active_enrollments: number;
  completion_rate: number;
  average_progress: number;
  total_lessons: number;
}

export interface MonthlyRevenueResponse {
  statusCode: number;
  data: MonthlyRevenueData;
}

export interface MonthlyRevenueData {
  year: number;
  currencies: CurrencyRevenueDataByMonth[];
}

export interface CurrencyRevenueDataByMonth {
  currency: string;
  currency_sign: string;
  months: MonthlyRevenueMonth[];
}

export interface MonthlyRevenueMonth {
  month: string;
  course: RevenueItem;
  ticket: RevenueItem;
  subscription: RevenueItem;
  digital: RevenueItem;
}

export interface RevenueItem {
  amount: number | string;
  formatted: string;
}

export interface BusinessEarningsAnalytics {
  business_id: string;
  by_currency: CurrencyEarning[];
  overall: OverallEarnings;
}

export interface CurrencyEarning {
  currency: string;
  currency_sign: string;
  total_payments: number;
  gross_amount: string;
  total_discount: string;
  net_earnings: string;
  raw: RawEarningValues;
}

export interface RawEarningValues {
  gross_amount: number;
  total_discount: number;
  net_earnings: number;
}

export interface OverallEarnings {
  total_payments: number;
  gross_amount: string;
  total_discount: string;
  net_earnings: string;
}
