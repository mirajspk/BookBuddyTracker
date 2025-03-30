import { Book } from "@/types";
import StarRating from "./StarRating";
import ProgressBar from "./ProgressBar";
import { useQuery } from "@tanstack/react-query";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  // Fetch reviews for this book to get the rating
  const { data: reviews = [] } = useQuery({
    queryKey: [`/api/books/${book.id}/reviews`],
    enabled: !!book.id,
  });

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, review: any) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
  };

  const averageRating = calculateAverageRating();

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = "bg-blue-100 text-blue-800"; // default for want_to_read
    
    if (status === "completed") {
      bgColor = "bg-green-100 text-green-800";
    }
    
    return (
      <span className={`inline-block ${bgColor} text-xs px-2 py-1 rounded mt-2`}>
        {status === "want_to_read" 
          ? "Want to read" 
          : status === "reading" 
            ? "Currently Reading" 
            : "Completed"}
      </span>
    );
  };

  return (
    <div 
      onClick={onClick}
      className="book-card bg-white rounded-lg shadow overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <img 
        src={book.coverUrl || "https://via.placeholder.com/300x400?text=No+Cover"} 
        alt={`${book.title} cover`} 
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10">{book.title}</h3>
        <p className="text-xs text-gray-500 mb-2">{book.author}</p>
        
        <div className="flex text-yellow-500 text-xs mb-2">
          <StarRating rating={averageRating} size="sm" />
          <span className="ml-1 text-gray-600">{averageRating > 0 ? averageRating.toFixed(1) : "Not rated"}</span>
        </div>
        
        {book.status === "reading" && (
          <>
            <ProgressBar value={book.progress || 0} />
            <p className="text-xs text-gray-500 mt-1">{book.progress}% complete</p>
          </>
        )}
        
        {book.status !== "reading" && (
          <StatusBadge status={book.status} />
        )}
      </div>
    </div>
  );
};

export default BookCard;
