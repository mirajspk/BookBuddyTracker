import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book, Review } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useReviews } from "@/hooks/useReviews";
import { PlusIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
import AddReviewModal from "@/components/AddReviewModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Reviews = () => {
  const { toast } = useToast();
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  // Fetch all reviews
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    }
  });

  // Fetch all books for review selection
  const { data: books = [], isLoading: isLoadingBooks } = useQuery<Book[]>({
    queryKey: ["/api/books"],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    }
  });

  const { addReview, updateReview, deleteReview } = useReviews();

  // Handle add review
  const handleAddReview = (review: any) => {
    addReview(review);
    setAddReviewOpen(false);
  };

  // Handle edit review
  const handleEditReview = (review: any) => {
    updateReview(review);
    setEditingReview(null);
  };

  // Handle delete review
  const handleDeleteReview = (reviewId: number) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview(reviewId);
    }
  };

  // Helper to get book by id
  const getBookById = (bookId: number): Book | undefined => {
    return books.find(book => book.id === bookId);
  };

  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.dateReviewed).getTime() - new Date(a.dateReviewed).getTime()
  );

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-medium">My Book Reviews</h3>
        <Button 
          onClick={() => setAddReviewOpen(true)} 
          className="px-4 py-2 bg-primary text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          <span>Write Review</span>
        </Button>
      </div>
      
      <div className="space-y-6">
        {isLoadingReviews || isLoadingBooks ? (
          // Skeleton loaders for reviews
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="md:flex p-6">
                <div className="md:flex-shrink-0">
                  <Skeleton className="h-48 w-full md:w-36" />
                </div>
                <div className="md:ml-6 space-y-4 mt-4 md:mt-0">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : sortedReviews.length > 0 ? (
          sortedReviews.map((review) => {
            const book = getBookById(review.bookId);
            
            return (
              <div key={review.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img 
                      src={book?.coverUrl || "https://via.placeholder.com/150x200?text=No+Cover"} 
                      alt={`${book?.title || "Unknown Book"} cover`} 
                      className="h-48 w-full md:w-36 object-cover" 
                    />
                  </div>
                  <div className="p-6 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium mb-1">{book?.title || "Unknown Book"}</h3>
                        <p className="text-sm text-gray-500 mb-2">{book?.author || "Unknown Author"}</p>
                        <div className="flex text-yellow-500 mb-3">
                          {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            const filled = starValue <= (review.rating || 0);
                            const halfFilled = !filled && starValue - 0.5 <= (review.rating || 0);
                            
                            return (
                              <svg 
                                key={i}
                                xmlns="http://www.w3.org/2000/svg" 
                                className="w-5 h-5" 
                                viewBox="0 0 24 24" 
                                fill={filled ? "currentColor" : "none"}
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                {filled ? (
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                ) : halfFilled ? (
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
                          <span className="ml-2 text-gray-600 text-sm">{review.rating}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingReview(review)}
                          className="p-1 text-gray-500 hover:text-primary"
                        >
                          <Edit2Icon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-1 text-gray-500 hover:text-primary"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{review.content}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        {review.tags && review.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        Reviewed on {review.dateReviewed ? format(new Date(review.dateReviewed), 'MMMM d, yyyy') : 'Unknown date'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h3 className="text-lg font-medium mb-4">You haven't written any reviews yet</h3>
            <p className="text-gray-500 mb-8">Share your thoughts about the books you've read</p>
            <Button 
              onClick={() => setAddReviewOpen(true)} 
              className="px-6 py-3 bg-primary text-white"
            >
              Write Your First Review
            </Button>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={addReviewOpen || !!editingReview}
        onClose={() => {
          setAddReviewOpen(false);
          setEditingReview(null);
        }}
        onSave={editingReview ? handleEditReview : handleAddReview}
        books={books}
        review={editingReview}
      />
    </>
  );
};

export default Reviews;
