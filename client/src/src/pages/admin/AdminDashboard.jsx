import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  ArrowRight, 
  PlusCircle, 
  ClipboardList, 
  BarChart3, 
  UserCheck,
  Percent,
  Layers,
  Activity,
  Award,
  MapPin,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import { getAnalytics } from "../../services/adminService";

const AdminDashboard = () => {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: getAnalytics,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
          <Loader />
          <p className="text-slate-500 font-medium animate-pulse">Loading dashboard intelligence...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 bg-rose-50 rounded-full text-rose-500">
            <TrendingDown className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Failed to load analytics</h2>
          <p className="text-slate-500 max-w-md">{error.message || "An error occurred while fetching platform performance data."}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Curated color themes for charts
  const statusColors = {
    Approved: "#10b981", // Emerald
    Pending: "#f59e0b",  // Amber
    Rejected: "#f43f5e"  // Rose
  };

  const pieColors = ["#10b981", "#f59e0b", "#f43f5e"];

  // Category Colors for Visual Accent
  const categoryGradients = {
    Education: "from-blue-500 to-indigo-600",
    Healthcare: "from-emerald-400 to-teal-600",
    Environment: "from-green-500 to-emerald-700",
    Community: "from-purple-500 to-pink-600",
    Sports: "from-orange-500 to-rose-600"
  };

  // Safe Fallbacks
  const totalEvents = analytics?.totalEvents || 0;
  const totalVolunteers = analytics?.totalVolunteers || 0;
  const totalApplications = analytics?.totalApplications || 0;
  const approvalRate = analytics?.approvalRate || 0;
  const monthlyGrowth = analytics?.monthlyGrowth || 0;
  const monthlyApplications = analytics?.monthlyApplications || [];
  const applicationStatus = analytics?.applicationStatus || [];
  const categoryStats = analytics?.categoryStats || [];
  const activeVolunteers = analytics?.activeVolunteers || [];
  const topEvents = analytics?.topEvents || [];
  const recentApplications = analytics?.recentApplications || [];

  // Growth metric helpers
  const isPositiveGrowth = monthlyGrowth >= 0;
  const growthSign = isPositiveGrowth ? "+" : "";

  // Date/Time helper
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Some time ago";
    const now = new Date();
    const applied = new Date(dateStr);
    const diffMs = now - applied;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-200/60 pb-6 text-left">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Intelligence
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">Executive Analytics</h1>
            <p className="text-slate-500 mt-1">SaaS metrics, volunteer growth trends, and dynamic event activity feed.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/admin/reports" 
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-slate-500" />
              Report Center
            </Link>
            <Link 
              to="/admin/events/create" 
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              New Event
            </Link>
          </div>
        </div>

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Card 1: Total Events */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform duration-300"></div>
            <div>
              <div className="p-3 bg-blue-50 rounded-xl w-fit text-blue-600 mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Events</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{totalEvents}</h3>
            </div>
            <p className="text-slate-400 text-xs mt-3 flex items-center gap-1">
              Active programs on platform
            </p>
          </div>

          {/* Card 2: Volunteers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/40 rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform duration-300"></div>
            <div>
              <div className="p-3 bg-emerald-50 rounded-xl w-fit text-emerald-600 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Volunteers</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{totalVolunteers}</h3>
            </div>
            <p className="text-slate-400 text-xs mt-3 flex items-center gap-1">
              Registered users in system
            </p>
          </div>

          {/* Card 3: Applications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/40 rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform duration-300"></div>
            <div>
              <div className="p-3 bg-amber-50 rounded-xl w-fit text-amber-600 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Applications</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{totalApplications}</h3>
            </div>
            <p className="text-slate-400 text-xs mt-3 flex items-center gap-1">
              Total applied positions
            </p>
          </div>

          {/* Card 4: Applications Growth */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${isPositiveGrowth ? "bg-emerald-50/40" : "bg-rose-50/40"} rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform duration-300`}></div>
            <div>
              <div className={`p-3 rounded-xl w-fit mb-4 ${isPositiveGrowth ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {isPositiveGrowth ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">MoM Growth</p>
              <h3 className={`text-3xl font-extrabold mt-1 ${isPositiveGrowth ? "text-emerald-600" : "text-rose-600"}`}>
                {growthSign}{monthlyGrowth}%
              </h3>
            </div>
            <p className="text-slate-400 text-xs mt-3">
              vs previous month count
            </p>
          </div>

          {/* Card 5: Approval Rate */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-bl-full -mr-4 -mt-4 group-hover:scale-110 transition-transform duration-300"></div>
            <div>
              <div className="p-3 bg-indigo-50 rounded-xl w-fit text-indigo-600 mb-4">
                <Percent className="w-5 h-5" />
              </div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Approval Rate</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{approvalRate}%</h3>
            </div>
            <div className="mt-4">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${approvalRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Trends Area Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-left flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800">Monthly Applications Trend</h2>
              <p className="text-slate-400 text-xs">A historical overview of application flow over time.</p>
            </div>
            <div className="h-[300px] w-full flex-1">
              {monthlyApplications.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                  No application trend data available yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyApplications} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        color: "#fff"
                      }}
                      itemStyle={{ color: "#e2e8f0" }}
                      labelStyle={{ fontWeight: "bold", color: "#fff", marginBottom: "4px" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#6366f1" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorApplications)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Status Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-left flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Application Statuses</h2>
              <p className="text-slate-400 text-xs mb-4">Breakdown of current application decisions.</p>
            </div>
            
            <div className="h-[220px] w-full flex items-center justify-center relative">
              {applicationStatus.length === 0 ? (
                <div className="text-slate-400 italic text-sm">
                  No status data available
                </div>
              ) : (
                <>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-800">{totalApplications}</span>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Total</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicationStatus}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {applicationStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={statusColors[entry.name] || pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              {applicationStatus.map((entry, index) => {
                const color = statusColors[entry.name] || pieColors[index % pieColors.length];
                return (
                  <div key={entry.name} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-55/40 border border-slate-100/50">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                      <span className="text-[11px] font-bold text-slate-600">{entry.name}</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-800 mt-0.5">{entry.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Categories, Top Events, Active Volunteers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Categories */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-violet-50 rounded-lg text-violet-600">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Top Categories</h2>
              </div>
              <p className="text-slate-400 text-xs mb-6">Distribution and engagement across key domains.</p>
              
              <div className="space-y-5">
                {categoryStats.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 italic text-sm">
                    No category data available
                  </div>
                ) : (
                  categoryStats.map((cat, idx) => {
                    const maxApps = Math.max(...categoryStats.map(c => c.applicationsCount), 1);
                    const pct = Math.round((cat.applicationsCount / maxApps) * 100);
                    const gradient = categoryGradients[cat.category] || "from-slate-500 to-slate-700";
                    
                    return (
                      <div key={cat.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-slate-700">{cat.category}</span>
                          <div className="text-xs text-slate-400">
                            <span className="font-bold text-slate-700">{cat.applicationsCount}</span> apps
                            <span className="mx-1.5">•</span>
                            <span className="font-bold text-slate-700">{cat.eventCount}</span> events
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Top Performing Events (Event Performance) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Event Performance</h2>
              </div>
              <p className="text-slate-400 text-xs mb-5">Events generating the highest volunteer signups.</p>
              
              <div className="divide-y divide-slate-100">
                {topEvents.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 italic text-sm">
                    No event performance data
                  </div>
                ) : (
                  topEvents.map((item, idx) => {
                    const e = item.event;
                    return (
                      <div key={idx} className="py-3.5 flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3 truncate">
                          {e?.image ? (
                            <img 
                              src={e.image} 
                              alt={e.title} 
                              className="w-10 h-10 rounded-xl object-cover border border-slate-100" 
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryGradients[e?.category] || "from-indigo-500 to-purple-600"} flex items-center justify-center text-white font-extrabold text-xs shadow-sm`}>
                              {e?.title?.charAt(0) || "E"}
                            </div>
                          )}
                          <div className="truncate">
                            <h4 className="font-semibold text-slate-800 text-sm truncate group-hover:text-indigo-600 transition-colors">
                              {e?.title || "Deleted Event"}
                            </h4>
                            <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              {e?.category} • {formatDate(e?.eventDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/50">
                            {item.applicationCount} apps
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Top Active Volunteers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Most Active Volunteers</h2>
              </div>
              <p className="text-slate-400 text-xs mb-5">Volunteers with the highest application submissions.</p>
              
              <div className="divide-y divide-slate-100">
                {activeVolunteers.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 italic text-sm">
                    No active volunteers on record
                  </div>
                ) : (
                  activeVolunteers.map((item, idx) => {
                    const u = item.user;
                    const approvalPct = item.applicationCount 
                      ? Math.round((item.approvedCount / item.applicationCount) * 100)
                      : 0;
                    
                    return (
                      <div key={idx} className="py-3.5 flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3 truncate">
                          {u?.profileImage ? (
                            <img 
                              src={u.profileImage} 
                              alt={u.name} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-100" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                              {u?.name?.charAt(0) || "V"}
                            </div>
                          )}
                          <div className="truncate">
                            <h4 className="font-semibold text-slate-800 text-sm truncate">
                              {u?.name || "Deleted Volunteer"}
                            </h4>
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              {u?.city && <><MapPin className="w-3 h-3" /> {u.city} • </>} {item.applicationCount} Applications
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            approvalPct >= 70 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : approvalPct >= 40 
                              ? "bg-amber-50 text-amber-700 border-amber-100" 
                              : "bg-slate-50 text-slate-600 border-slate-100"
                          }`}>
                            {approvalPct}% Appr
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
                </div>
                <Link 
                  to="/admin/applications" 
                  className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  Manage applications
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Volunteer</th>
                      <th className="pb-3 font-semibold">Event</th>
                      <th className="pb-3 font-semibold">Applied At</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {recentApplications.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-slate-400 italic">
                          No recent applications received
                        </td>
                      </tr>
                    ) : (
                      recentApplications.map((app) => (
                        <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              {app.volunteer?.profileImage ? (
                                <img 
                                  src={app.volunteer.profileImage} 
                                  alt={app.volunteer.name} 
                                  className="w-7 h-7 rounded-full object-cover border border-slate-100" 
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-[10px] shadow-sm">
                                  {app.volunteer?.name?.charAt(0) || "V"}
                                </div>
                              )}
                              <div>
                                <span className="font-semibold text-slate-700 block max-w-[140px] truncate">
                                  {app.volunteer?.name || "Anonymous"}
                                </span>
                                <span className="text-[10px] text-slate-400 block max-w-[140px] truncate">
                                  {app.volunteer?.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-medium text-slate-600 max-w-[180px] truncate">
                            {app.event?.title || "Deleted Event"}
                          </td>
                          <td className="py-3 text-slate-400 text-xs">
                            {formatTimeAgo(app.appliedAt)}
                          </td>
                          <td className="py-3 text-right">
                            <StatusBadge status={app.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-left flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">Quick Actions</h2>
              <p className="text-slate-400 text-xs mb-6">Shortcuts to manage your volunteer organization.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/admin/events/create" 
                  className="p-5 rounded-2xl border border-slate-100 hover:border-indigo-500/20 hover:bg-indigo-50/5 flex flex-col items-center justify-center gap-2 group transition-all duration-300 text-center shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md"
                >
                  <PlusCircle className="w-7 h-7 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs font-bold text-slate-700 mt-1">Create Event</span>
                </Link>
                
                <Link 
                  to="/admin/applications" 
                  className="p-5 rounded-2xl border border-slate-100 hover:border-amber-500/20 hover:bg-amber-50/5 flex flex-col items-center justify-center gap-2 group transition-all duration-300 text-center shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md"
                >
                  <ClipboardList className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs font-bold text-slate-700 mt-1">Manage Apps</span>
                </Link>
                
                <Link 
                  to="/volunteers" 
                  className="p-5 rounded-2xl border border-slate-100 hover:border-emerald-500/20 hover:bg-emerald-50/5 flex flex-col items-center justify-center gap-2 group transition-all duration-300 text-center shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md"
                >
                  <UserCheck className="w-7 h-7 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs font-bold text-slate-700 mt-1">Volunteers</span>
                </Link>
                
                <Link 
                  to="/admin/reports" 
                  className="p-5 rounded-2xl border border-slate-100 hover:border-rose-500/20 hover:bg-rose-50/5 flex flex-col items-center justify-center gap-2 group transition-all duration-300 text-center shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md"
                >
                  <BarChart3 className="w-7 h-7 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs font-bold text-slate-700 mt-1">Run Reports</span>
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>VolunteerHub v2.4.0</span>
              <a 
                href="/" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-0.5 hover:text-slate-600 transition-colors"
              >
                Go to Website
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
