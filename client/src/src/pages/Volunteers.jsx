import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  X, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  Tag
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getVolunteers } from "../services/adminService";
import { getAllApplications } from "../services/applicationService";
import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";

const Volunteers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [activeVolunteer, setActiveVolunteer] = useState(null);

  // Fetch volunteers summary (with application counts aggregated from backend)
  const { data: volunteers = [], isLoading: isVolunteersLoading } = useQuery({
    queryKey: ["adminVolunteers"],
    queryFn: getVolunteers
  });

  // Fetch all applications in order to show detail application history for active volunteer
  const { data: applications = [], isLoading: isApplicationsLoading } = useQuery({
    queryKey: ["allApplications"],
    queryFn: getAllApplications
  });

  if (isVolunteersLoading || isApplicationsLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
          <Loader />
          <p className="text-slate-500 font-medium">Analyzing volunteer database...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Get unique cities for filter dropdown
  const cities = ["all", ...new Set(volunteers.map(v => v.city).filter(Boolean))];
  
  // Get unique skills for filter dropdown
  const skillsList = ["all", ...new Set(volunteers.flatMap(v => v.skills || []))];

  // Filter volunteers based on search query, city, and skills
  const filteredVolunteers = volunteers.filter((vol) => {
    const matchesSearch = 
      vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === "all" || vol.city === selectedCity;
    const matchesSkill = selectedSkill === "all" || (vol.skills && vol.skills.includes(selectedSkill));

    return matchesSearch && matchesCity && matchesSkill;
  });

  // Get selected volunteer's full application history
  const activeVolunteerHistory = activeVolunteer 
    ? applications.filter(app => {
        // Handle object references populated from mongoose or fallback IDs
        const appVolunteerId = app.volunteerId?._id || app.volunteerId;
        return appVolunteerId === activeVolunteer._id;
      })
    : [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Admin Directory
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">Volunteer Directory</h1>
            <p className="text-slate-500 mt-1">Review active participants, audit signup engagement, and monitor applications.</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 p-2 px-3 rounded-xl shadow-sm">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{volunteers.length} Total Volunteers</span>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
            />
          </div>

          {/* City filter */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all capitalize"
            >
              <option value="all">All Cities</option>
              {cities.filter(c => c !== "all").map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Skills filter */}
          <div className="relative">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all capitalize"
            >
              <option value="all">All Skills</option>
              {skillsList.filter(s => s !== "all").map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Directory Grid */}
        {filteredVolunteers.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
              <Users className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">No Volunteers Found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                No volunteer records match your search criteria. Try modifying your filter options.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map((vol) => {
              const approvalRate = vol.totalApplications
                ? Math.round((vol.approvedApplications / vol.totalApplications) * 100)
                : 0;

              return (
                <div 
                  key={vol._id} 
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top Details */}
                  <div className="p-6 space-y-5">
                    
                    {/* Identity row */}
                    <div className="flex items-center gap-3">
                      {vol.profileImage ? (
                        <img 
                          src={vol.profileImage} 
                          alt={vol.name} 
                          className="w-12 h-12 rounded-full object-cover border border-slate-100" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {vol.name.charAt(0)}
                        </div>
                      )}
                      <div className="truncate">
                        <h3 className="font-bold text-slate-800 text-base leading-tight truncate group-hover:text-indigo-600 transition-colors">
                          {vol.name}
                        </h3>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {vol.city || "Not Provided"}
                        </span>
                      </div>
                    </div>

                    {/* Quick Contacts */}
                    <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{vol.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{vol.phone || "No phone listed"}</span>
                      </div>
                    </div>

                    {/* Skill Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {!vol.skills || vol.skills.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">No skills listed</span>
                        ) : (
                          vol.skills.slice(0, 3).map((skill) => (
                            <span 
                              key={skill} 
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100"
                            >
                              {skill}
                            </span>
                          ))
                        )}
                        {vol.skills && vol.skills.length > 3 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                            +{vol.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Summary Stats Footer & Button */}
                  <div className="bg-slate-50/70 border-t border-slate-100 p-4 flex items-center justify-between">
                    
                    {/* Compact stats */}
                    <div className="flex gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider leading-none">Apps</span>
                        <span className="text-sm font-extrabold text-slate-700 mt-1 block">{vol.totalApplications}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider leading-none">Appr</span>
                        <span className="text-sm font-extrabold text-emerald-600 mt-1 block">{vol.approvedApplications}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider leading-none">Rate</span>
                        <span className="text-sm font-extrabold text-indigo-600 mt-1 block">{approvalRate}%</span>
                      </div>
                    </div>

                    {/* Detail trigger */}
                    <button
                      onClick={() => setActiveVolunteer(vol)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      Audit
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Detail Modal Overlay */}
        {activeVolunteer && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  {activeVolunteer.profileImage ? (
                    <img 
                      src={activeVolunteer.profileImage} 
                      alt={activeVolunteer.name} 
                      className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-sm" 
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {activeVolunteer.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">{activeVolunteer.name}</h2>
                    <span className="text-xs text-slate-400 mt-0.5 block capitalize">{activeVolunteer.city || "Location not provided"}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveVolunteer(null)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
                
                {/* Volunteer Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-xs font-semibold text-slate-700 mt-1 block truncate">{activeVolunteer.email}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                    <span className="text-xs font-semibold text-slate-700 mt-1 block">{activeVolunteer.phone || "None listed"}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Success Rate</span>
                    <span className="text-sm font-extrabold text-indigo-600 mt-1 block flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {activeVolunteer.totalApplications 
                        ? Math.round((activeVolunteer.approvedApplications / activeVolunteer.totalApplications) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Joined Date</span>
                    <span className="text-xs font-semibold text-slate-700 mt-1 block">
                      {new Date(activeVolunteer.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Skills list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    Volunteer Skillsets
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {!activeVolunteer.skills || activeVolunteer.skills.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No skills registered.</span>
                    ) : (
                      activeVolunteer.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50/50 text-indigo-700 border border-indigo-100/50"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Applications history table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    Application Timeline ({activeVolunteerHistory.length})
                  </h4>
                  
                  <div className="border border-slate-100 rounded-xl overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="p-3">Applied Program / Event</th>
                          <th className="p-3">Applied At</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeVolunteerHistory.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="p-6 text-center text-slate-400 italic">
                              This volunteer hasn't submitted any applications.
                            </td>
                          </tr>
                        ) : (
                          activeVolunteerHistory.map((app) => (
                            <tr key={app._id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-slate-700 max-w-[200px] truncate block">
                                    {app.eventId?.title || "Deleted Event"}
                                  </span>
                                  {app.eventId?._id && (
                                    <a 
                                      href={`/events/${app.eventId._id}`} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-slate-400 hover:text-indigo-600"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 block mt-0.5">{app.eventId?.location}</span>
                              </td>
                              <td className="p-3 text-xs text-slate-400">
                                {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </td>
                              <td className="p-3 text-right">
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

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50/70 border-t border-slate-100 text-right">
                <button
                  onClick={() => setActiveVolunteer(null)}
                  className="px-5 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Close Audit
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Volunteers;