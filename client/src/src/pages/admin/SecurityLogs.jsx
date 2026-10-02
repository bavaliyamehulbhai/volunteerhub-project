import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Lock, 
  Globe,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getSecurityLogs, deleteSecurityLog, clearSecurityLogs } from "../../services/authService";
import Loader from "../../components/Loader";
import ConfirmModal from "../../components/ConfirmModal";

const SecurityLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: () => {},
    type: "danger"
  });

  const { data: logs = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["securityLogs"],
    queryFn: getSecurityLogs,
  });

  const handleDeleteLog = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Security Log",
      message: "Are you sure you want to delete this log entry? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          setIsDeleting(true);
          await deleteSecurityLog(id);
          toast.success("Log deleted successfully");
          refetch();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete log");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleClearLogs = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Clear All Logs",
      message: "Are you sure you want to delete ALL security logs? This action is permanent and cannot be undone.",
      confirmText: "Clear All",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          setIsDeleting(true);
          await clearSecurityLogs();
          toast.success("All logs cleared successfully");
          refetch();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to clear logs");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const getEventBadge = (type) => {
    switch (type) {
      case "LOGIN_SUCCESS":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "LOGIN_FAILURE":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "OTP_SENT":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "OTP_VERIFIED":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "OTP_FAILED":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "MFA_ENABLED":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "MFA_DISABLED":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "PASSWORD_CHANGE":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "SECURITY_QUESTIONS_UPDATED":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "UNAUTHORIZED_ACCESS_ATTEMPT":
        return "bg-red-50 text-red-700 border-red-200 animate-pulse";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getEventLabel = (type) => {
    return type.replace(/_/g, " ");
  };

  // Filter & Search Logic
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery) ||
      (log.userId?.name && log.userId.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === "ALL" || log.eventType === filterType;
    const matchesStatus = filterStatus === "ALL" || log.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const uniqueEventTypes = ["ALL", ...new Set(logs.map(log => log.eventType))];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden mb-8 transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-16 -mt-16 transition-colors duration-300"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -ml-16 -mb-16 transition-colors duration-300"></div>
          
          <div className="relative z-10 text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800 rounded-full flex items-center gap-1.5 shadow-sm transition-colors duration-300">
                <ShieldAlert className="w-3.5 h-3.5" /> Security Center
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-slate-100 dark:via-indigo-300 dark:to-slate-200 tracking-tight transition-colors duration-300">
              Security Audit Logs
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm md:text-base font-medium max-w-2xl transition-colors duration-300">
              Audit all security-related activities, login attempts, and policy shifts across the system.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching || isDeleting}
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
            >
              <RotateCw className={`w-4 h-4 ${isFetching ? "animate-spin text-indigo-600" : ""}`} />
              Refresh Logs
            </button>
            <button
              onClick={handleClearLogs}
              disabled={isFetching || isDeleting || logs.length === 0}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-rose-500/30 transition-all duration-300 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-5 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none grid grid-cols-1 md:grid-cols-4 gap-4 items-center transition-colors duration-300">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by email, IP address, or volunteer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm dark:shadow-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Filter Event Type */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm dark:shadow-none appearance-none cursor-pointer"
            >
              <option value="ALL">All Event Types</option>
              {uniqueEventTypes.filter(t => t !== "ALL").map(type => (
                <option key={type} value={type}>{getEventLabel(type)}</option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm dark:shadow-none appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
          </div>
        </div>

        {/* Logs Table Area */}
        {isLoading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <Loader />
            <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Fetching secure records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none backdrop-blur-md transition-colors duration-300">
            <Lock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4 transition-colors" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors">No Security Logs Found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 transition-colors">Try resetting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none overflow-hidden backdrop-blur-md transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
                    <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Timestamp</th>
                    <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Identity</th>
                    <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Security Event</th>
                    <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Access IP / Location</th>
                    <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs">Outcome</th>
                    <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium transition-colors duration-300">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-slate-800 dark:text-slate-200 font-bold transition-colors">
                            {log.userId?.name || "Anonymous / Blocked"}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{log.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${getEventBadge(log.eventType)}`}>
                          {getEventLabel(log.eventType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 transition-colors">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          <span>{log.ipAddress}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block max-w-xs truncate transition-colors" title={log.userAgent}>
                          {log.userAgent}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.status === "success" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteLog(log._id)}
                          disabled={isDeleting}
                          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
      
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        type={confirmConfig.type}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </DashboardLayout>
  );
};

export default SecurityLogs;
