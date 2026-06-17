import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SessionGuard = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const warnTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Time configurations (in milliseconds)
  const WARNING_TIME = 14 * 60 * 1000; // Show warning after 14 minutes of inactivity
  const LOGOUT_TIME = 15 * 60 * 1000;  // Auto logout after 15 minutes of inactivity

  const resetTimer = () => {
    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setShowWarning(false);
    setCountdown(60);

    if (user) {
      warnTimeoutRef.current = setTimeout(() => {
        setShowWarning(true);
        startCountdown();
      }, WARNING_TIME);

      logoutTimeoutRef.current = setTimeout(() => {
        handleAutoLogout();
      }, LOGOUT_TIME);
    }
  };

  const startCountdown = () => {
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAutoLogout = () => {
    logout();
    setShowWarning(false);
    toast.error("Session expired due to inactivity", { id: "session-expired" });
    navigate("/login");
  };

  useEffect(() => {
    // List of user activity events to monitor
    const events = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];

    if (user) {
      resetTimer();
      events.forEach((event) => window.addEventListener(event, resetTimer));
    } else {
      // Clear all timers if user is not authenticated
      if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [user]);

  const handleStaySignedIn = () => {
    resetTimer();
  };

  return (
    <>
      {children}
      {showWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4">
          <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center gap-3.5 mb-5">
              <span className="p-3 bg-amber-50 rounded-2xl text-amber-500 border border-amber-100">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Inactivity Warning</h3>
                <p className="text-xs text-slate-400">Security Inactivity Guard</p>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              You have been inactive for a while. For your security, your session will automatically log out in:
            </p>

            <div className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
              <Clock className="w-5 h-5 text-indigo-600 animate-pulse" />
              <span className="text-2xl font-black text-indigo-900 tracking-wider">
                00:{countdown.toString().padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStaySignedIn}
                type="button"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-md shadow-indigo-600/10 transition-all cursor-pointer text-center"
              >
                Stay Logged In
              </button>
              <button
                onClick={handleAutoLogout}
                type="button"
                className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-semibold py-3 px-4 rounded-xl border border-rose-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionGuard;
