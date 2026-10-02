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
        <div className="p-6 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 rounded-xl transition-colors">
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden mb-4 print-hide transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-16 -mt-16 transition-colors duration-300"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -ml-16 -mb-16 transition-colors duration-300"></div>
          
          <div className="relative z-10 text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-indigo-100 dark:border-indigo-900/50 rounded-full flex items-center gap-1.5 shadow-sm transition-colors">
                <FileText className="w-3.5 h-3.5" /> Analytics Dashboard
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-slate-100 dark:via-indigo-300 dark:to-slate-200 tracking-tight transition-colors duration-300">
              Reports & Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm md:text-base font-medium max-w-2xl transition-colors">
              Platform-wide metrics, enrollment stats, and activity analysis.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer active:scale-95 hover:-translate-y-0.5"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 dark:text-slate-400 ${isRefetching ? 'animate-spin' : ''}`} />
              <span>{isRefetching ? "Refreshing..." : "Refresh Data"}</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 dark:from-rose-700 dark:to-rose-600 dark:hover:from-rose-600 dark:hover:to-rose-500 text-white font-bold text-sm transition-all duration-300 shadow-md hover:shadow-rose-500/30 dark:hover:shadow-rose-900/30 disabled:opacity-60 cursor-pointer active:scale-95 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPDF ? "Exporting PDF..." : "Export PDF"}</span>
            </button>
          </div>
        </div>

        {/* CSV Export & Filter Panel */}
        {/* CSV Export & Filter Panel */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none text-left print-hide space-y-5 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 transition-colors">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-colors">
              <FileText className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              Export Applications Data
            </h2>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-700 transition-colors">
              CSV Format
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block transition-colors">
                Application Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
              >
                <option value="">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block transition-colors">
                Start Date
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block transition-colors">
                End Date
              </label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            {/* Export Trigger */}
            <div>
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600/90 dark:hover:bg-emerald-500 text-white font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer active:scale-95"
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
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Monthly Application Trend */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-7 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 transition-colors">
              <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              Monthly Application Trend
            </h2>
            <div className="h-[300px] w-full">
              {trendChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 italic text-sm transition-colors">
                  No monthly trends data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-slate-900, #0f172a)",
                        border: "1px solid var(--color-slate-800, #1e293b)",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        color: "#f8fafc"
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
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-7 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none text-left transition-all duration-300 hover:shadow-2xl hover:shadow-amber-100 dark:hover:shadow-amber-900/20">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 transition-colors">
              <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              Application Status Distribution
            </h2>
            <div className="h-[300px] w-full flex flex-col justify-center items-center">
              {statusChartData.length === 0 ? (
                <div className="text-slate-400 dark:text-slate-500 italic text-sm transition-colors">
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
                          backgroundColor: "var(--color-slate-900, #0f172a)",
                          border: "1px solid var(--color-slate-800, #1e293b)",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          color: "#f8fafc"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-2 flex-wrap justify-center">
                    {statusChartData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors">
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
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none text-left flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-50 dark:hover:shadow-indigo-900/20">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 transition-colors">
              <Award className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              Top Events
            </h2>
            <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800/80 transition-colors">
              {(!report?.topEvents || report.topEvents.length === 0) ? (
                <div className="py-10 text-center text-slate-400 dark:text-slate-500 italic text-sm transition-colors">
                  No top events data available
                </div>
              ) : (
                report.topEvents.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 truncate">
                      <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 transition-colors">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm truncate transition-colors">
                        {item._id?.title || "Unknown Event"}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full shrink-0 transition-colors">
                      {item.totalApplications} Apps
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Category Stats */}
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none text-left flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-50 dark:hover:shadow-emerald-900/20">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 transition-colors">
              <Tag className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              Category Statistics
            </h2>
            <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800/80 transition-colors">
              {(!report?.categoryStats || report.categoryStats.length === 0) ? (
                <div className="py-10 text-center text-slate-400 dark:text-slate-500 italic text-sm transition-colors">
                  No category statistics available
                </div>
              ) : (
                report.categoryStats.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm transition-colors">
                        {item._id || "Uncategorized"}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 px-2.5 py-1 rounded-full shrink-0 transition-colors">
                      {item.total} {item.total === 1 ? "Event" : "Events"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none text-left flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-rose-50 dark:hover:shadow-rose-900/20">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 transition-colors">
              <FileText className="w-5 h-5 text-rose-500 dark:text-rose-400" />
              Recent Applications
            </h2>
            <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800/80 transition-colors">
              {(!report?.recentApplications || report.recentApplications.length === 0) ? (
                <div className="py-10 text-center text-slate-400 dark:text-slate-500 italic text-sm transition-colors">
                  No recent activity
                </div>
              ) : (
                report.recentApplications.map((app, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div className="truncate">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block truncate max-w-[150px] transition-colors">
                        {app.volunteerId?.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 truncate block max-w-[150px] mt-0.5 transition-colors">
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
