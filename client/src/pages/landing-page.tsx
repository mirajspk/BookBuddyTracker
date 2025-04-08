import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Star, BookText, BarChart, BookCopy, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <nav className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-7 w-7" />
              <h1 className="text-2xl font-bold">BookTrack</h1>
            </div>
            <div className="space-x-4">
              <Link href="/auth">
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/20">
                  Login
                </Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button className="bg-white text-primary hover:bg-white/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>

          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Track your reading journey
              </h2>
              <p className="text-xl mb-8 max-w-md">
                Your personal library, reading statistics, and book reviews - all in one place.
              </p>
              <div className="flex space-x-4">
                <Link href="/auth?tab=register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Start for Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Mock UI illustration */}
                <div className="bg-white rounded-lg shadow-xl p-4 text-gray-800">
                  <div className="mb-4 border-b pb-2">
                    <h3 className="text-lg font-semibold text-primary">Your Reading Dashboard</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-gray-100 rounded">
                      <div className="w-10 h-12 bg-primary/20 rounded flex items-center justify-center">
                        <BookCopy className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Currently Reading</div>
                        <div className="text-sm text-gray-500">3 books</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gray-100 rounded">
                      <div className="w-10 h-12 bg-primary/20 rounded flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Reading Time</div>
                        <div className="text-sm text-gray-500">5.2 hours this week</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gray-100 rounded">
                      <div className="w-10 h-12 bg-primary/20 rounded flex items-center justify-center">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Book Reviews</div>
                        <div className="text-sm text-gray-500">12 completed</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-lg -z-10 transform rotate-6"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-lg -z-10 transform -rotate-12"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything for Book Lovers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              BookTrack helps you organize your collection, track reading progress, and discover new books.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookCopy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Library Management</h3>
              <p className="text-gray-600">
                Organize your books by status, genre, or create custom collections.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reading Statistics</h3>
              <p className="text-gray-600">
                Track your reading habits with detailed statistics and progress charts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reviews & Ratings</h3>
              <p className="text-gray-600">
                Write detailed reviews and rate books to remember your thoughts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reading Sessions</h3>
              <p className="text-gray-600">
                Log your reading sessions to track time spent and pages read.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookCopy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wishlist</h3>
              <p className="text-gray-600">
                Keep track of books you want to read or purchase in the future.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reading Goals</h3>
              <p className="text-gray-600">
                Set and track your yearly reading goals to stay motivated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/90 to-primary/70 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Reading Journey Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of readers who use BookTrack to organize their libraries and track their reading habits.
          </p>
          <Link href="/auth?tab=register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-xl font-bold">BookTrack</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Your personal library management system for tracking books, reading progress, and reviews.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Library Management</li>
                  <li>Reading Statistics</li>
                  <li>Reviews & Ratings</li>
                  <li>Reading Goals</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Account</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/auth">Login</Link></li>
                  <li><Link href="/auth?tab=register">Register</Link></li>
                  <li><Link href="/auth?tab=forgot">Reset Password</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} BookTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}