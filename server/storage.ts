import { 
  Book, InsertBook, 
  Review, InsertReview, 
  ReadingSession, InsertReadingSession,
  ReadingGoal, InsertReadingGoal,
  Collection, InsertCollection,
  BookCollection, InsertBookCollection
} from "@shared/schema";

export interface IStorage {
  // Book operations
  getAllBooks(): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<Book>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  getBooksByStatus(status: string): Promise<Book[]>;
  getWishlistBooks(): Promise<Book[]>;
  getBooksByTags(tags: string[]): Promise<Book[]>;

  // Collection operations
  getAllCollections(): Promise<Collection[]>;
  getCollectionById(id: number): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: number, collection: Partial<Collection>): Promise<Collection | undefined>;
  deleteCollection(id: number): Promise<boolean>;
  
  // Book-Collection operations
  getBooksInCollection(collectionId: number): Promise<Book[]>;
  getCollectionsForBook(bookId: number): Promise<Collection[]>;
  addBookToCollection(bookCollectionData: InsertBookCollection): Promise<BookCollection>;
  removeBookFromCollection(bookId: number, collectionId: number): Promise<boolean>;

  // Review operations
  getAllReviews(): Promise<Review[]>;
  getReviewById(id: number): Promise<Review | undefined>;
  getReviewsByBookId(bookId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;

  // Reading session operations
  createReadingSession(session: InsertReadingSession): Promise<ReadingSession>;
  getReadingSessionsByBookId(bookId: number): Promise<ReadingSession[]>;
  getReadingSessionsByDateRange(startDate: Date, endDate: Date): Promise<ReadingSession[]>;
  
  // Reading goal operations
  getReadingGoal(year: number): Promise<ReadingGoal | undefined>;
  createReadingGoal(goal: InsertReadingGoal): Promise<ReadingGoal>;
  updateReadingGoal(year: number, goal: Partial<ReadingGoal>): Promise<ReadingGoal | undefined>;
}

export class MemStorage implements IStorage {
  private books: Map<number, Book>;
  private reviews: Map<number, Review>;
  private readingSessions: Map<number, ReadingSession>;
  private readingGoals: Map<number, ReadingGoal>;
  private collections: Map<number, Collection>;
  private bookCollections: Map<number, BookCollection>;
  private bookIdCounter: number;
  private reviewIdCounter: number;
  private sessionIdCounter: number;
  private goalIdCounter: number;
  private collectionIdCounter: number;
  private bookCollectionIdCounter: number;

  constructor() {
    this.books = new Map();
    this.reviews = new Map();
    this.readingSessions = new Map();
    this.readingGoals = new Map();
    this.collections = new Map();
    this.bookCollections = new Map();
    this.bookIdCounter = 1;
    this.reviewIdCounter = 1;
    this.sessionIdCounter = 1;
    this.goalIdCounter = 1;
    this.collectionIdCounter = 1;
    this.bookCollectionIdCounter = 1;

    // Initialize with some sample data (for development)
    this.initializeWithSampleData();
  }

  // Book operations
  async getAllBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  async getBookById(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.bookIdCounter++;
    const now = new Date();
    
    const book: Book = {
      id,
      title: insertBook.title,
      author: insertBook.author,
      genre: insertBook.genre,
      status: insertBook.status,
      progress: insertBook.progress || null,
      pages: insertBook.pages || null,
      description: insertBook.description || null,
      isWishlist: insertBook.isWishlist || false,
      tags: insertBook.tags || null,
      coverUrl: insertBook.coverUrl || null,
      dateAdded: now,
      dateStarted: insertBook.status === "reading" ? now : null,
      dateFinished: insertBook.status === "completed" ? now : null,
    };
    
    this.books.set(id, book);
    return book;
  }

  async updateBook(id: number, updatedFields: Partial<Book>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;

    // Handle status transitions
    if (updatedFields.status && book.status !== updatedFields.status) {
      const now = new Date();
      if (updatedFields.status === "reading" && !book.dateStarted) {
        updatedFields.dateStarted = now;
      } else if (updatedFields.status === "completed" && !book.dateFinished) {
        updatedFields.dateFinished = now;
        updatedFields.progress = 100;
      }
    }

    const updatedBook = { ...book, ...updatedFields };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  async deleteBook(id: number): Promise<boolean> {
    // Also delete all associated reviews and reading sessions
    const reviews = await this.getReviewsByBookId(id);
    reviews.forEach(review => this.deleteReview(review.id));
    
    const sessions = await this.getReadingSessionsByBookId(id);
    sessions.forEach(session => this.readingSessions.delete(session.id));
    
    return this.books.delete(id);
  }

  async getBooksByStatus(status: string): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => book.status === status);
  }

  async getWishlistBooks(): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => book.isWishlist === true);
  }

  async getBooksByTags(tags: string[]): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => {
      if (!book.tags) return false;
      return tags.some(tag => book.tags!.includes(tag));
    });
  }

  // Collection operations
  async getAllCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async getCollectionById(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async createCollection(collection: InsertCollection): Promise<Collection> {
    const id = this.collectionIdCounter++;
    const now = new Date();
    
    const newCollection: Collection = {
      id,
      name: collection.name,
      description: collection.description || null,
      coverUrl: collection.coverUrl || null,
      dateCreated: now
    };
    
    this.collections.set(id, newCollection);
    return newCollection;
  }

  async updateCollection(id: number, updateData: Partial<Collection>): Promise<Collection | undefined> {
    const collection = this.collections.get(id);
    if (!collection) return undefined;

    const updatedCollection = { ...collection, ...updateData };
    this.collections.set(id, updatedCollection);
    return updatedCollection;
  }

  async deleteCollection(id: number): Promise<boolean> {
    // Remove books from collection
    const bookCollections = Array.from(this.bookCollections.values())
      .filter(bc => bc.collectionId === id);
    
    bookCollections.forEach(bc => this.bookCollections.delete(bc.id));
    
    return this.collections.delete(id);
  }

  // Book-Collection operations
  async getBooksInCollection(collectionId: number): Promise<Book[]> {
    const bookIds = Array.from(this.bookCollections.values())
      .filter(bc => bc.collectionId === collectionId)
      .map(bc => bc.bookId);
    
    return Array.from(this.books.values())
      .filter(book => bookIds.includes(book.id));
  }

  async getCollectionsForBook(bookId: number): Promise<Collection[]> {
    const collectionIds = Array.from(this.bookCollections.values())
      .filter(bc => bc.bookId === bookId)
      .map(bc => bc.collectionId);
    
    return Array.from(this.collections.values())
      .filter(collection => collectionIds.includes(collection.id));
  }

  async addBookToCollection(bookCollectionData: InsertBookCollection): Promise<BookCollection> {
    // Check if already exists
    const exists = Array.from(this.bookCollections.values())
      .some(bc => 
        bc.bookId === bookCollectionData.bookId && 
        bc.collectionId === bookCollectionData.collectionId
      );
    
    if (exists) {
      throw new Error('Book is already in this collection');
    }
    
    const id = this.bookCollectionIdCounter++;
    const now = new Date();
    
    const bookCollection: BookCollection = {
      id,
      ...bookCollectionData,
      dateAdded: now
    };
    
    this.bookCollections.set(id, bookCollection);
    return bookCollection;
  }

  async removeBookFromCollection(bookId: number, collectionId: number): Promise<boolean> {
    const bookCollection = Array.from(this.bookCollections.values())
      .find(bc => bc.bookId === bookId && bc.collectionId === collectionId);
    
    if (!bookCollection) return false;
    
    return this.bookCollections.delete(bookCollection.id);
  }

  // Review operations
  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewById(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByBookId(bookId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.bookId === bookId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const review: Review = {
      id,
      bookId: insertReview.bookId,
      rating: insertReview.rating || null,
      content: insertReview.content || null,
      tags: insertReview.tags || null,
      dateReviewed: new Date(),
    };
    
    this.reviews.set(id, review);
    return review;
  }

  async updateReview(id: number, updatedFields: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;

    const updatedReview = { ...review, ...updatedFields };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }

  // Reading session operations
  async createReadingSession(insertSession: InsertReadingSession): Promise<ReadingSession> {
    const id = this.sessionIdCounter++;
    const session: ReadingSession = {
      id,
      ...insertSession,
      date: new Date(),
    };
    
    this.readingSessions.set(id, session);
    
    // Update book progress based on pages read
    const book = await this.getBookById(insertSession.bookId);
    if (book && book.pages) {
      const totalPagesRead = (await this.getReadingSessionsByBookId(book.id))
        .reduce((total, session) => total + session.pagesRead, 0);
      
      const progress = Math.min(Math.floor((totalPagesRead / book.pages) * 100), 100);
      
      if (book.progress === null || progress > book.progress) {
        await this.updateBook(book.id, { progress });
      }
      
      // Mark as completed if 100% progress
      if (progress === 100 && book.status !== "completed") {
        await this.updateBook(book.id, { 
          status: "completed", 
          dateFinished: new Date(),
          progress: 100
        });
        
        // Update reading goal if applicable
        if (book.dateFinished) {
          const year = book.dateFinished.getFullYear();
          const goal = await this.getReadingGoal(year);
          
          if (goal) {
            const currentBooks = goal.booksRead || 0;
            await this.updateReadingGoal(year, { 
              booksRead: currentBooks + 1,
              completed: (currentBooks + 1) >= goal.targetBooks
            });
          }
        }
      }
    }
    
    return session;
  }

  async getReadingSessionsByBookId(bookId: number): Promise<ReadingSession[]> {
    return Array.from(this.readingSessions.values())
      .filter(session => session.bookId === bookId);
  }

  async getReadingSessionsByDateRange(startDate: Date, endDate: Date): Promise<ReadingSession[]> {
    return Array.from(this.readingSessions.values())
      .filter(session => {
        // Safety check for null dates
        if (!session.date) return false;
        return session.date >= startDate && session.date <= endDate;
      });
  }

  // Reading goal operations
  async getReadingGoal(year: number): Promise<ReadingGoal | undefined> {
    const goals = Array.from(this.readingGoals.values());
    return goals.find(goal => goal.year === year);
  }

  async createReadingGoal(insertGoal: InsertReadingGoal): Promise<ReadingGoal> {
    // Check if a goal for the year already exists
    const existingGoal = await this.getReadingGoal(insertGoal.year);
    if (existingGoal) {
      return this.updateReadingGoal(insertGoal.year, { 
        targetBooks: insertGoal.targetBooks 
      }) as Promise<ReadingGoal>;
    }
    
    const id = this.goalIdCounter++;
    const goal: ReadingGoal = {
      id,
      ...insertGoal,
      booksRead: 0,
      completed: false
    };
    
    this.readingGoals.set(id, goal);
    return goal;
  }

  async updateReadingGoal(year: number, updatedFields: Partial<ReadingGoal>): Promise<ReadingGoal | undefined> {
    const goal = await this.getReadingGoal(year);
    if (!goal) return undefined;

    const updatedGoal = { ...goal, ...updatedFields };
    this.readingGoals.set(goal.id, updatedGoal);
    return updatedGoal;
  }

  // Initialize with sample data for development
  private initializeWithSampleData() {
    // Sample books
    const sampleBooks: InsertBook[] = [
      {
        title: "Atomic Habits",
        author: "James Clear",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        genre: "Self-Help",
        pages: 320,
        status: "reading",
        progress: 65,
        description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results."
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
        genre: "History",
        pages: 464,
        status: "reading",
        progress: 32,
        description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be 'human.'"
      },
      {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
        genre: "Finance",
        pages: 256,
        status: "want_to_read",
        progress: 0,
        description: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Money—investing, personal finance, and business decisions—is typically taught as a math-based field, where data and formulas tell us exactly what to do."
      },
      {
        title: "Deep Work",
        author: "Cal Newport",
        coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
        genre: "Productivity",
        pages: 304,
        status: "want_to_read",
        progress: 0,
        description: "In Deep Work, author and professor Cal Newport flips the narrative on impact in a connected age. Instead of arguing distraction is bad, he instead celebrates the power of its opposite. Dividing this book into two parts, he first makes the case that in almost any profession, cultivating a deep work ethic will produce massive benefits."
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        coverUrl: "https://images.unsplash.com/photo-1495640452828-3df6795cf69b",
        genre: "Fiction",
        pages: 197,
        status: "completed",
        progress: 100,
        description: "Paulo Coelho's enchanting novel has inspired a devoted following around the world. This story, dazzling in its powerful simplicity and soul-stirring wisdom, is about an Andalusian shepherd boy named Santiago who travels from his homeland in Spain to the Egyptian desert in search of a treasure buried near the Pyramids."
      },
      {
        title: "Educated",
        author: "Tara Westover",
        coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646",
        genre: "Memoir",
        pages: 352,
        status: "completed",
        progress: 100,
        description: "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara's older brothers became violent."
      }
    ];

    // Add sample books
    sampleBooks.forEach(book => {
      const now = new Date();
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const dateAdded = twoMonthsAgo;
      let dateStarted = null;
      let dateFinished = null;
      
      if (book.status === "reading" || book.status === "completed") {
        dateStarted = oneMonthAgo;
      }
      
      if (book.status === "completed") {
        dateFinished = now;
      }
      
      const id = this.bookIdCounter++;
      const fullBook: Book = {
        id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        status: book.status,
        progress: book.progress || null,
        pages: book.pages || null,
        description: book.description || null,
        dateAdded,
        dateStarted,
        dateFinished,
        isWishlist: false,
        tags: null,
        coverUrl: book.coverUrl || null
      };
      
      this.books.set(id, fullBook);
    });

    // Add sample reviews
    const sampleReviews: InsertReview[] = [
      {
        bookId: 5, // The Alchemist
        rating: 4.5,
        content: "A beautiful and inspiring tale about following your dreams. The simple prose hides deeper philosophical meanings that resonate deeply. This book taught me about perseverance and the importance of listening to your heart.",
        tags: ["Fiction", "Philosophy"]
      },
      {
        bookId: 6, // Educated
        rating: 5.0,
        content: "An extraordinary memoir that highlights the power of education and self-determination. Westover's journey is both heartbreaking and inspiring. Her resilience in the face of overwhelming obstacles is a testament to the human spirit and the transformative power of knowledge.",
        tags: ["Memoir", "Biography"]
      }
    ];

    sampleReviews.forEach(review => {
      const id = this.reviewIdCounter++;
      const fullReview: Review = {
        id,
        bookId: review.bookId,
        rating: review.rating || null,
        content: review.content || null,
        tags: review.tags || null,
        dateReviewed: new Date()
      };
      
      this.reviews.set(id, fullReview);
    });

    // Add sample reading sessions
    const sampleSessions: InsertReadingSession[] = [
      { bookId: 1, pagesRead: 30, minutesSpent: 45 },
      { bookId: 1, pagesRead: 25, minutesSpent: 40 },
      { bookId: 1, pagesRead: 40, minutesSpent: 65 },
      { bookId: 2, pagesRead: 35, minutesSpent: 55 },
      { bookId: 2, pagesRead: 20, minutesSpent: 30 },
      { bookId: 5, pagesRead: 197, minutesSpent: 240 },
      { bookId: 6, pagesRead: 352, minutesSpent: 380 }
    ];

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    sampleSessions.forEach((session, index) => {
      const id = this.sessionIdCounter++;
      const date = new Date(oneWeekAgo);
      date.setDate(date.getDate() + index % 7);
      
      const fullSession: ReadingSession = {
        id,
        ...session,
        date
      };
      
      this.readingSessions.set(id, fullSession);
    });

    // Add sample reading goal
    const currentYear = new Date().getFullYear();
    const sampleGoal: InsertReadingGoal = {
      year: currentYear,
      targetBooks: 30
    };

    const goalId = this.goalIdCounter++;
    const fullGoal: ReadingGoal = {
      id: goalId,
      ...sampleGoal,
      booksRead: 17, // As shown in the mockup
      completed: false
    };
    
    this.readingGoals.set(goalId, fullGoal);

    // Add sample collections
    const sampleCollections: InsertCollection[] = [
      {
        name: "Fantasy Favorites",
        description: "My favorite fantasy novels of all time"
      },
      {
        name: "Non-Fiction Classics",
        description: "Essential non-fiction reads"
      },
      {
        name: "Reading List 2025",
        description: "Books I want to read this year"
      },
      {
        name: "Wishlist",
        description: "Books I'd like to purchase"
      }
    ];

    sampleCollections.forEach(collection => {
      const id = this.collectionIdCounter++;
      const fullCollection: Collection = {
        id,
        name: collection.name,
        description: collection.description || null,
        dateCreated: new Date(),
        coverUrl: null
      };
      
      this.collections.set(id, fullCollection);
    });

    // Add books to collections
    const collectionAssignments = [
      { bookId: 5, collectionId: 1 },  // The Alchemist to Fantasy Favorites
      { bookId: 1, collectionId: 2 },  // Atomic Habits to Non-Fiction Classics
      { bookId: 2, collectionId: 2 },  // Sapiens to Non-Fiction Classics
      { bookId: 3, collectionId: 3 },  // Psychology of Money to Reading List 2025
      { bookId: 4, collectionId: 3 },  // Deep Work to Reading List 2025
    ];

    collectionAssignments.forEach(assignment => {
      const id = this.bookCollectionIdCounter++;
      const bookCollection: BookCollection = {
        id,
        bookId: assignment.bookId,
        collectionId: assignment.collectionId,
        dateAdded: new Date()
      };
      
      this.bookCollections.set(id, bookCollection);
    });
  }
}

export const storage = new MemStorage();
