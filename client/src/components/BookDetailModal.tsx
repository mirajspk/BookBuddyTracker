import { useState, useEffect } from "react";
import { Book, Review, ReadingSession } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { X as CloseIcon, Edit as EditIcon, BookOpen as BookOpenIcon, MessageSquare as MessageSquareIcon, Share2 as ShareIcon } from "lucide-react";
import ProgressBar from "./ProgressBar";
import AddReviewModal from "./AddReviewModal";
import { useReviews } from "@/hooks/useReviews";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface BookDetailModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (book: Book) => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose, onUpdate }) => {
  const [progress, setProgress] = useState(book.progress || 0);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const { toast } = useToast();

  // Update progress state when book prop changes
  useEffect(() => {
    setProgress(book.progress || 0);
  }, [book]);

  // Fetch reviews for this book
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/books/${book.id}/reviews`],
    enabled: isOpen && !!book.id,
  });

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
  };

  const averageRating = calculateAverageRating();

  // Check if user has already reviewed this book
  const userReview = reviews.length > 0 ? reviews[0] : null;

  const { addReview, updateReview } = useReviews();

  // Handle updating reading progress
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseInt(e.target.value));
  };

  const handleProgressUpdate = async () => {
    setUpdatingProgress(true);
    
    try {
      // Update book progress
      const updatedBook = {
        ...book,
        progress,
        // If progress is 100%, mark as completed
        status: progress >= 100 ? "completed" : book.status,
        dateFinished: progress >= 100 ? new Date().toISOString() : book.dateFinished
      };
      
      // Update book via API
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      
      // Also create a reading session to track the progress
      if (book.progress !== progress) {
        const pagesRead = book.pages ? Math.floor((progress - (book.progress || 0)) / 100 * book.pages) : 0;
        
        if (pagesRead > 0) {
          const readingSession = {
            bookId: book.id,
            pagesRead,
            minutesSpent: Math.round(pagesRead * 1.5) // Estimate reading time (1.5 min per page)
          };
          
          const sessionResponse = await fetch('/api/reading-sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(readingSession),
          });
          
          if (!sessionResponse.ok) {
            console.error('Failed to create reading session');
          }
        }
      }
      
      // Update cache and notify parent component
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      queryClient.invalidateQueries({ queryKey: [`/api/books/${book.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/reading'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/completed'] });
      
      onUpdate(updatedBook);
      
      toast({
        title: "Progress updated",
        description: progress >= 100 
          ? "Congratulations on finishing the book!" 
          : "Your reading progress has been updated.",
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Handle adding or updating a review
  const handleSaveReview = (review: any) => {
    if (userReview) {
      updateReview({
        ...userReview,
        ...review
      });
    } else {
      addReview(review);
    }
    setShowAddReview(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          
          <div className="bg-white">
            <div className="sm:flex px-4 pt-5 pb-4 sm:p-6">
              <div className="sm:flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <img
                  src={book.coverUrl || "https://via.placeholder.com/200x300?text=No+Cover"}
                  alt={`${book.title} cover`}
                  className="w-full sm:w-36 rounded shadow"
                />
              </div>
              
              <div className="sm:flex-1">
                <h3 className="text-xl font-medium mb-1">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                
                <div className="flex text-yellow-500 mb-4">
                  <StarRating rating={averageRating} />
                  <span className="ml-2 text-gray-600 text-sm">
                    {averageRating > 0 ? averageRating.toFixed(1) : "Not rated"}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{book.genre}</span>
                  {book.status === "reading" && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Currently Reading</span>
                  )}
                  {book.status === "completed" && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
                  )}
                  {book.status === "want_to_read" && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Want to Read</span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Pages</span>
                    <span className="text-sm font-medium">{book.pages || "Unknown"}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`text-sm font-medium ${
                      book.status === "reading" ? "text-blue-600" :
                      book.status === "completed" ? "text-green-600" :
                      "text-yellow-600"
                    }`}>
                      {book.status === "reading" 
                        ? "Currently Reading" 
                        : book.status === "completed" 
                          ? "Completed" 
                          : "Want to Read"}
                    </span>
                  </div>
                  
                  {book.status === "reading" && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Progress</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${book.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{book.progress || 0}%</span>
                      </div>
                    </div>
                  )}
                  
                  {book.status === "completed" && book.dateFinished && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Date Finished</span>
                      <span className="text-sm font-medium">
                        {format(new Date(book.dateFinished), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => {
                    if (book.status === "want_to_read") {
                      // Change status to reading and set initial progress
                      onUpdate({
                        ...book,
                        status: "reading",
                        progress: 0,
                        dateStarted: new Date().toISOString()
                      });
                    } else {
                      // Open update progress dialog
                      // This dialog is part of this component, so we don't need to do anything
                    }
                  }}
                >
                  <BookOpenIcon className="h-4 w-4 mr-1.5" />
                  <span>
                    {book.status === "want_to_read" 
                      ? "Start Reading" 
                      : "Update Progress"}
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowAddReview(true)}
                >
                  <MessageSquareIcon className="h-4 w-4 mr-1.5" />
                  <span>{userReview ? "Edit Review" : "Write Review"}</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => {
                    // Simple share functionality
                    navigator.clipboard.writeText(`Check out "${book.title}" by ${book.author}`);
                    toast({
                      title: "Copied to clipboard",
                      description: "Book information copied to clipboard",
                    });
                  }}
                >
                  <ShareIcon className="h-4 w-4 mr-1.5" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
            
            {book.status === "reading" && (
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h4 className="text-base font-medium mb-4">Update reading progress</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Progress: {progress}%</span>
                      <span className="text-sm">{book.pages ? Math.round(progress * book.pages / 100) : 0} of {book.pages || "?"} pages</span>
                    </div>
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleProgressChange}
                      className="w-full"
                    />
                  </div>
                  
                  <Button
                    onClick={handleProgressUpdate}
                    className="w-full bg-primary text-white"
                    disabled={updatingProgress || progress === book.progress}
                  >
                    {updatingProgress ? "Updating..." : "Save Progress"}
                  </Button>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h4 className="text-base font-medium mb-4">About this book</h4>
              <p className="text-sm text-gray-600">
                {book.description || "No description available."}
              </p>
            </div>
            
            {userReview && (
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h4 className="text-base font-medium mb-4">Your Review</h4>
                <div className="text-sm text-gray-600 mb-2">{userReview.content}</div>
                <div className="flex justify-end">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-primary" 
                    onClick={() => setShowAddReview(true)}
                  >
                    Edit review
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Review Modal */}
      {showAddReview && (
        <AddReviewModal
          isOpen={showAddReview}
          onClose={() => setShowAddReview(false)}
          onSave={handleSaveReview}
          review={userReview}
          books={[book]} // Just pass the current book
        />
      )}
    </>
  );
};

export default BookDetailModal;
