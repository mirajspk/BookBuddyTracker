import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Book, Review } from "@/types";
import StarRating from "./StarRating";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertReviewSchema } from "@shared/schema";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (review: any) => void;
  review?: Review | null;
  books: Book[];
}

// Extend the insert schema with form validations
const reviewFormSchema = insertReviewSchema.extend({
  bookId: z.number({
    required_error: "Please select a book"
  }),
  rating: z.number({
    required_error: "Please provide a rating"
  }).min(0.5, "Rating must be at least 0.5").max(5, "Rating cannot exceed 5"),
  content: z.string().min(10, "Review content must be at least 10 characters"),
  tags: z.array(z.string()).optional(),
  tagInput: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

const AddReviewModal: React.FC<AddReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  review = null,
  books 
}) => {
  const { register, handleSubmit, control, setValue, reset, watch, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      bookId: 0,
      rating: 0,
      content: "",
      tags: [],
      tagInput: ""
    }
  });

  const tags = watch("tags") || [];
  const tagInput = watch("tagInput") || "";

  // Reset form when modal opens/closes or review changes
  useEffect(() => {
    if (isOpen) {
      if (review) {
        reset({
          bookId: review.bookId,
          rating: review.rating || 0,
          content: review.content || "",
          tags: review.tags || [],
          tagInput: ""
        });
      } else {
        reset({
          bookId: 0,
          rating: 0,
          content: "",
          tags: [],
          tagInput: ""
        });
      }
    }
  }, [isOpen, review, reset]);

  const onSubmit = (data: ReviewFormValues) => {
    const reviewData = {
      id: review?.id,
      bookId: data.bookId,
      rating: data.rating,
      content: data.content,
      tags: data.tags,
    };
    
    onSave(reviewData);
  };

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating);
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = watch("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setValue("tagInput", "");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = watch("tags") || [];
    setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {review ? "Edit Review" : "Write a Review"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="book" className="text-sm font-medium text-gray-700">Book</Label>
            <Controller
              name="bookId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                  disabled={!!review} // Disable if editing an existing review
                >
                  <SelectTrigger className={errors.bookId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id.toString()}>
                        {book.title} by {book.author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.bookId && (
              <p className="mt-1 text-xs text-red-500">{errors.bookId.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="rating" className="text-sm font-medium text-gray-700 mb-1 block">Rating</Label>
            <div className="flex items-center">
              <StarRating
                rating={watch("rating")}
                onRatingChange={handleRatingChange}
                editable
              />
              <span className="ml-2 text-sm">
                {watch("rating") > 0 ? watch("rating").toFixed(1) : "Not rated"}
              </span>
            </div>
            {errors.rating && (
              <p className="mt-1 text-xs text-red-500">{errors.rating.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">Review</Label>
            <Textarea
              id="content"
              rows={5}
              placeholder="Share your thoughts about this book..."
              {...register("content")}
              className={`mt-1 ${errors.content ? "border-red-500" : ""}`}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700 mb-1 block">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                id="tagInput"
                {...register("tagInput")}
                placeholder="Add tags (e.g., fiction, philosophy, favorite)"
                onKeyDown={handleTagKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="ml-2"
              >
                Add
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Press Enter to add a tag
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white">
              {review ? "Save Changes" : "Post Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewModal;
