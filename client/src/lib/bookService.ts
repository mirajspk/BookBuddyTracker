import { Book, Review, ReadingSession, ReadingGoal } from "@/types";

// Function to fetch books by status
export async function fetchBooksByStatus(status: string): Promise<Book[]> {
  const response = await fetch(`/api/books/status/${status}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch books with status: ${status}`);
  }
  return response.json();
}

// Function to fetch all books
export async function fetchAllBooks(): Promise<Book[]> {
  const response = await fetch('/api/books');
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return response.json();
}

// Function to fetch a single book by ID
export async function fetchBookById(id: number): Promise<Book> {
  const response = await fetch(`/api/books/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch book with ID: ${id}`);
  }
  return response.json();
}

// Function to add a new book
export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  const response = await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add book');
  }
  
  return response.json();
}

// Function to update a book
export async function updateBook(id: number, bookData: Partial<Book>): Promise<Book> {
  const response = await fetch(`/api/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update book with ID: ${id}`);
  }
  
  return response.json();
}

// Function to delete a book
export async function deleteBook(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`/api/books/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete book with ID: ${id}`);
  }
  
  return response.json();
}

// Function to fetch reviews for a book
export async function fetchReviewsByBookId(bookId: number): Promise<Review[]> {
  const response = await fetch(`/api/books/${bookId}/reviews`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews for book with ID: ${bookId}`);
  }
  return response.json();
}

// Function to fetch all reviews
export async function fetchAllReviews(): Promise<Review[]> {
  const response = await fetch('/api/reviews');
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return response.json();
}

// Function to add a new review
export async function addReview(review: Omit<Review, 'id' | 'dateReviewed'>): Promise<Review> {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(review),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add review');
  }
  
  return response.json();
}

// Function to update a review
export async function updateReview(id: number, reviewData: Partial<Review>): Promise<Review> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update review with ID: ${id}`);
  }
  
  return response.json();
}

// Function to delete a review
export async function deleteReview(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete review with ID: ${id}`);
  }
  
  return response.json();
}

// Function to add a reading session
export async function addReadingSession(session: Omit<ReadingSession, 'id' | 'date'>): Promise<ReadingSession> {
  const response = await fetch('/api/reading-sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(session),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add reading session');
  }
  
  return response.json();
}

// Function to fetch reading sessions for a book
export async function fetchReadingSessionsByBookId(bookId: number): Promise<ReadingSession[]> {
  const response = await fetch(`/api/books/${bookId}/reading-sessions`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reading sessions for book with ID: ${bookId}`);
  }
  return response.json();
}

// Function to fetch reading sessions by date range
export async function fetchReadingSessionsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<ReadingSession[]> {
  const response = await fetch(
    `/api/reading-sessions?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch reading sessions');
  }
  
  return response.json();
}

// Function to fetch reading goal by year
export async function fetchReadingGoal(year: number): Promise<ReadingGoal> {
  const response = await fetch(`/api/reading-goals/${year}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`No reading goal set for ${year}`);
    }
    throw new Error(`Failed to fetch reading goal for year: ${year}`);
  }
  return response.json();
}

// Function to create a reading goal
export async function createReadingGoal(goal: Omit<ReadingGoal, 'id' | 'booksRead' | 'completed'>): Promise<ReadingGoal> {
  const response = await fetch('/api/reading-goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(goal),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create reading goal');
  }
  
  return response.json();
}

// Function to update a reading goal
export async function updateReadingGoal(
  year: number,
  goalData: Partial<ReadingGoal>
): Promise<ReadingGoal> {
  const response = await fetch(`/api/reading-goals/${year}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(goalData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update reading goal for year: ${year}`);
  }
  
  return response.json();
}

// Function to fetch statistics
export async function fetchStatistics() {
  const response = await fetch('/api/statistics');
  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return response.json();
}
