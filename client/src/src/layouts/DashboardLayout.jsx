import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Calendar, FileText, PlusCircle, User } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Define mobile navigation items based on user role
  const navItems = user?.role === "admin" 
    ? [
        { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Events", path: "/events", icon: Calendar },
        { label: "Create", path: "/admin/events/create", icon: PlusCircle },
        { label: "Applications", path: "/admin/applications", icon: FileText },
        { label: "Profile", path: "/profile", icon: User }
      ]
    : [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Events", path: "/events", icon: Calendar },
        { label: "Applications", path: "/applications", icon: FileText },
        { label: "Profile", path: "/profile", icon: User }
      ];

  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden">
      
      {/* Desktop Sidebar Dock */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar Slide-over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm cursor-pointer transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          ></div>
          
          {/* Drawer container */}
          <div className="relative flex flex-col max-w-xs w-full bg-slate-950 transform transition-transform duration-300 animate-in slide-in-from-left shadow-2xl">
            <Sidebar onClose={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        <Navbar onMenuClick={() => setIsMobileOpen(true)} />

        <main className="p-4 sm:p-6 flex-1 w-full overflow-y-auto min-w-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md pb-safe flex items-center justify-around py-2 px-3 relative z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  active 
                    ? "text-indigo-600 font-semibold" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon size={20} className={`transition-transform duration-200 ${active ? "scale-110" : ""}`} />
                <span className="text-[10px] tracking-wide font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;