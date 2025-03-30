import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { ReadingGoal, InsertReadingGoal } from "@/types";
import { useToast } from "./use-toast";

export function useStats() {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  // Get current year reading goal
  const useReadingGoal = (year = currentYear) => {
    return useQuery<ReadingGoal>({
      queryKey: [`/api/reading-goals/${year}`],
      onError: () => {
        // Don't show error toast for this one as it might be a legitimate 404
        console.error(`Error fetching reading goal for ${year}`);
      }
    });
  };

  // Create or update reading goal
  const createGoalMutation = useMutation({
    mutationFn: async (goal: InsertReadingGoal) => {
      const res = await apiRequest("POST", "/api/reading-goals", goal);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/reading-goals/${variables.year}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({
        title: "Goal set",
        description: `Reading goal for ${variables.year} has been set to ${variables.targetBooks} books.`,
      });
    },
    onError: (error) => {
      console.error("Error setting reading goal:", error);
      toast({
        title: "Error",
        description: "Failed to set reading goal. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update reading goal
  const updateGoalMutation = useMutation({
    mutationFn: async ({ year, ...goalData }: { year: number, targetBooks?: number, booksRead?: number, completed?: boolean }) => {
      const res = await apiRequest("PUT", `/api/reading-goals/${year}`, goalData);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/reading-goals/${variables.year}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({
        title: "Goal updated",
        description: "Your reading goal has been updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating reading goal:", error);
      toast({
        title: "Error",
        description: "Failed to update reading goal. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Record reading session
  const recordSessionMutation = useMutation({
    mutationFn: async (session: { bookId: number, pagesRead: number, minutesSpent: number }) => {
      const res = await apiRequest("POST", "/api/reading-sessions", session);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reading-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({
        title: "Reading session recorded",
        description: "Your reading progress has been saved.",
      });
    },
    onError: (error) => {
      console.error("Error recording reading session:", error);
      toast({
        title: "Error",
        description: "Failed to save reading session. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    useReadingGoal,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    recordSession: recordSessionMutation.mutate,
    isCreatingGoal: createGoalMutation.isPending,
    isUpdatingGoal: updateGoalMutation.isPending,
    isRecordingSession: recordSessionMutation.isPending
  };
}
