import { 
  Book, Review, ReadingSession, ReadingGoal,
  InsertBook, InsertReview, InsertReadingSession, InsertReadingGoal 
} from "@shared/schema";

export type { 
  Book, Review, ReadingSession, ReadingGoal,
  InsertBook, InsertReview, InsertReadingSession, InsertReadingGoal 
};

export type BookStatus = "reading" | "want_to_read" | "completed";

export interface ReadingActivity {
  day: string;
  minutes: number;
  pages: number;
}

export interface GenreDistribution {
  genre: string;
  count: number;
  percentage: number;
}

export interface MonthlyProgress {
  month: number;
  count: number;
}

export interface Statistics {
  booksRead: number;
  pagesRead: number;
  averageRating: number;
  readingTimeMinutes: number;
  readingGoal: ReadingGoal | null;
  genreDistribution: GenreDistribution[];
  monthlyProgress: MonthlyProgress[];
}
