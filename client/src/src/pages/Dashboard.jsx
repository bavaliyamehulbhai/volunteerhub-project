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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back, {profile?.name || user?.name || "Volunteer"}!
            </h1>
            <p className="text-slate-500 mt-1">Here is a quick overview of your volunteering activities.</p>
          </div>
          {user?.role === "admin" && (
            <Link
              to="/admin/applications"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
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
              <h2 className="text-2xl font-bold text-slate-800">Recent Applications</h2>
              {recentApplications && recentApplications.length > 0 && (
                <Link
                  to="/applications"
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 group"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            {!recentApplications || recentApplications.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center space-y-4 h-64">
                <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">No Applications Yet</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-xs">
                    Apply to open events to track your volunteer status and insights.
                  </p>
                </div>
                <Link
                  to="/events"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow transition-all duration-200"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {recentApplications.slice(0, 5).map((app) => (
                  <div key={app._id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-800">{app.eventId?.title || "Unknown Event"}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {app.eventId?.location || "No Location"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Approval Rate & Pie Chart */}
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-bold text-slate-800">Insights</h2>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              {/* Approval Rate Card */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-500 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    Approval Rate
                  </span>
                  <span className="text-slate-800">{approvalRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${approvalRate}%` }}
                  />
                </div>
              </div>

              {/* Status Pie Chart */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-4">Application Status Distribution</span>
                {chartData.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm italic">
                    No status data available
                  </div>
                ) : (
                  <div className="h-[200px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          innerRadius={45}
                          paddingAngle={3}
                        >
                          {chartData.map((entry, index) => (
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
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: "12px", fontWeight: "600" }}
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
            <h2 className="text-2xl font-bold text-slate-800">Recommended For You</h2>
            <p className="text-slate-500 mt-1 text-sm">Open events matching your skills and interests</p>
          </div>
          
          {isRecommendedLoading ? (
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-200 border border-slate-100 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : !recommendedEvents || recommendedEvents.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200/80 shadow-sm mt-6 text-center text-slate-500">
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