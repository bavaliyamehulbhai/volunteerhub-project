import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllApplications, updateApplicationStatus } from "../../services/applicationService";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { Search, Filter, AlertCircle, FileText, CheckCircle2, Clock, XCircle, MapPin, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchVolunteer, setSearchVolunteer] = useState("");
  const [searchEvent, setSearchEvent] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {},
    type: "info"
  });

  const { data: initialApplications = [], isLoading } = useQuery({
    queryKey: ["allApplications"],
    queryFn: getAllApplications,
  });

  useEffect(() => {
    if (initialApplications) {
      setApplications(initialApplications);
    }
  }, [initialApplications]);

  const handleStatusUpdate = (id, status) => {
    const title = status === "approved" ? "Approve Application" : "Reject Application";
    const confirmMessage = status === "approved" 
      ? "Are you sure you want to approve this application?" 
      : "Are you sure you want to reject this application?";
    const confirmText = status === "approved" ? "Approve" : "Reject";
    const type = status === "approved" ? "success" : "danger";

    setConfirmConfig({
      isOpen: true,
      title,
      message: confirmMessage,
      confirmText,
      cancelText: "Cancel",
      type,
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await updateApplicationStatus(id, status);
          toast.success(`Application ${status === "approved" ? "Approved" : "Rejected"} Successfully`);
          setApplications((prev) =>
            prev.map((app) => (app._id === id ? { ...app, status } : app))
          );
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Failed to update status");
        }
      }
    });
  };

  // Filter logic
  const filteredApplications = applications.filter((app) => {
    const volunteerName = app.volunteerId?.name?.toLowerCase() || "";
    const eventTitle = app.eventId?.title?.toLowerCase() || "";
    
    const matchesVolunteer = volunteerName.includes(searchVolunteer.toLowerCase());
    const matchesEvent = eventTitle.includes(searchEvent.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesVolunteer && matchesEvent && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm h-64 animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col justify-center gap-2 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden text-left transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-16 -mt-16 transition-colors duration-300"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -ml-16 -mb-16 transition-colors duration-300"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-slate-100 dark:via-indigo-300 dark:to-slate-200 tracking-tight transition-colors duration-300">Manage Applications</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm md:text-base font-medium transition-colors duration-300">Review, approve, or reject volunteer applications seamlessly.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none flex items-center justify-between hover:shadow-2xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300 group">
            <div className="text-left">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-widest transition-colors">Total Received</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stats.total}</span>
            </div>
            <div className="p-3.5 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-2xl shadow-inner dark:shadow-none group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none flex items-center justify-between hover:shadow-2xl hover:shadow-amber-100 dark:hover:shadow-amber-900/20 transition-all duration-300 group">
            <div className="text-left">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-widest transition-colors">Pending Review</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">{stats.pending}</span>
            </div>
            <div className="p-3.5 bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 rounded-2xl shadow-inner dark:shadow-none group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none flex items-center justify-between hover:shadow-2xl hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20 transition-all duration-300 group">
            <div className="text-left">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-widest transition-colors">Approved</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">{stats.approved}</span>
            </div>
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 rounded-2xl shadow-inner dark:shadow-none group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none flex items-center justify-between hover:shadow-2xl hover:shadow-rose-100 dark:hover:shadow-rose-900/20 transition-all duration-300 group">
            <div className="text-left">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-widest transition-colors">Rejected</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">{stats.rejected}</span>
            </div>
            <div className="p-3.5 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-2xl shadow-inner dark:shadow-none group-hover:scale-110 transition-transform">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col md:flex-row gap-4 items-center justify-between transition-colors duration-300">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Volunteer */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search Volunteer..."
                value={searchVolunteer}
                onChange={(e) => setSearchVolunteer(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left"
              />
            </div>

            {/* Search Event */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search Event..."
                value={searchEvent}
                onChange={(e) => setSearchEvent(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto self-start md:self-auto">
            <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Empty state & Table */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-10 shadow-sm max-w-md mx-auto space-y-4 backdrop-blur-md transition-colors duration-300">
            <div className="inline-flex p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl transition-colors">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">No Applications Found</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto transition-colors">
              No volunteer submissions match your current filter settings.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm dark:shadow-none overflow-hidden backdrop-blur-md transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors">
                    <th className="px-6 py-4">Volunteer</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/80 transition-colors duration-300">
                  {filteredApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors duration-150 text-sm"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm transition-colors">
                            {application.volunteerId?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block transition-colors">
                              {application.volunteerId?.name || "N/A"}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">
                              {application.volunteerId?.email || "No Email"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                        {application.eventId?.title || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          {application.eventId?.location || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          {new Date(application.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {application.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStatusUpdate(application._id, "approved")}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 dark:bg-green-600/80 dark:hover:bg-green-500 rounded-lg shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application._id, "rejected")}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 dark:bg-red-600/80 dark:hover:bg-red-500 rounded-lg shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic font-medium pr-2 transition-colors">
                            Processed
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

export default AdminApplications;
