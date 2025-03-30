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
          <Link href="/">
            <a
              className={`
                flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 
                border-l-4 ${isActive("/") ? "border-primary text-primary" : "border-transparent"}
              `}
            >
              <LayoutDashboardIcon className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </a>
          </Link>
          
          <Link href="/library">
            <a
              className={`
                flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 
                border-l-4 ${isActive("/library") ? "border-primary text-primary" : "border-transparent"}
              `}
            >
              <BookOpenIcon className="mr-3 h-5 w-5" />
              <span>My Library</span>
            </a>
          </Link>
          
          <Link href="/reviews">
            <a
              className={`
                flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 
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
            </a>
          </Link>
          
          <Link href="/discover">
            <a
              className={`
                flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 
                border-l-4 ${isActive("/discover") ? "border-primary text-primary" : "border-transparent"}
              `}
            >
              <CompassIcon className="mr-3 h-5 w-5" />
              <span>Discover</span>
            </a>
          </Link>
          
          <Link href="/stats">
            <a
              className={`
                flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100 
                border-l-4 ${isActive("/stats") ? "border-primary text-primary" : "border-transparent"}
              `}
            >
              <BarChart2Icon className="mr-3 h-5 w-5" />
              <span>Statistics</span>
            </a>
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-1">
            <button className="flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100">
              <SettingsIcon className="mr-3 h-5 w-5" />
              <span>Settings</span>
            </button>
            
            <button className="flex items-center w-full p-3 rounded-lg text-left hover:bg-gray-100">
              <HelpCircleIcon className="mr-3 h-5 w-5" />
              <span>Help</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
