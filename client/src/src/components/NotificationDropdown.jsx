import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Trash2, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../services/notificationService";

const NotificationDropdown = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: false, // Disabled polling since we use WebSockets now
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"])
  });

  const markAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"])
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries(["notifications"])
  });

  // Socket.io Real-time connection
  useEffect(() => {
    if (!user) return;
    
    // Connect to server socket
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000";
    const socket = io(socketUrl, {
      withCredentials: true
    });

    socket.on("connect", () => {
      socket.emit("join", user._id);
    });

    socket.on("new_notification", (notification) => {
      queryClient.setQueryData(["notifications"], (oldData) => {
        return [notification, ...(oldData || [])];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user, queryClient]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error": return <XCircle className="w-5 h-5 text-rose-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden transition-colors duration-300">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAllMutation.mutate()}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`p-4 transition-colors duration-200 flex gap-3 ${!notification.isRead ? "bg-indigo-50/40 dark:bg-indigo-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm font-semibold ${!notification.isRead ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${!notification.isRead ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        {!notification.isRead && (
                          <button 
                            onClick={() => markAsReadMutation.mutate(notification._id)}
                            className="text-[11px] font-semibold flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Mark Read
                          </button>
                        )}
                        <button 
                          onClick={() => deleteMutation.mutate(notification._id)}
                          className="text-[11px] font-semibold flex items-center gap-1 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
