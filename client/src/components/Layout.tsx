import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useLocation } from "wouter";
import { MenuIcon, SearchIcon, PlusIcon, UserIcon, Settings, HelpCircle, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddBookModal from "./AddBookModal";
import { useBooks } from "@/hooks/useBooks";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    navigate("/auth");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center text-sm font-medium focus:outline-none"
      >
        <img 
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9" 
          alt="User avatar" 
          className="h-8 w-8 rounded-full"
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg z-20">
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            My Profile
          </Link>
          <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
          <Link href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help Center
          </Link>
          <hr className="my-1 border-gray-200" />
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const { addBook } = useBooks();
  const { toast } = useToast();

  const handleAddBook = (book: any) => {
    addBook(book);
    setIsAddBookOpen(false);
    toast({
      title: "Success",
      description: `"${book.title}" has been added to your library.`
    });
  };

  // Get the current page title
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/library":
        return "My Library";
      case "/reviews":
        return "My Reviews";
      case "/stats":
        return "Reading Statistics";
      case "/discover":
        return "Discover Books";
      case "/profile":
        return "My Profile";
      case "/settings":
        return "Settings";
      case "/help":
        return "Help Center";
      default:
        return "BookTrack";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => setSidebarOpen(true)} 
                  className="md:hidden text-gray-500 mr-3 hover:text-primary"
                >
                  <MenuIcon className="h-6 w-6" />
                </button>
                
                <h2 className="text-xl font-semibold">{getPageTitle()}</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSearchOpen(!searchOpen)} 
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <SearchIcon className="h-5 w-5 text-gray-600" />
                </button>
                
                <button 
                  onClick={() => setIsAddBookOpen(true)} 
                  className="p-2 rounded-full hover:bg-gray-100 relative" 
                  title="Add New Book"
                >
                  <PlusIcon className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="relative">
                  <ProfileDropdown />
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            {searchOpen && (
              <div className="mt-4 relative">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search books by title, author, genre..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAddBook={handleAddBook}
      />
    </div>
  );
};

export default Layout;
