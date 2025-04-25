import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Book, ReadingActivity, ReadingGoal } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProgressBar from "@/components/ProgressBar";
import { format } from "date-fns";
import { useBooks } from "@/hooks/useBooks";
import { useState } from "react";
import AddBookModal from "@/components/AddBookModal";
import { 
  BookOpenIcon, 
  StarIcon, 
  PlusIcon, 
  ArrowRightIcon,
  ShuffleIcon
} from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  
  // Fetch currently reading books
  const { data: currentlyReading = [], isLoading: isLoadingCurrentBooks } = useQuery({
    queryKey: ["/api/books/status/reading"],
  });

  // Fetch want to read books
  const { data: wantToRead = [], isLoading: isLoadingWantToRead } = useQuery({
    queryKey: ["/api/books/status/want_to_read"],
  });

  // Fetch reading goal
  const currentYear = new Date().getFullYear();
  const { data: readingGoal, isLoading: isLoadingGoal } = useQuery({
    queryKey: [`/api/reading-goals/${currentYear}`],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load reading goal",
        variant: "destructive",
      });
    }
  });

  // Fetch reading activity
  const { data: readingActivity = [] } = useQuery<ReadingActivity[]>({
    queryKey: ["/api/reading-sessions"],
    queryFn: async () => {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      
      const res = await fetch(`/api/reading-sessions?startDate=${sevenDaysAgo.toISOString()}&endDate=${now.toISOString()}`);
      if (!res.ok) throw new Error('Failed to fetch reading activity');
      
      const sessions = await res.json();
      
      // Process sessions into daily activity
      const activityByDay: Record<string, { minutes: number, pages: number }> = {};
      
      // Initialize all 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const day = format(date, 'EEE');
        activityByDay[day] = { minutes: 0, pages: 0 };
      }
      
      // Populate with actual data
      sessions.forEach((session: any) => {
        const day = format(new Date(session.date), 'EEE');
        if (activityByDay[day]) {
          activityByDay[day].minutes += session.minutesSpent;
          activityByDay[day].pages += session.pagesRead;
        }
      });
      
      // Convert to array
      return Object.entries(activityByDay).map(([day, { minutes, pages }]) => ({
        day,
        minutes,
        pages
      })).reverse();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load reading activity",
        variant: "destructive",
      });
    }
  });

  // Fetch recent reviews
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["/api/reviews"],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    }
  });

  // Get recent reviews
  const recentReviews = [...reviews]
    .sort((a, b) => new Date(b.dateReviewed).getTime() - new Date(a.dateReviewed).getTime())
    .slice(0, 2);

  const { addBook } = useBooks();

  const handleAddBook = (book: any) => {
    addBook(book);
    setIsAddBookOpen(false);
  };

  // Calculate reading statistics
  const totalPagesThisWeek = readingActivity.reduce((total, day) => total + day.pages, 0);
  const dailyAverage = readingActivity.length > 0 ? totalPagesThisWeek / readingActivity.length : 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Currently Reading Widget */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Currently Reading</h3>
              <span className="text-sm text-gray-500">{currentlyReading.length} books</span>
            </div>
            
            <div className="space-y-4">
              {isLoadingCurrentBooks ? (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : currentlyReading.length > 0 ? (
                currentlyReading.slice(0, 2).map((book: Book) => (
                  <div key={book.id} className="flex items-start space-x-4">
                    <img 
                      src={book.coverUrl} 
                      alt={`${book.title} cover`} 
                      className="w-12 h-18 object-cover rounded shadow" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{book.title}</h4>
                      <p className="text-sm text-gray-500 truncate">{book.author}</p>
                      <div className="mt-1 flex items-center">
                        <ProgressBar value={book.progress || 0} />
                        <span className="ml-2 text-xs text-gray-500">{book.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-2">
                  <p>No books currently being read</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setIsAddBookOpen(true)}
              className="mt-4 w-full py-2 text-sm text-primary hover:text-primary-dark font-medium flex items-center justify-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              <span>Add Book</span>
            </button>
          </CardContent>
        </Card>
        
        {/* Reading Activity Widget */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Reading Activity</h3>
              <span className="text-sm text-gray-500">Last 7 days</span>
            </div>
            
            <div className="h-32 flex items-end justify-between space-x-1">
              {readingActivity.map((day, index) => {
                // Find the max minutes to calculate relative heights
                const maxMinutes = Math.max(...readingActivity.map(d => d.minutes), 1);
                const height = (day.minutes / maxMinutes) * 100;
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className={`bg-primary ${index === readingActivity.length - 1 ? '' : 'bg-opacity-70'} w-6 rounded-t`} 
                      style={{ height: `${height || 5}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-500">{day.day}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total pages this week</span>
                <span className="font-semibold">{totalPagesThisWeek}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-sm">Daily average</span>
                <span className="font-semibold">{dailyAverage.toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Reading Goal Widget */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">{currentYear} Reading Goal</h3>
              <button className="text-sm text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
            </div>
            
            {isLoadingGoal ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : readingGoal ? (
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#EDF2F7" strokeWidth="10" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="hsl(354, 70%, 54%)" 
                      strokeWidth="10" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * (readingGoal.booksRead / readingGoal.targetBooks))}
                      className="transition-all duration-1000 ease-in-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{readingGoal.booksRead}</span>
                    <span className="text-sm text-gray-500">of {readingGoal.targetBooks} books</span>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  {readingGoal.booksRead > (readingGoal.targetBooks * (new Date().getMonth() + 1) / 12) ? (
                    <p className="text-sm text-gray-600">
                      You're {Math.floor(readingGoal.booksRead - (readingGoal.targetBooks * (new Date().getMonth() + 1) / 12))} books ahead of schedule!
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Keep going, you're making progress!
                    </p>
                  )}
                  <span className="text-xs text-gray-500 mt-1 block">
                    {Math.round((readingGoal.booksRead / readingGoal.targetBooks) * 100)}% complete
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-gray-500 mb-4">No reading goal set for {currentYear}</p>
                <button className="px-4 py-2 bg-primary text-white rounded text-sm">
                  Set a Goal
                </button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Up Next Widget */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Up Next</h3>
              <button className="text-sm text-primary">
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {isLoadingWantToRead ? (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : wantToRead.length > 0 ? (
                wantToRead.slice(0, 2).map((book: Book) => (
                  <div key={book.id} className="flex items-start space-x-4">
                    <img 
                      src={book.coverUrl} 
                      alt={`${book.title} cover`} 
                      className="w-12 h-18 object-cover rounded shadow" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{book.title}</h4>
                      <p className="text-sm text-gray-500 truncate">{book.author}</p>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{book.genre}</span>
                        <span className="text-xs text-gray-500 ml-2">{book.pages} pages</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-2">
                  <p>No books in your reading queue</p>
                </div>
              )}
            </div>
            
            <button className="mt-4 text-sm text-primary hover:text-primary-dark font-medium flex items-center">
              <ShuffleIcon className="w-4 h-4 mr-1" />
              <span>View all in queue</span>
            </button>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-lg">Recent Activity</h3>
              <button className="text-sm text-primary">View All</button>
            </div>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm">Added <span className="font-medium">Deep Work</span> to reading list</p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm">Updated reading session for <span className="font-medium">Atomic Habits</span></p>
                  <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm">Created new collection: <span className="font-medium">Science Fiction</span></p>
                  <p className="text-xs text-gray-500 mt-1">5 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Reviews */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-lg">Your Recent Reviews</h3>
              <button 
                onClick={() => setIsAddBookOpen(true)}
                className="text-sm text-primary"
              >
                Write Review
              </button>
            </div>
            
            <div className="space-y-6">
              {isLoadingReviews ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : recentReviews.length > 0 ? (
                recentReviews.map((review, index) => {
                  const book = (currentlyReading as Book[]).concat(wantToRead as Book[])
                    .find(b => b.id === review.bookId);
                  
                  return (
                    <div key={review.id} className={index < recentReviews.length - 1 ? "pb-6 border-b border-gray-100" : ""}>
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{book?.title || "Unknown Book"}</h4>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            const filled = starValue <= (review.rating || 0);
                            const halfFilled = !filled && starValue - 0.5 <= (review.rating || 0);
                            
                            return (
                              <svg 
                                key={i}
                                xmlns="http://www.w3.org/2000/svg" 
                                className="w-4 h-4" 
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
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {review.content?.length > 150 
                          ? review.content.slice(0, 150) + '...'
                          : review.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Reviewed on {review.dateReviewed ? format(new Date(review.dateReviewed), 'MMMM d, yyyy') : 'Unknown date'}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>You haven't written any reviews yet</p>
                  <button 
                    onClick={() => setIsAddBookOpen(true)}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded text-sm"
                  >
                    Write Your First Review
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAddBook={handleAddBook}
      />
    </>
  );
};

export default Dashboard;
