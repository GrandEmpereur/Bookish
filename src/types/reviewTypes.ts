export interface Review {
  id: string;
  bookId: string;
  rating: number;
  title: string;
  content: string;
  is_spoiler: boolean;
  is_recommended: boolean;
  reading_status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    profile: {
      full_name: string;
      profile_picture_path: string | null;
    };
  };
}

export interface ReviewStatistics {
  total_reviews: number;
  average_rating: number;
  rating_distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
  recommendation_percentage: number;
}
