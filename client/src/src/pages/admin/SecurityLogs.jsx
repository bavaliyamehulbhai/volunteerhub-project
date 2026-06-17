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
  Globe 
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getSecurityLogs } from "../../services/authService";
import Loader from "../../components/Loader";

const SecurityLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const { data: logs = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["securityLogs"],
    queryFn: getSecurityLogs,
  });

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-indigo-600" />
              Security Audit Logs
            </h1>
            <p className="text-slate-500 mt-1">Audit all security-related activities, login attempts, and policy shifts across the system.</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-600/30 hover:text-indigo-600 text-slate-600 text-sm font-semibold px-4.5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isFetching ? "animate-spin text-indigo-600" : ""}`} />
            Refresh Logs
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email, IP address, or volunteer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm placeholder:text-slate-400"
            />
          </div>

          {/* Filter Event Type */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="ALL">All Event Types</option>
              {uniqueEventTypes.filter(t => t !== "ALL").map(type => (
                <option key={type} value={type}>{getEventLabel(type)}</option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm appearance-none cursor-pointer"
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
            <p className="text-slate-500 font-medium">Fetching secure records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No Security Logs Found</h3>
            <p className="text-slate-400 text-sm mt-1">Try resetting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs">Timestamp</th>
                    <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs">Identity</th>
                    <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs">Security Event</th>
                    <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs">Access IP / Location</th>
                    <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-bold">
                            {log.userId?.name || "Anonymous / Blocked"}
                          </span>
                          <span className="text-xs text-slate-400">{log.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${getEventBadge(log.eventType)}`}>
                          {getEventLabel(log.eventType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span>{log.ipAddress}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block max-w-xs truncate" title={log.userAgent}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default SecurityLogs;
