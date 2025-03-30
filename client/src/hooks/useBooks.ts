import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Book } from "@/types";
import { useToast } from "./use-toast";

export function useBooks() {
  const { toast } = useToast();

  // Add a new book
  const addBookMutation = useMutation({
    mutationFn: async (book: any) => {
      const res = await apiRequest("POST", "/api/books", book);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/want_to_read'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/reading'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/completed'] });
      toast({
        title: "Book added",
        description: "Book has been successfully added to your library.",
      });
    },
    onError: (error) => {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update an existing book
  const updateBookMutation = useMutation({
    mutationFn: async (book: Partial<Book> & { id: number }) => {
      const { id, ...bookData } = book;
      const res = await apiRequest("PUT", `/api/books/${id}`, bookData);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      queryClient.invalidateQueries({ queryKey: [`/api/books/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/want_to_read'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/reading'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/completed'] });
      toast({
        title: "Book updated",
        description: "Book has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating book:", error);
      toast({
        title: "Error",
        description: "Failed to update book. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete a book
  const deleteBookMutation = useMutation({
    mutationFn: async (bookId: number) => {
      const res = await apiRequest("DELETE", `/api/books/${bookId}`);
      return res.json();
    },
    onSuccess: (_, bookId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      queryClient.invalidateQueries({ queryKey: [`/api/books/${bookId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/want_to_read'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/reading'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/status/completed'] });
      toast({
        title: "Book deleted",
        description: "Book has been successfully removed from your library.",
      });
    },
    onError: (error) => {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    addBook: addBookMutation.mutate,
    updateBook: updateBookMutation.mutate,
    deleteBook: deleteBookMutation.mutate,
    isAddingBook: addBookMutation.isPending,
    isUpdatingBook: updateBookMutation.isPending,
    isDeletingBook: deleteBookMutation.isPending
  };
}
