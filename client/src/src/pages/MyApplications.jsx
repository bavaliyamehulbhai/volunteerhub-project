import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "../services/applicationService";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import { FileText, CheckCircle2, Clock, XCircle, MapPin, Calendar } from "lucide-react";

const MyApplications = () => {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["myApplications"],
    queryFn: getMyApplications,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-md space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-md space-y-3">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = {
    applied: applications.length,
    approved: applications.filter(app => app.status === "approved").length,
    pending: applications.filter(app => app.status === "pending").length,
    rejected: applications.filter(app => app.status === "rejected").length
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-left transition-colors">My Applications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-left transition-colors">Track the status of your volunteer event submissions.</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md dark:hover:shadow-indigo-900/20 transition-all duration-300">
            <div className="text-left">
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider transition-colors">Applied</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block transition-colors">{stats.applied}</span>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md dark:hover:shadow-emerald-900/20 transition-all duration-300">
            <div className="text-left">
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider transition-colors">Approved</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block transition-colors">{stats.approved}</span>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md dark:hover:shadow-amber-900/20 transition-all duration-300">
            <div className="text-left">
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider transition-colors">Pending</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block transition-colors">{stats.pending}</span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl transition-colors">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md dark:hover:shadow-rose-900/20 transition-all duration-300">
            <div className="text-left">
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider transition-colors">Rejected</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block transition-colors">{stats.rejected}</span>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl transition-colors">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="text-center py-20 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-10 shadow-sm dark:shadow-none max-w-md mx-auto space-y-4 transition-colors">
            <div className="inline-flex p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl transition-colors">
              <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">No Applications Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto transition-colors">
              You haven't applied to any volunteer events yet. Check out the Events page to get started!
            </p>
          </div>
        ) : (
          /* Applications List */
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-slate-300/80 dark:hover:border-slate-700 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
                    {application.eventId?.title || "Unknown Event"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors" />
                      {application.eventId?.location || "No Location Specified"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors" />
                      Applied On: {new Date(application.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center self-start md:self-center">
                  <StatusBadge status={application.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
