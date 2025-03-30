import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBookSchema, 
  insertReviewSchema, 
  insertReadingSessionSchema,
  insertReadingGoalSchema,
  insertCollectionSchema,
  insertBookCollectionSchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Error handler for validation errors
  const handleValidationError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: fromZodError(err).message 
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  };

  // Books routes
  app.get("/api/books", async (_req: Request, res: Response) => {
    try {
      const books = await storage.getAllBooks();
      return res.json(books);
    } catch (err) {
      console.error("Error fetching books:", err);
      return res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.get("/api/books/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const book = await storage.getBookById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.json(book);
    } catch (err) {
      console.error("Error fetching book:", err);
      return res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  app.get("/api/books/status/:status", async (req: Request, res: Response) => {
    try {
      const status = req.params.status;
      // Validate status
      if (!["want_to_read", "reading", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const books = await storage.getBooksByStatus(status);
      return res.json(books);
    } catch (err) {
      console.error("Error fetching books by status:", err);
      return res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.post("/api/books", async (req: Request, res: Response) => {
    try {
      const bookData = insertBookSchema.parse(req.body);
      const book = await storage.createBook(bookData);
      return res.status(201).json(book);
    } catch (err) {
      console.error("Error creating book:", err);
      return handleValidationError(err, res);
    }
  });

  app.put("/api/books/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const bookData = req.body;
      const updatedBook = await storage.updateBook(id, bookData);
      
      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.json(updatedBook);
    } catch (err) {
      console.error("Error updating book:", err);
      return res.status(500).json({ message: "Failed to update book" });
    }
  });

  app.delete("/api/books/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const success = await storage.deleteBook(id);
      if (!success) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting book:", err);
      return res.status(500).json({ message: "Failed to delete book" });
    }
  });

  // Reviews routes
  app.get("/api/reviews", async (_req: Request, res: Response) => {
    try {
      const reviews = await storage.getAllReviews();
      return res.json(reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const review = await storage.getReviewById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      return res.json(review);
    } catch (err) {
      console.error("Error fetching review:", err);
      return res.status(500).json({ message: "Failed to fetch review" });
    }
  });

  app.get("/api/books/:bookId/reviews", async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.bookId);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const reviews = await storage.getReviewsByBookId(bookId);
      return res.json(reviews);
    } catch (err) {
      console.error("Error fetching reviews for book:", err);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Verify book exists
      const book = await storage.getBookById(reviewData.bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const review = await storage.createReview(reviewData);
      return res.status(201).json(review);
    } catch (err) {
      console.error("Error creating review:", err);
      return handleValidationError(err, res);
    }
  });

  app.put("/api/reviews/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const reviewData = req.body;
      const updatedReview = await storage.updateReview(id, reviewData);
      
      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      return res.json(updatedReview);
    } catch (err) {
      console.error("Error updating review:", err);
      return res.status(500).json({ message: "Failed to update review" });
    }
  });

  app.delete("/api/reviews/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const success = await storage.deleteReview(id);
      if (!success) {
        return res.status(404).json({ message: "Review not found" });
      }

      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting review:", err);
      return res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Reading sessions routes
  app.post("/api/reading-sessions", async (req: Request, res: Response) => {
    try {
      const sessionData = insertReadingSessionSchema.parse(req.body);
      
      // Verify book exists
      const book = await storage.getBookById(sessionData.bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const session = await storage.createReadingSession(sessionData);
      return res.status(201).json(session);
    } catch (err) {
      console.error("Error creating reading session:", err);
      return handleValidationError(err, res);
    }
  });

  app.get("/api/books/:bookId/reading-sessions", async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.bookId);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const sessions = await storage.getReadingSessionsByBookId(bookId);
      return res.json(sessions);
    } catch (err) {
      console.error("Error fetching reading sessions for book:", err);
      return res.status(500).json({ message: "Failed to fetch reading sessions" });
    }
  });

  app.get("/api/reading-sessions", async (req: Request, res: Response) => {
    try {
      const startDateParam = req.query.startDate as string;
      const endDateParam = req.query.endDate as string;
      
      if (!startDateParam || !endDateParam) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      const sessions = await storage.getReadingSessionsByDateRange(startDate, endDate);
      return res.json(sessions);
    } catch (err) {
      console.error("Error fetching reading sessions:", err);
      return res.status(500).json({ message: "Failed to fetch reading sessions" });
    }
  });

  // Reading goals routes
  app.get("/api/reading-goals/:year", async (req: Request, res: Response) => {
    try {
      const year = parseInt(req.params.year);
      if (isNaN(year)) {
        return res.status(400).json({ message: "Invalid year" });
      }

      const goal = await storage.getReadingGoal(year);
      if (!goal) {
        return res.status(404).json({ message: "Reading goal not found" });
      }

      return res.json(goal);
    } catch (err) {
      console.error("Error fetching reading goal:", err);
      return res.status(500).json({ message: "Failed to fetch reading goal" });
    }
  });

  app.post("/api/reading-goals", async (req: Request, res: Response) => {
    try {
      const goalData = insertReadingGoalSchema.parse(req.body);
      const goal = await storage.createReadingGoal(goalData);
      return res.status(201).json(goal);
    } catch (err) {
      console.error("Error creating reading goal:", err);
      return handleValidationError(err, res);
    }
  });

  app.put("/api/reading-goals/:year", async (req: Request, res: Response) => {
    try {
      const year = parseInt(req.params.year);
      if (isNaN(year)) {
        return res.status(400).json({ message: "Invalid year" });
      }

      const goalData = req.body;
      const updatedGoal = await storage.updateReadingGoal(year, goalData);
      
      if (!updatedGoal) {
        return res.status(404).json({ message: "Reading goal not found" });
      }

      return res.json(updatedGoal);
    } catch (err) {
      console.error("Error updating reading goal:", err);
      return res.status(500).json({ message: "Failed to update reading goal" });
    }
  });

  // Wishlist routes
  app.get("/api/books/wishlist", async (_req: Request, res: Response) => {
    try {
      const books = await storage.getWishlistBooks();
      return res.json(books);
    } catch (err) {
      console.error("Error fetching wishlist books:", err);
      return res.status(500).json({ message: "Failed to fetch wishlist books" });
    }
  });

  app.post("/api/books/:id/wishlist", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const book = await storage.getBookById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const updatedBook = await storage.updateBook(id, { isWishlist: true });
      return res.json(updatedBook);
    } catch (err) {
      console.error("Error adding book to wishlist:", err);
      return res.status(500).json({ message: "Failed to add book to wishlist" });
    }
  });

  app.delete("/api/books/:id/wishlist", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const book = await storage.getBookById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const updatedBook = await storage.updateBook(id, { isWishlist: false });
      return res.json(updatedBook);
    } catch (err) {
      console.error("Error removing book from wishlist:", err);
      return res.status(500).json({ message: "Failed to remove book from wishlist" });
    }
  });

  // Book tag routes
  app.get("/api/books/tags/:tag", async (req: Request, res: Response) => {
    try {
      const tag = req.params.tag;
      const books = await storage.getBooksByTags([tag]);
      return res.json(books);
    } catch (err) {
      console.error("Error fetching books by tag:", err);
      return res.status(500).json({ message: "Failed to fetch books by tag" });
    }
  });

  // Collections routes
  app.get("/api/collections", async (_req: Request, res: Response) => {
    try {
      const collections = await storage.getAllCollections();
      return res.json(collections);
    } catch (err) {
      console.error("Error fetching collections:", err);
      return res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.get("/api/collections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }

      const collection = await storage.getCollectionById(id);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }

      return res.json(collection);
    } catch (err) {
      console.error("Error fetching collection:", err);
      return res.status(500).json({ message: "Failed to fetch collection" });
    }
  });

  app.post("/api/collections", async (req: Request, res: Response) => {
    try {
      const collectionData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(collectionData);
      return res.status(201).json(collection);
    } catch (err) {
      console.error("Error creating collection:", err);
      return handleValidationError(err, res);
    }
  });

  app.put("/api/collections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }

      const collectionData = req.body;
      const updatedCollection = await storage.updateCollection(id, collectionData);
      
      if (!updatedCollection) {
        return res.status(404).json({ message: "Collection not found" });
      }

      return res.json(updatedCollection);
    } catch (err) {
      console.error("Error updating collection:", err);
      return res.status(500).json({ message: "Failed to update collection" });
    }
  });

  app.delete("/api/collections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }

      const success = await storage.deleteCollection(id);
      if (!success) {
        return res.status(404).json({ message: "Collection not found" });
      }

      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting collection:", err);
      return res.status(500).json({ message: "Failed to delete collection" });
    }
  });

  // Books in collections routes
  app.get("/api/collections/:id/books", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }

      const books = await storage.getBooksInCollection(id);
      return res.json(books);
    } catch (err) {
      console.error("Error fetching books in collection:", err);
      return res.status(500).json({ message: "Failed to fetch books in collection" });
    }
  });

  app.get("/api/books/:id/collections", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const collections = await storage.getCollectionsForBook(id);
      return res.json(collections);
    } catch (err) {
      console.error("Error fetching collections for book:", err);
      return res.status(500).json({ message: "Failed to fetch collections for book" });
    }
  });

  app.post("/api/collections/:collectionId/books/:bookId", async (req: Request, res: Response) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const bookId = parseInt(req.params.bookId);
      
      if (isNaN(collectionId) || isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid IDs" });
      }

      // Verify both collection and book exist
      const collection = await storage.getCollectionById(collectionId);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }

      const book = await storage.getBookById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const bookCollection = await storage.addBookToCollection({ 
        bookId, 
        collectionId 
      });
      
      return res.status(201).json(bookCollection);
    } catch (err) {
      console.error("Error adding book to collection:", err);
      if (err instanceof Error && err.message === 'Book is already in this collection') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Failed to add book to collection" });
    }
  });

  app.delete("/api/collections/:collectionId/books/:bookId", async (req: Request, res: Response) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const bookId = parseInt(req.params.bookId);
      
      if (isNaN(collectionId) || isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid IDs" });
      }

      const success = await storage.removeBookFromCollection(bookId, collectionId);
      if (!success) {
        return res.status(404).json({ message: "Book not found in collection" });
      }

      return res.json({ success: true });
    } catch (err) {
      console.error("Error removing book from collection:", err);
      return res.status(500).json({ message: "Failed to remove book from collection" });
    }
  });

  // Statistics endpoints
  app.get("/api/statistics", async (_req: Request, res: Response) => {
    try {
      const books = await storage.getAllBooks();
      const currentYear = new Date().getFullYear();
      const readingGoal = await storage.getReadingGoal(currentYear);
      
      // Calculate statistics
      const completedBooks = books.filter(book => book.status === "completed");
      const totalPages = completedBooks.reduce((total, book) => total + (book.pages || 0), 0);
      
      // Get reading sessions for the current year
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
      const sessions = await storage.getReadingSessionsByDateRange(startOfYear, endOfYear);
      
      const totalMinutesRead = sessions.reduce((total, session) => total + session.minutesSpent, 0);
      
      // Calculate average rating
      const reviews = await storage.getAllReviews();
      const totalRating = reviews.reduce((total, review) => total + (review.rating || 0), 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      // Genre distribution
      const genreCounts: Record<string, number> = {};
      completedBooks.forEach(book => {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      });
      
      const genreDistribution = Object.entries(genreCounts).map(([genre, count]) => ({
        genre,
        count,
        percentage: (count / completedBooks.length) * 100
      }));
      
      // Monthly reading progress
      const monthlyProgress: Record<number, number> = {};
      for (let i = 0; i < 12; i++) {
        monthlyProgress[i] = 0;
      }
      
      completedBooks.forEach(book => {
        if (book.dateFinished && book.dateFinished.getFullYear() === currentYear) {
          const month = book.dateFinished.getMonth();
          monthlyProgress[month] += 1;
        }
      });
      
      const statistics = {
        booksRead: completedBooks.length,
        pagesRead: totalPages,
        averageRating,
        readingTimeMinutes: totalMinutesRead,
        readingGoal: readingGoal || null,
        genreDistribution,
        monthlyProgress: Object.entries(monthlyProgress).map(([month, count]) => ({
          month: parseInt(month),
          count
        }))
      };
      
      return res.json(statistics);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      return res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  return httpServer;
}
