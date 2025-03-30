import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book, BookStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { FilterIcon, PlusIcon } from "lucide-react";
import BookCard from "@/components/BookCard";
import BookDetailModal from "@/components/BookDetailModal";
import AddBookModal from "@/components/AddBookModal";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Library = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<BookStatus | "all">("reading");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addBookOpen, setAddBookOpen] = useState(false);
  
  // Filters
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("any");
  const [yearFilter, setYearFilter] = useState<string>("all");

  // Fetch all books
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    }
  });

  const { addBook, updateBook } = useBooks();

  // Handle add book
  const handleAddBook = (book: any) => {
    addBook(book);
    setAddBookOpen(false);
  };

  // Filter books based on active tab and filters
  const filteredBooks = books.filter(book => {
    // First filter by status tab
    if (activeTab !== "all" && book.status !== activeTab) {
      return false;
    }

    // Then apply additional filters
    if (filterOpen) {
      // Genre filter
      if (genreFilter !== "all" && book.genre !== genreFilter) {
        return false;
      }

      // Rating filter (requires joining with reviews data)
      // For simplicity, we'll just include this as a placeholder
      // In a real app, you'd join with review data or use a backend query

      // Year filter
      if (yearFilter !== "all") {
        const year = parseInt(yearFilter);
        const bookYear = book.dateFinished ? new Date(book.dateFinished).getFullYear() : null;
        if (!bookYear || bookYear !== year) {
          return false;
        }
      }
    }

    return true;
  });

  // Get unique genres for filter
  const genres = Array.from(new Set(books.map(book => book.genre)));

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as BookStatus | "all")}
            className="w-full"
          >
            <TabsList className="border-b border-gray-200 w-full justify-start">
              <TabsTrigger value="reading" className="pb-2 font-medium text-gray-600 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Currently Reading
              </TabsTrigger>
              <TabsTrigger value="completed" className="pb-2 font-medium text-gray-600 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Completed
              </TabsTrigger>
              <TabsTrigger value="want_to_read" className="pb-2 font-medium text-gray-600 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Want to Read
              </TabsTrigger>
              <TabsTrigger value="all" className="pb-2 font-medium text-gray-600 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                All Books
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center"
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            <span>Filter</span>
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => setAddBookOpen(true)}
            className="flex items-center bg-primary text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            <span>Add Book</span>
          </Button>
        </div>
      </div>
      
      {/* Filter panel */}
      {filterOpen && (
        <Card className="bg-white mb-6 p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Read</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full bg-gray-700 hover:bg-gray-800" onClick={() => {}}>
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {isLoading ? (
          // Skeleton loaders for books
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <Skeleton className="w-full h-56" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-full mt-2" />
              </div>
            </div>
          ))
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onClick={() => setSelectedBook(book)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No books found matching your criteria</p>
            <Button onClick={() => setAddBookOpen(true)}>Add Your First Book</Button>
          </div>
        )}
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={(updatedBook) => updateBook(updatedBook)}
        />
      )}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        onAddBook={handleAddBook}
      />
    </>
  );
};

export default Library;
