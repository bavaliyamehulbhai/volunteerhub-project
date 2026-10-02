import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, Clock, XCircle, TrendingUp, MapPin, Calendar, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authService";
import { getRecommendedEvents } from "../services/eventService";
import { getMyApplications, getApplicationStats } from "../services/applicationService";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import EventCard from "../components/EventCard";
import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const { data: profile, isLoading: isProfileLoading, error } = useQuery({
    queryKey: ["profile", user?._id],
    queryFn: getProfile,
    enabled: !!user?.token && user?.role !== "admin",
  });

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["applicationStats", user?._id],
    queryFn: getApplicationStats,
    enabled: !!user?.token && user?.role !== "admin",
  });

  const { data: recommendedEvents, isLoading: isRecommendedLoading } = useQuery({
    queryKey: ["recommendedEvents", user?._id],
    queryFn: getRecommendedEvents,
    enabled: !!user?.token && user?.role !== "admin",
  });

  const { data: recentApplications, isLoading: isRecentLoading } = useQuery({
    queryKey: ["recentApplications", user?._id],
    queryFn: getMyApplications,
    enabled: !!user?.token && user?.role !== "admin",
  });

  useEffect(() => {
    if (error) {
      toast.error("Session expired or unauthorized. Please log in again.");
      logout();
    }
  }, [error, logout]);

  if (user?.role === "admin") {
    return <Loader />;
  }

  if (isProfileLoading || isStatsLoading || isRecommendedLoading || isRecentLoading) {
    return <Loader />;
  }

  // Calculate approval rate
  const approvalRate = stats && stats.applied > 0
    ? Math.round((stats.approved / stats.applied) * 100)
    : 0;

  // Chart data
  const chartData = [
    { name: "Approved", value: stats?.approved || 0, color: "#10b981" },
    { name: "Pending", value: stats?.pending || 0, color: "#f59e0b" },
    { name: "Rejected", value: stats?.rejected || 0, color: "#ef4444" }
  ].filter(item => item.value > 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="text-left relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-slate-100 dark:via-indigo-300 dark:to-slate-200 tracking-tight transition-colors duration-300">
              Welcome Back, {profile?.name || user?.name || "Volunteer"}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm md:text-base font-medium transition-colors duration-300">Here is a quick overview of your volunteering activities.</p>
          </div>
          {user?.role === "admin" && (
            <Link
              to="/admin/applications"
              className="relative z-10 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Go to Admin Panel
            </Link>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Applied"
            value={stats?.applied}
            color="blue"
            icon={<FileText className="w-5 h-5 text-blue-500" />}
          />
          <StatCard
            title="Approved"
            value={stats?.approved}
            color="emerald"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          />
          <StatCard
            title="Pending"
            value={stats?.pending}
            color="amber"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
          />
          <StatCard
            title="Rejected"
            value={stats?.rejected}
            color="rose"
            icon={<XCircle className="w-5 h-5 text-rose-500" />}
          />
        </div>

        {/* Middle Row: Recent Activity & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recent Applications */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">Recent Applications</h2>
              {recentApplications && recentApplications.length > 0 && (
                <Link
                  to="/applications"
                  className="text-blue-600 dark:text-indigo-400 hover:text-blue-700 dark:hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 group transition-colors duration-300"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            {!recentApplications || recentApplications.length === 0 ? (
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none text-center flex flex-col items-center justify-center space-y-5 h-[300px] transition-all hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-400 dark:text-indigo-300 rounded-2xl shadow-inner dark:shadow-none">
                  <FileText className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">No Applications Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs leading-relaxed">
                    Apply to open events to track your volunteer status and insights.
                  </p>
                </div>
                <Link
                  to="/events"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none divide-y divide-slate-100/60 dark:divide-slate-800/60 overflow-hidden transition-all duration-300">
                {recentApplications.slice(0, 5).map((app) => (
                  <div key={app._id} className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300 group cursor-pointer">
                    <div className="space-y-1.5">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{app.eventId?.title || "Unknown Event"}</h3>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          {app.eventId?.location || "No Location"}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="scale-95 group-hover:scale-100 transition-transform">
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Approval Rate & Pie Chart */}
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">Insights</h2>
            
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-7 rounded-3xl border border-white dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-7 transition-all hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20">
              {/* Approval Rate Card */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 transition-colors duration-300">
                    <TrendingUp className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />
                    Approval Rate
                  </span>
                  <span className="text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md transition-colors duration-300">{approvalRate}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden shadow-inner dark:shadow-none transition-colors duration-300">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${approvalRate}%` }}
                  />
                </div>
              </div>

              {/* Status Pie Chart */}
              <div className="border-t border-slate-100/80 dark:border-slate-800/80 pt-6 transition-colors duration-300">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest mb-4">Status Distribution</span>
                {chartData.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed transition-colors duration-300">
                    No status data available
                  </div>
                ) : (
                  <div className="h-[220px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={55}
                          paddingAngle={4}
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.4)",
                            borderRadius: "16px",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                            padding: "12px"
                          }}
                          itemStyle={{ fontWeight: "600" }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={10}
                          wrapperStyle={{ fontSize: "13px", fontWeight: "600", paddingTop: "10px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recommended Events */}
        <div className="mt-10">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">Recommended For You</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm transition-colors duration-300">Open events matching your skills and interests</p>
          </div>
          
          {isRecommendedLoading ? (
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-200 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl h-80 animate-pulse transition-colors duration-300"></div>
              ))}
            </div>
          ) : !recommendedEvents || recommendedEvents.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/60 p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm mt-6 text-center text-slate-500 dark:text-slate-400 transition-colors duration-300">
              No recommended events found at the moment. Update your skills in your profile!
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              {recommendedEvents.slice(0, 3).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;