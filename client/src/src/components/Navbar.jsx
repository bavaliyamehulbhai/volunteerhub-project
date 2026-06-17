import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-20">

      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-1.5 hover:bg-slate-150 rounded-xl text-slate-600 cursor-pointer transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-slate-800 text-lg">
          Portal
        </h2>
      </div>

      <Link 
        to="/profile" 
        className="flex items-center gap-3 hover:bg-slate-50 p-1.5 px-3 rounded-xl transition-all duration-200"
      >
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.name} 
            className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-sm"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.name?.charAt(0)}
          </div>
        )}

        <div className="text-left hidden sm:block">
          <p className="font-semibold text-slate-700 text-sm leading-tight">
            {user?.name}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider leading-none mt-0.5">
            {user?.role}
          </p>
        </div>
      </Link>

    </div>
  );
};

export default Navbar;