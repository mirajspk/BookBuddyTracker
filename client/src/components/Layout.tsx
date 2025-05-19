import { useState } from "react";
import Sidebar from "./Sidebar";
import { useLocation, Link } from "wouter";
import { MenuIcon } from "lucide-react";
import AddBookModal from "./AddBookModal";
import { useBooks } from "@/hooks/useBooks";
import { useToast } from "@/hooks/use-toast";
import ProfileDropdown from "./ProfileDropdown";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addBook } = useBooks();
  const { toast } = useToast();

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
                
                <Link href="/">
                  <a className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-xl font-semibold hover:text-primary">BookTrack</span>
                  </a>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <ProfileDropdown />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
