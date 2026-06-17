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
          <div className="h-10 bg-slate-200 animate-pulse rounded-lg w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 animate-pulse rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-64 animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">Manage Applications</h1>
          <p className="text-slate-500 mt-2 text-left">Review, approve, or reject volunteer applications.</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Received</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{stats.total}</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Pending Review</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{stats.pending}</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Approved</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{stats.approved}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Rejected</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{stats.rejected}</span>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Volunteer */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Volunteer..."
                value={searchVolunteer}
                onChange={(e) => setSearchVolunteer(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left"
              />
            </div>

            {/* Search Event */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Event..."
                value={searchEvent}
                onChange={(e) => setSearchEvent(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto self-start md:self-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
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
          <div className="text-center py-20 bg-white border border-slate-200/80 rounded-2xl p-10 shadow-sm max-w-md mx-auto space-y-4">
            <div className="inline-flex p-4 bg-slate-50 text-slate-400 rounded-2xl">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No Applications Found</h2>
            <p className="text-slate-500 max-w-xs mx-auto">
              No volunteer submissions match your current filter settings.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Volunteer</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="hover:bg-slate-50/50 transition-colors duration-150 text-sm"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                            {application.volunteerId?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              {application.volunteerId?.name || "N/A"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {application.volunteerId?.email || "No Email"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {application.eventId?.title || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {application.eventId?.location || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
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
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application._id, "rejected")}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic font-medium pr-2">
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
