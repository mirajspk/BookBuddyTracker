import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
  size?: "sm" | "md" | "lg";
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange,
  editable = false,
  size = "md"
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  const className = starSizes[size];
  
  return (
    <div className="flex text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => {
        const starValue = star;
        const displayRating = hoverRating || rating;
        const filled = starValue <= displayRating;
        const halfFilled = !filled && starValue - 0.5 <= displayRating;
        
        return (
          <div 
            key={star}
            className={`${editable ? "cursor-pointer" : ""}`}
            onClick={() => editable && onRatingChange && onRatingChange(starValue)}
            onMouseEnter={() => editable && setHoverRating(starValue)}
            onMouseLeave={() => editable && setHoverRating(0)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={className}
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
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
