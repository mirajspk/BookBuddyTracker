import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/types";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, BookOpenIcon, PlusIcon } from "lucide-react";
import BookCard from "@/components/BookCard";
import AddBookModal from "@/components/AddBookModal";

const Discover = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [bookToAdd, setBookToAdd] = useState<any | null>(null);

  const { addBook } = useBooks();

  useEffect(() => {
    // If we have a search term, search Google Books API after a delay
    if (searchTerm.trim().length > 0) {
      const delayDebounceFn = setTimeout(() => {
        searchBooks(searchTerm);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchBooks = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.items) {
        const books = data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
          description: item.volumeInfo.description || 'No description available',
          coverUrl: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover',
          pages: item.volumeInfo.pageCount || 0,
          genre: item.volumeInfo.categories ? item.volumeInfo.categories[0] : 'Uncategorized',
          publishedDate: item.volumeInfo.publishedDate,
          googleBooksLink: item.volumeInfo.infoLink,
          averageRating: item.volumeInfo.averageRating || 0,
        }));
        
        setSearchResults(books);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching books:", error);
      toast({
        title: "Error",
        description: "Failed to search books. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToLibrary = (book: any) => {
    setBookToAdd({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      genre: book.genre,
      pages: book.pages,
      description: book.description,
      status: "want_to_read", // Default status
      progress: 0
    });
    setAddBookOpen(true);
  };

  const handleAddBook = (book: any) => {
    addBook(book);
    setAddBookOpen(false);
    setBookToAdd(null);
    toast({
      title: "Success",
      description: `"${book.title}" has been added to your library.`,
    });
  };

  // Popular books for the Popular tab - typically this would be from an API
  const popularBooks = [
    {
      id: "pop1",
      title: "The Midnight Library",
      author: "Matt Haig",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
      genre: "Fiction",
      pages: 304,
      description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
      publishedDate: "2020-08-13",
      averageRating: 4.2
    },
    {
      id: "pop2",
      title: "Atomic Habits",
      author: "James Clear",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
      genre: "Self-Help",
      pages: 320,
      description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day.",
      publishedDate: "2018-10-16",
      averageRating: 4.8
    },
    {
      id: "pop3",
      title: "Project Hail Mary",
      author: "Andy Weir",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
      genre: "Science Fiction",
      pages: 496,
      description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.",
      publishedDate: "2021-05-04",
      averageRating: 4.6
    },
    {
      id: "pop4",
      title: "The Four Winds",
      author: "Kristin Hannah",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
      genre: "Historical Fiction",
      pages: 464,
      description: "From the #1 New York Times bestselling author of The Nightingale and The Great Alone comes an epic novel of love and heroism and hope, set against the backdrop of one of America's most defining eras—the Great Depression.",
      publishedDate: "2021-02-02",
      averageRating: 4.5
    }
  ];

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium">Discover Books</h3>
          <button 
            onClick={() => setAddBookOpen(true)}
            className="flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm"
          >
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Book
          </button>
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Search books by title, author, genre, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" />
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          You can search by book title, author, genre, or ISBN number
        </div>
      </div>
      
      {searchTerm ? (
        <div>
          <h4 className="font-medium mb-4">Search Results</h4>
          
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {searchResults.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow overflow-hidden book-card">
                  <img
                    src={book.coverUrl}
                    alt={`${book.title} cover`}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10">{book.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{book.author}</p>
                    
                    {book.averageRating > 0 && (
                      <div className="flex text-yellow-500 text-xs mb-2">
                        {[...Array(5)].map((_, i) => {
                          const filled = i < Math.floor(book.averageRating);
                          const half = !filled && i < Math.floor(book.averageRating + 0.5);
                          
                          return (
                            <svg 
                              key={i}
                              xmlns="http://www.w3.org/2000/svg" 
                              className="w-4 h-4" 
                              viewBox="0 0 24 24" 
                              fill={filled ? "currentColor" : "none"}
                              stroke="currentColor" 
                              strokeWidth="2"
                            >
                              {filled ? (
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              ) : half ? (
                                <>
                                  <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 Z" />
                                  <path d="M12 2 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 Z" fill="currentColor" />
                                </>
                              ) : (
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              )}
                            </svg>
                          );
                        })}
                        <span className="ml-1 text-gray-600">{book.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => handleAddToLibrary(book)}
                      className="w-full mt-2 bg-primary hover:bg-primary-dark text-white"
                      size="sm"
                    >
                      <PlusIcon className="mr-1 h-4 w-4" />
                      Add to Library
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <Tabs defaultValue="popular" className="mb-6">
            <TabsList>
              <TabsTrigger value="popular">Popular Books</TabsTrigger>
              <TabsTrigger value="new">New Releases</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {popularBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow overflow-hidden book-card">
                <img
                  src={book.coverUrl}
                  alt={`${book.title} cover`}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10">{book.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{book.author}</p>
                  
                  <div className="flex text-yellow-500 text-xs mb-2">
                    {[...Array(5)].map((_, i) => {
                      const filled = i < Math.floor(book.averageRating);
                      const half = !filled && i < Math.floor(book.averageRating + 0.5);
                      
                      return (
                        <svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          className="w-4 h-4" 
                          viewBox="0 0 24 24" 
                          fill={filled ? "currentColor" : "none"}
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          {filled ? (
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          ) : half ? (
                            <>
                              <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 Z" />
                              <path d="M12 2 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 Z" fill="currentColor" />
                            </>
                          ) : (
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          )}
                        </svg>
                      );
                    })}
                    <span className="ml-1 text-gray-600">{book.averageRating.toFixed(1)}</span>
                  </div>
                  
                  <Button 
                    onClick={() => handleAddToLibrary(book)}
                    className="w-full mt-2 bg-primary hover:bg-primary-dark text-white"
                    size="sm"
                  >
                    <PlusIcon className="mr-1 h-4 w-4" />
                    Add to Library
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={addBookOpen}
        onClose={() => {
          setAddBookOpen(false);
          setBookToAdd(null);
        }}
        onAddBook={handleAddBook}
        initialBook={bookToAdd}
      />
    </>
  );
};

export default Discover;
