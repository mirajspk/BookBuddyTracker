import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { UserIcon, Settings, HelpCircle, LogOut } from "lucide-react";

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

export default ProfileDropdown;