import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  User,
  LogOut,
  Sparkles,
  ShieldAlert
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
    `flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive(path)
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
    }`;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`flex flex-col w-64 h-screen bg-slate-950 text-white border-r border-slate-800/40 relative z-30 flex-shrink-0 ${className}`}>
      
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
        <Link to="/dashboard" onClick={handleLinkClick} className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <Sparkles className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            VolunteerHub
          </h1>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">Main</span>
        
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
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block pt-4 mb-2">Admin Tools</span>
            
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
          </>
        )}

        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block pt-4 mb-2">Account</span>
        <Link to="/profile" onClick={handleLinkClick} className={linkClass("/profile")}>
          <User size={18}/>
          Profile Settings
        </Link>
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800/60 flex flex-col gap-2.5">
        <div className="flex items-center gap-3 px-2">
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="w-9 h-9 rounded-full object-cover border border-slate-800"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
          )}
          <div className="truncate text-left">
            <p className="font-semibold text-sm text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={() => setIsConfirmOpen(true)}
          className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 cursor-pointer transition-all duration-200"
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