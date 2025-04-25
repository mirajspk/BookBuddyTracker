import { useLocation, Link } from "wouter";
import { BookOpenIcon, BookText, LayoutDashboardIcon, CompassIcon, BarChart2Icon, SettingsIcon, HelpCircleIcon } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside 
      className={`
        bg-white w-64 h-full shadow-md fixed inset-y-0 left-0 z-20 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
      `}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold flex items-center">
            <BookText className="text-primary mr-2" />
            <span>BookTrack</span>
          </h1>
          <button 
            onClick={onClose} 
            className="md:hidden text-gray-500 hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-1">
          <div>
            <Link href="/">
              <div
                className={`
                  flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 cursor-pointer
                  border-l-4 ${isActive("/") ? "border-primary text-primary" : "border-transparent"}
                `}
              >
                <LayoutDashboardIcon className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </div>
            </Link>
          </div>
          
          <div>
            <Link href="/library">
              <div
                className={`
                  flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 cursor-pointer
                  border-l-4 ${isActive("/library") ? "border-primary text-primary" : "border-transparent"}
                `}
              >
                <BookOpenIcon className="mr-3 h-5 w-5" />
                <span>My Library</span>
              </div>
            </Link>
          </div>
          
          <div>
            <Link href="/reviews">
              <div
                className={`
                  flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 cursor-pointer
                  border-l-4 ${isActive("/reviews") ? "border-primary text-primary" : "border-transparent"}
                `}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="mr-3 h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span>My Reviews</span>
              </div>
            </Link>
          </div>
          
          <div>
            <Link href="/discover">
              <div
                className={`
                  flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 cursor-pointer
                  border-l-4 ${isActive("/discover") ? "border-primary text-primary" : "border-transparent"}
                `}
              >
                <CompassIcon className="mr-3 h-5 w-5" />
                <span>Discover</span>
              </div>
            </Link>
          </div>
          
          <div>
            <Link href="/stats">
              <div
                className={`
                  flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 cursor-pointer
                  border-l-4 ${isActive("/stats") ? "border-primary text-primary" : "border-transparent"}
                `}
              >
                <BarChart2Icon className="mr-3 h-5 w-5" />
                <span>Statistics</span>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-1">
            <div>
              <Link href="/profile">
                <div
                  className={`
                    flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 cursor-pointer
                    border-l-4 ${isActive("/profile") ? "border-primary text-primary" : "border-transparent"}
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>My Profile</span>
                </div>
              </Link>
            </div>

            <div>
              <Link href="/settings">
                <div
                  className={`
                    flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 cursor-pointer
                    border-l-4 ${isActive("/settings") ? "border-primary text-primary" : "border-transparent"}
                  `}
                >
                  <SettingsIcon className="mr-3 h-5 w-5" />
                  <span>Settings</span>
                </div>
              </Link>
            </div>
            
            <div>
              <Link href="/help">
                <div
                  className={`
                    flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 cursor-pointer
                    border-l-4 ${isActive("/help") ? "border-primary text-primary" : "border-transparent"}
                  `}
                >
                  <HelpCircleIcon className="mr-3 h-5 w-5" />
                  <span>Help Center</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
