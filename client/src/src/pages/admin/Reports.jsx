import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Users, 
  FileText, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Tag,
  RefreshCw,
  Download
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import { getSummaryReport, exportCSV, exportPDF } from "../../services/reportService";

const Reports = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const { data: report, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["summaryReport"],
    queryFn: getSummaryReport,
  });

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (startDateFilter) params.startDate = startDateFilter;
      if (endDateFilter) params.endDate = endDateFilter;

      const blob = await exportCSV(params);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download", 
        `applications-report-${statusFilter || "all"}-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      const blob = await exportPDF();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "VolunteerHub-Report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Export failed", err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          <h2 className="font-bold text-lg">Error Loading Reports</h2>
          <p>{error.message || "An unexpected error occurred while fetching reports."}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Monthly trends data transformation
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const trendChartData = (report?.monthlyApplications || []).map(item => {
    const monthIndex = item._id?.month - 1;
    const monthLabel = monthIndex >= 0 && monthIndex < 12 ? monthNames[monthIndex] : `Month ${item._id?.month}`;
    return {
      name: `${monthLabel} ${item._id?.year || ""}`,
      Applications: item.total
    };
  });

  // Application status data transformation
  const statusChartData = [
    { name: "Approved", value: report?.approvedApplications || 0, color: "#10b981" },
    { name: "Pending", value: report?.pendingApplications || 0, color: "#f59e0b" },
    { name: "Rejected", value: report?.rejectedApplications || 0, color: "#ef4444" }
  ].filter(item => item.value > 0); // Only display if count > 0

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            aside, nav, .print-hide, button, .no-print, .hidden, .md\\:block {
              display: none !important;
            }
            .flex-1 {
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
            }
            body {
              background: white !important;
              color: black !important;
            }
            .shadow-sm, .shadow-md {
              box-shadow: none !important;
              border: 1px solid #e2e8f0 !important;
            }
          }
        `}} />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left print-hide">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Reports & Analytics
            </h1>
            <p className="text-slate-500 mt-1">
              Platform-wide metrics, enrollment stats, and activity analysis.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all duration-200 shadow-sm disabled:opacity-60 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${isRefetching ? 'animate-spin' : ''}`} />
              <span>{isRefetching ? "Refreshing..." : "Refresh Data"}</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all duration-200 shadow-sm disabled:opacity-60 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPDF ? "Exporting PDF..." : "Export PDF"}</span>
            </button>
          </div>
        </div>

        {/* CSV Export & Filter Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-left print-hide space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Export Applications Data
            </h2>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              CSV Format
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Application Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Start Date
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                End Date
              </label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Export Trigger */}
            <div>
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? "Exporting CSV..." : "Export CSV"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Events"
            value={report?.totalEvents}
            color="blue"
            icon={<Calendar className="w-5 h-5 text-blue-500" />}
          />
          <StatCard
            title="Total Volunteers"
            value={report?.totalVolunteers}
            color="emerald"
            icon={<Users className="w-5 h-5 text-emerald-500" />}
          />
          <StatCard
            title="Total Applications"
            value={report?.totalApplications}
            color="amber"
            icon={<FileText className="w-5 h-5 text-amber-500" />}
          />
          <StatCard
            title="Approval Rate"
            value={`${report?.approvalRate || 0}%`}
            color="rose"
            icon={<TrendingUp className="w-5 h-5 text-rose-500" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Monthly Application Trend */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Monthly Application Trend
            </h2>
            <div className="h-[300px] w-full">
              {trendChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                  No monthly trends data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Applications" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Application Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Application Status Distribution
            </h2>
            <div className="h-[300px] w-full flex flex-col justify-center items-center">
              {statusChartData.length === 0 ? (
                <div className="text-slate-400 italic text-sm">
                  No application status data available
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="75%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={55}
                        paddingAngle={3}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-2 flex-wrap justify-center">
                    {statusChartData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <span>{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Data & Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Events */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" />
              Top Events
            </h2>
            <div className="flex-1 divide-y divide-slate-100">
              {(!report?.topEvents || report.topEvents.length === 0) ? (
                <div className="py-10 text-center text-slate-400 italic text-sm">
                  No top events data available
                </div>
              ) : (
                report.topEvents.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 truncate">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-700 text-sm truncate">
                        {item._id?.title || "Unknown Event"}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                      {item.totalApplications} Apps
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Category Stats */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-500" />
              Category Statistics
            </h2>
            <div className="flex-1 divide-y divide-slate-100">
              {(!report?.categoryStats || report.categoryStats.length === 0) ? (
                <div className="py-10 text-center text-slate-400 italic text-sm">
                  No category statistics available
                </div>
              ) : (
                report.categoryStats.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-semibold text-slate-700 text-sm">
                        {item._id || "Uncategorized"}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                      {item.total} {item.total === 1 ? "Event" : "Events"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-left flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-500" />
              Recent Applications
            </h2>
            <div className="flex-1 divide-y divide-slate-100">
              {(!report?.recentApplications || report.recentApplications.length === 0) ? (
                <div className="py-10 text-center text-slate-400 italic text-sm">
                  No recent activity
                </div>
              ) : (
                report.recentApplications.map((app, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div className="truncate">
                      <span className="font-bold text-slate-700 block truncate max-w-[150px]">
                        {app.volunteerId?.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-slate-400 truncate block max-w-[150px] mt-0.5">
                        {app.eventId?.title || "Event"}
                      </span>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Reports;
