import { Review, Book } from "@/types";
import { useQuery } from "@tanstack/react-query";
import StarRating from "./StarRating";
import { format } from "date-fns";
import { Edit2Icon, Trash2Icon } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete }) => {
  // Fetch book details
  const { data: book } = useQuery<Book>({
    queryKey: [`/api/books/${review.bookId}`],
    enabled: !!review.bookId,
  });

  if (!book) {
    return null; // Or render a loading state/skeleton
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img 
            src={book.coverUrl || "https://via.placeholder.com/150x200?text=No+Cover"} 
            alt={`${book.title} cover`} 
            className="h-48 w-full md:w-36 object-cover" 
          />
        </div>
        <div className="p-6 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium mb-1">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{book.author}</p>
              <div className="flex text-yellow-500 mb-3">
                <StarRating rating={review.rating || 0} />
                <span className="ml-2 text-gray-600 text-sm">{review.rating?.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={onEdit} 
                className="p-1 text-gray-500 hover:text-primary"
              >
                <Edit2Icon className="w-4 h-4" />
              </button>
              <button 
                onClick={onDelete} 
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
};

export default ReviewCard;
