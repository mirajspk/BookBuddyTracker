import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookStatus } from "@/types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookSchema } from "@shared/schema";
import { z } from "zod";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: any) => void;
  initialBook?: any;
}

// Extend the insert schema with form validations
const bookFormSchema = insertBookSchema.extend({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  pages: z.number().min(1, "Pages must be at least 1").or(z.string().transform(val => parseInt(val) || 0)),
  status: z.enum(["want_to_read", "reading", "completed"]),
  progress: z.number().min(0, "Progress cannot be negative").max(100, "Progress cannot exceed 100%").optional(),
  coverUrl: z.string().optional(),
  description: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAddBook, initialBook }) => {
  const [uploadingCover, setUploadingCover] = useState(false);
  
  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      pages: 0,
      status: "want_to_read" as BookStatus,
      progress: 0,
      coverUrl: "",
      description: ""
    }
  });

  // Get selected status to conditionally show progress field
  const selectedStatus = watch("status");

  // Reset form when modal opens/closes or initialBook changes
  useEffect(() => {
    if (isOpen) {
      if (initialBook) {
        reset({
          title: initialBook.title || "",
          author: initialBook.author || "",
          genre: initialBook.genre || "",
          pages: initialBook.pages || 0,
          status: initialBook.status || "want_to_read",
          progress: initialBook.progress || 0,
          coverUrl: initialBook.coverUrl || "",
          description: initialBook.description || "",
        });
      } else {
        reset({
          title: "",
          author: "",
          genre: "",
          pages: 0,
          status: "want_to_read",
          progress: 0,
          coverUrl: "",
          description: ""
        });
      }
    }
  }, [isOpen, initialBook, reset]);

  // Auto-set progress based on status
  useEffect(() => {
    if (selectedStatus === "completed") {
      setValue("progress", 100);
    } else if (selectedStatus === "want_to_read") {
      setValue("progress", 0);
    }
  }, [selectedStatus, setValue]);

  const onSubmit = (data: BookFormValues) => {
    onAddBook(data);
  };

  // Simulate file upload (for cover image)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingCover(true);
      
      // In a real app, you would upload the file to a server here
      // For now, we'll simulate the upload with a placeholder URL
      setTimeout(() => {
        setValue("coverUrl", URL.createObjectURL(file));
        setUploadingCover(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add New Book
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">Book Title</Label>
            <Input
              id="title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="author" className="text-sm font-medium text-gray-700">Author</Label>
            <Input
              id="author"
              {...register("author")}
              className={errors.author ? "border-red-500" : ""}
            />
            {errors.author && (
              <p className="mt-1 text-xs text-red-500">{errors.author.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genre" className="text-sm font-medium text-gray-700">Genre</Label>
              <Controller
                name="genre"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className={errors.genre ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fiction">Fiction</SelectItem>
                      <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                      <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                      <SelectItem value="Fantasy">Fantasy</SelectItem>
                      <SelectItem value="Mystery">Mystery</SelectItem>
                      <SelectItem value="Biography">Biography</SelectItem>
                      <SelectItem value="Self-Help">Self-Help</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Memoir">Memoir</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.genre && (
                <p className="mt-1 text-xs text-red-500">{errors.genre.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="pages" className="text-sm font-medium text-gray-700">Pages</Label>
              <Input
                id="pages"
                type="number"
                {...register("pages", { valueAsNumber: true })}
                className={errors.pages ? "border-red-500" : ""}
              />
              {errors.pages && (
                <p className="mt-1 text-xs text-red-500">{errors.pages.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">Reading Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="want_to_read">Want to Read</SelectItem>
                    <SelectItem value="reading">Currently Reading</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          {selectedStatus === "reading" && (
            <div>
              <Label htmlFor="progress" className="text-sm font-medium text-gray-700">
                Reading Progress ({watch("progress")}%)
              </Label>
              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                step="1"
                {...register("progress", { valueAsNumber: true })}
                className="w-full"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="description"
              rows={3}
              {...register("description")}
              className="min-h-[80px]"
            />
          </div>
          
          <div>
            <Label htmlFor="cover" className="text-sm font-medium text-gray-700">Book Cover</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {watch("coverUrl") ? (
                <div className="space-y-2 text-center">
                  <img 
                    src={watch("coverUrl")} 
                    alt="Book cover preview" 
                    className="mx-auto h-32 object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => setValue("coverUrl", "")}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        accept="image/*"
                        className="sr-only" 
                        onChange={handleFileUpload}
                        disabled={uploadingCover}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {uploadingCover && (
                    <div className="mt-2 text-primary">
                      <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-xs">Uploading...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white">
              Add Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookModal;
