import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Review } from "@/types";
import { useToast } from "./use-toast";

export function useReviews() {
  const { toast } = useToast();

  // Add a new review
  const addReviewMutation = useMutation({
    mutationFn: async (review: any) => {
      const res = await apiRequest("POST", "/api/reviews", review);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: [`/api/books/${variables.bookId}/reviews`] });
      toast({
        title: "Review added",
        description: "Your review has been successfully posted.",
      });
    },
    onError: (error) => {
      console.error("Error adding review:", error);
      toast({
        title: "Error",
        description: "Failed to post review. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update an existing review
  const updateReviewMutation = useMutation({
    mutationFn: async (review: Partial<Review> & { id: number }) => {
      const { id, ...reviewData } = review;
      const res = await apiRequest("PUT", `/api/reviews/${id}`, reviewData);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/books/${variables.bookId}/reviews`] });
      toast({
        title: "Review updated",
        description: "Your review has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete a review
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const res = await apiRequest("DELETE", `/api/reviews/${reviewId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: "Review deleted",
        description: "Your review has been successfully removed.",
      });
    },
    onError: (error) => {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    addReview: addReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
    isAddingReview: addReviewMutation.isPending,
    isUpdatingReview: updateReviewMutation.isPending,
    isDeletingReview: deleteReviewMutation.isPending
  };
}
