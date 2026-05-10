export interface Course {
  id: string;
  name: string;
  faculty: string;
  minAPS: number;
  subjects: string[];
  description: string;
  careerPaths: string[];
}

export interface Department {
  id: string;
  name: string;
  faculty: string;
  contactEmail: string;
  contactPhone: string;
  building: string;
  location: { lat: number; lng: number };
}

export interface RecommendationRequest {
  apsScore: number;
  subjects: { name: string; score: number }[];
  interests: string[];
}

export interface AnalyticsData {
  mostSearchedCourses: { name: string; count: number }[];
  navigationHotspots: { building: string; visits: number }[];
  userActivity: { date: string; users: number }[];
  interestClusters: { category: string; value: number }[];
}
