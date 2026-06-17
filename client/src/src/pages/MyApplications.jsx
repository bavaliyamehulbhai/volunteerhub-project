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
          <div className="h-10 bg-slate-200 animate-pulse rounded-lg w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 animate-pulse rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="h-6 bg-slate-200 animate-pulse rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 animate-pulse rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 animate-pulse rounded w-20"></div>
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">My Applications</h1>
          <p className="text-slate-500 mt-2 text-left">Track the status of your volunteer event submissions.</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="text-left">
              <span className="text-sm font-semibold text-slate-400 block uppercase tracking-wider">Applied</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{stats.applied}</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="text-left">
              <span className="text-sm font-semibold text-slate-400 block uppercase tracking-wider">Approved</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{stats.approved}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="text-left">
              <span className="text-sm font-semibold text-slate-400 block uppercase tracking-wider">Pending</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{stats.pending}</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="text-left">
              <span className="text-sm font-semibold text-slate-400 block uppercase tracking-wider">Rejected</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{stats.rejected}</span>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/80 rounded-2xl p-10 shadow-sm max-w-md mx-auto space-y-4">
            <div className="inline-flex p-4 bg-slate-50 text-slate-400 rounded-2xl">
              <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No Applications Yet</h2>
            <p className="text-slate-500 max-w-xs mx-auto">
              You haven't applied to any volunteer events yet. Check out the Events page to get started!
            </p>
          </div>
        ) : (
          /* Applications List */
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-800">
                    {application.eventId?.title || "Unknown Event"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {application.eventId?.location || "No Location Specified"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
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
