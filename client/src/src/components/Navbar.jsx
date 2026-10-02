import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex items-center justify-between px-6 sticky top-0 z-20 antialiased transition-colors duration-300">

      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight hidden sm:block transition-colors">
          Workspace
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell Dropdown */}
        {user && <NotificationDropdown />}

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-1.5 pr-4 rounded-full transition-all duration-300 shadow-sm hover:shadow group cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0)}
              </div>
            )}

            <div className="text-left hidden sm:block">
              <p className="font-bold text-slate-700 dark:text-slate-200 text-sm leading-none">
                {user?.name?.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                {user?.role}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-xl dark:shadow-indigo-900/10 overflow-hidden origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
              
              <div className="p-2 space-y-1">
                <Link 
                  to="/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  Profile Settings
                </Link>
                
                <button 
                  onClick={() => toggleTheme()}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </div>
                  <div className="w-8 h-4 bg-indigo-500/20 rounded-full relative">
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-indigo-500 transition-all duration-300 ${theme === "dark" ? "right-0.5" : "left-0.5"}`}></div>
                  </div>
                </button>
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Navbar;