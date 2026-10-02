import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  User,
  LogOut,
  Sparkles,
  ShieldAlert,
  UserPlus
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

const Sidebar = ({ className = "", onClose }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => 
    `flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
      isActive(path)
        ? "bg-gradient-to-r from-indigo-50 to-blue-50/50 dark:from-indigo-900/40 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-300 shadow-[inset_2px_0_0_0_#4f46e5] dark:shadow-[inset_2px_0_0_0_#818cf8] font-semibold"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200"
    }`;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`flex flex-col w-64 h-screen bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl text-slate-800 dark:text-slate-200 border-r border-slate-200/60 dark:border-slate-800/60 relative z-30 flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none antialiased transition-colors duration-300 ${className}`}>
      {/* Decorative top glow */}
      <div className="absolute top-0 left-0 w-full h-48 bg-indigo-50/50 dark:bg-indigo-600/10 blur-[50px] rounded-full -translate-y-1/2 pointer-events-none transition-colors duration-300"></div>
      
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100/80 dark:border-slate-800/60 flex items-center justify-between transition-colors duration-300">
        <Link to="/dashboard" onClick={handleLinkClick} className="flex items-center gap-2">
          <span className="p-1.5 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg text-white shadow-sm shadow-indigo-600/20">
            <Sparkles className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            VolunteerHub
          </h1>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-track]:bg-transparent">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block mb-2">Main</span>
        
        {user?.role !== "admin" ? (
          <Link to="/dashboard" onClick={handleLinkClick} className={linkClass("/dashboard")}>
            <LayoutDashboard size={18}/>
            Dashboard
          </Link>
        ) : (
          <Link to="/admin/dashboard" onClick={handleLinkClick} className={linkClass("/admin/dashboard")}>
            <LayoutDashboard size={18}/>
            Admin Dashboard
          </Link>
        )}

        <Link to="/events" onClick={handleLinkClick} className={linkClass("/events")}>
          <Calendar size={18}/>
          Events
        </Link>

        {user?.role !== "admin" && (
          <Link to="/applications" onClick={handleLinkClick} className={linkClass("/applications")}>
            <FileText size={18}/>
            My Applications
          </Link>
        )}

        {user?.role === "admin" && (
          <>
            <div className="h-4"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block mb-2">Admin Tools</span>
            
            <Link to="/admin/events/create" onClick={handleLinkClick} className={linkClass("/admin/events/create")}>
              <Calendar size={18}/>
              Create Event
            </Link>

            <Link to="/admin/applications" onClick={handleLinkClick} className={linkClass("/admin/applications")}>
              <FileText size={18}/>
              Manage Applications
            </Link>

            <Link to="/volunteers" onClick={handleLinkClick} className={linkClass("/volunteers")}>
              <Users size={18}/>
              Volunteers Directory
            </Link>

            <Link to="/admin/reports" onClick={handleLinkClick} className={linkClass("/admin/reports")}>
              <FileText size={18}/>
              SaaS Reports
            </Link>

            <Link to="/admin/security-logs" onClick={handleLinkClick} className={linkClass("/admin/security-logs")}>
              <ShieldAlert size={18}/>
              Security Logs
            </Link>

            <Link to="/admin/requests" onClick={handleLinkClick} className={linkClass("/admin/requests")}>
              <UserPlus size={18}/>
              Admin Requests
            </Link>
          </>
        )}

        <div className="h-4"></div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block mb-2">Account</span>
        <Link to="/profile" onClick={handleLinkClick} className={linkClass("/profile")}>
          <User size={18}/>
          Profile Settings
        </Link>
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-100/80 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-2.5 transition-colors duration-300">
        <div className="flex items-center gap-3 px-2">
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm transition-colors duration-300"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.name?.charAt(0)}
            </div>
          )}
          <div className="truncate text-left">
            <p className="font-bold text-sm text-slate-700 dark:text-slate-200 truncate transition-colors duration-300">{user?.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold transition-colors duration-300">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={() => setIsConfirmOpen(true)}
          className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-rose-400 bg-white dark:bg-rose-500/10 hover:bg-rose-50 dark:hover:bg-rose-500/20 border border-slate-200 dark:border-rose-500/20 hover:border-rose-200 hover:text-rose-600 dark:hover:text-rose-300 cursor-pointer transition-all duration-300 shadow-sm dark:shadow-none"
        >
          <LogOut size={16}/>
          Sign Out
        </button>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          setIsConfirmOpen(false);
          handleLinkClick();
          logout();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />

    </div>
  );
};

export default Sidebar;