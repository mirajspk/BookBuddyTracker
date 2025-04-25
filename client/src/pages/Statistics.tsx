import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Statistics as StatsType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Statistics = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<"current" | "all">("current");
  
  // Fetch statistics
  const { data: stats, isLoading } = useQuery<StatsType>({
    queryKey: ["/api/statistics"],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      });
    }
  });

  // Functions to handle the UI
  const currentYear = new Date().getFullYear();
  
  // Calculate days of the week for reading schedule
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Sample data for day-by-day reading - this should come from API in a real app
  const readingSchedule = [
    { day: "Monday", pages: 25 },
    { day: "Tuesday", pages: 35 },
    { day: "Wednesday", pages: 18 },
    { day: "Thursday", pages: 22 },
    { day: "Friday", pages: 30 },
    { day: "Saturday", pages: 45 },
    { day: "Sunday", pages: 40 }
  ];

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-medium">Reading Statistics</h3>
        <div className="inline-flex rounded-lg">
          <Button
            variant={timeframe === "current" ? "default" : "outline"}
            onClick={() => setTimeframe("current")}
            className="rounded-r-none"
          >
            {currentYear}
          </Button>
          <Button
            variant={timeframe === "all" ? "default" : "outline"}
            onClick={() => setTimeframe("all")}
            className="rounded-l-none"
          >
            All Time
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Books Read */}
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <>
                <h4 className="text-gray-500 text-sm mb-1">Books Read</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{stats?.booksRead || 0}</span>
                  <span className="text-sm text-green-500 ml-2 flex items-center">
                    <ArrowUpIcon className="w-3 h-3 mr-1" />
                    <span>+4 from last year</span>
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Pages Read */}
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <>
                <h4 className="text-gray-500 text-sm mb-1">Pages Read</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{stats?.pagesRead.toLocaleString() || 0}</span>
                  <span className="text-sm text-green-500 ml-2 flex items-center">
                    <ArrowUpIcon className="w-3 h-3 mr-1" />
                    <span>+943 from last year</span>
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Average Rating */}
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <>
                <h4 className="text-gray-500 text-sm mb-1">Average Rating</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{stats?.averageRating.toFixed(1) || 0}</span>
                  <div className="flex text-yellow-500 ml-2">
                    {[...Array(5)].map((_, i) => {
                      const starValue = i + 1;
                      const filled = starValue <= stats?.averageRating || 0;
                      const halfFilled = !filled && starValue - 0.5 <= stats?.averageRating || 0;
                      
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
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Reading Pace */}
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <>
                <h4 className="text-gray-500 text-sm mb-1">Reading Pace</h4>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{Math.round((stats?.pagesRead || 0) / 7)}</span>
                  <span className="text-sm text-gray-500 ml-2">pages/week</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Reading Habits Chart */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-medium mb-4">Reading Schedule</h4>
            
            <div className="space-y-4">
              {readingSchedule.map((day, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{day.day}</span>
                    <span className="text-sm font-medium">{day.pages} pages</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(day.pages / 45) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Genre Distribution */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-medium mb-4">Genre Distribution</h4>
            
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))
              ) : stats?.genreDistribution && stats.genreDistribution.length > 0 ? (
                stats.genreDistribution.map((genre, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{genre.genre}</span>
                      <span className="text-sm font-medium">{genre.count} book{genre.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-yellow-500' :
                          index === 4 ? 'bg-indigo-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${genre.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No genre data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium">Monthly Reading Progress</h4>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-12 gap-2 h-48 items-end">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="w-full rounded-t" style={{ height: `${20 + Math.random() * 60}%` }} />
                  <Skeleton className="mt-1 h-4 w-6" />
                </div>
              ))
            ) : stats?.monthlyProgress ? (
              months.map((month, index) => {
                const monthData = stats.monthlyProgress.find(m => m.month === index);
                const count = monthData ? monthData.count : 0;
                const maxCount = Math.max(...stats.monthlyProgress.map(m => m.count), 1);
                const height = (count / maxCount) * 100;
                const isProjected = index > new Date().getMonth();
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className={`${isProjected ? 'bg-primary-light' : 'bg-primary'} w-full rounded-t`} 
                      style={{ height: `${height || 5}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-500">{month}</span>
                  </div>
                );
              })
            ) : (
              <div className="col-span-12 flex items-center justify-center h-full">
                <p className="text-gray-500">No monthly data available</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-6 text-sm text-gray-500">
            <div>
              <span className="inline-block w-3 h-3 bg-primary rounded-sm mr-1"></span>
              Completed
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-primary-light rounded-sm mr-1"></span>
              Projected
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Statistics;
