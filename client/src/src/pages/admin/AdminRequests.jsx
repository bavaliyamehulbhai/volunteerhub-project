import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminRequests, approveAdminRequest, rejectAdminRequest } from "../../services/adminService";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { Search, Filter, AlertCircle, ShieldAlert, CheckCircle2, XCircle, Clock, Calendar, Mail } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";

const AdminRequests = () => {
  const queryClient = useQueryClient();
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const { data: initialRequests = [], isLoading } = useQuery({
    queryKey: ["adminRequests"],
    queryFn: getAdminRequests,
  });

  useEffect(() => {
    if (initialRequests) {
      setRequests(initialRequests);
    }
  }, [initialRequests]);

  const approveMutation = useMutation({
    mutationFn: approveAdminRequest,
    onSuccess: (data) => {
      toast.success(data?.message || "Admin request approved successfully");
      queryClient.invalidateQueries(["adminRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to approve admin request");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: rejectAdminRequest,
    onSuccess: (data) => {
      toast.success(data?.message || "Admin request rejected successfully");
      queryClient.invalidateQueries(["adminRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reject admin request");
    }
  });

  const handleAction = (id, status, name) => {
    const title = status === "approved" ? "Approve Admin Request" : "Reject Admin Request";
    const confirmMessage = status === "approved"
      ? `Are you sure you want to approve ${name} as a platform Administrator? They will receive full access to SaaS analytics and control operations.`
      : `Are you sure you want to reject ${name}'s request for Administrator access?`;
    const confirmText = status === "approved" ? "Approve Access" : "Reject Request";
    const type = status === "approved" ? "success" : "danger";

    setConfirmConfig({
      isOpen: true,
      title,
      message: confirmMessage,
      confirmText,
      cancelText: "Cancel",
      type,
      onConfirm: () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        if (status === "approved") {
          approveMutation.mutate(id);
        } else {
          rejectMutation.mutate(id);
        }
      }
    });
  };

  const filteredRequests = requests.filter((req) => {
    const searchString = searchTerm.toLowerCase();
    const nameMatch = req.name?.toLowerCase().includes(searchString);
    const emailMatch = req.email?.toLowerCase().includes(searchString);
    const matchesSearch = nameMatch || emailMatch;
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 bg-slate-200 animate-pulse rounded-lg w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm h-64 animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-200/60 pb-6 text-left">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Requests</h1>
            <p className="text-slate-500 mt-2">Audit and manage requests for Administrator rights.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Requests</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{stats.total}</span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Pending Audit</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{stats.pending}</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Approved Admins</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{stats.approved}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Rejected Requests</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{stats.rejected}</span>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search field */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto self-start md:self-auto justify-end">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Request Feed Table */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/80 rounded-2xl p-10 shadow-sm max-w-md mx-auto space-y-4">
            <div className="inline-flex p-4 bg-slate-50 text-slate-400 rounded-2xl">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No Requests Found</h2>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">
              No registration requests match your current search criteria or filter configurations.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Requester</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req._id}
                      className="hover:bg-slate-50/50 transition-colors duration-150 text-sm text-slate-700"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                            {req.name?.charAt(0).toUpperCase() || "A"}
                          </div>
                          <span className="font-semibold text-slate-800 block">
                            {req.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {req.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(req.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAction(req._id, "approved", req.name)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(req._id, "rejected", req.name)}
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

export default AdminRequests;
