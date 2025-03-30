import { pgTable, text, serial, integer, timestamp, doublePrecision, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Book table
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  coverUrl: text("cover_url"),
  genre: text("genre").notNull(),
  pages: integer("pages"),
  status: text("status").notNull(), // "want_to_read", "reading", "completed"
  progress: integer("progress").default(0), // percentage of completion (0-100)
  dateAdded: timestamp("date_added").defaultNow(),
  dateStarted: timestamp("date_started"),
  dateFinished: timestamp("date_finished"),
  description: text("description"),
  isWishlist: boolean("is_wishlist").default(false), // Track if book is in wishlist
  tags: text("tags").array(), // For catalog filtering
});

// Collections for organizing books
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  dateCreated: timestamp("date_created").defaultNow(),
  coverUrl: text("cover_url"), // Optional collection cover
});

// Junction table for books in collections
export const bookCollections = pgTable("book_collections", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  collectionId: integer("collection_id").notNull(),
  dateAdded: timestamp("date_added").defaultNow(),
});

// Review table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  rating: doublePrecision("rating"), // 1-5 scale with half-star increments
  content: text("content"),
  dateReviewed: timestamp("date_reviewed").defaultNow(),
  tags: text("tags").array(),
});

// Reading session (for tracking reading activity)
export const readingSessions = pgTable("reading_sessions", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  pagesRead: integer("pages_read").notNull(),
  minutesSpent: integer("minutes_spent").notNull(),
  date: timestamp("date").defaultNow(),
});

// Reading goal
export const readingGoals = pgTable("reading_goals", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  targetBooks: integer("target_books").notNull(),
  booksRead: integer("books_read").default(0),
  completed: boolean("completed").default(false),
});

// Insert schemas
export const insertBookSchema = createInsertSchema(books).omit({ 
  id: true,
  dateAdded: true
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
  dateCreated: true
});

export const insertBookCollectionSchema = createInsertSchema(bookCollections).omit({
  id: true,
  dateAdded: true
});

export const insertReviewSchema = createInsertSchema(reviews).omit({ 
  id: true,
  dateReviewed: true
});

export const insertReadingSessionSchema = createInsertSchema(readingSessions).omit({ 
  id: true,
  date: true
});

export const insertReadingGoalSchema = createInsertSchema(readingGoals).omit({ 
  id: true,
  booksRead: true,
  completed: true
});

// Types
export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type BookCollection = typeof bookCollections.$inferSelect;
export type InsertBookCollection = z.infer<typeof insertBookCollectionSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type ReadingSession = typeof readingSessions.$inferSelect;
export type InsertReadingSession = z.infer<typeof insertReadingSessionSchema>;

export type ReadingGoal = typeof readingGoals.$inferSelect;
export type InsertReadingGoal = z.infer<typeof insertReadingGoalSchema>;
