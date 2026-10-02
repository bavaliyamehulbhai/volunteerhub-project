import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../services/eventService";
import { applyEvent } from "../services/applicationService";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import ConfirmModal from "../components/ConfirmModal";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {},
    type: "info"
  });

  // Calculate skill match score
  let matchScore = 0;
  let matchedSkills = [];
  if (user?.skills && event?.requiredSkills) {
    if (!event.requiredSkills.length) {
      matchScore = 100;
    } else {
      matchedSkills = event.requiredSkills.filter(skill =>
        user.skills.includes(skill)
      );
      matchScore = Math.round((matchedSkills.length / event.requiredSkills.length) * 100);
    }
  }

  const handleApply = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Apply for Event",
      message: "Are you sure you want to apply to volunteer for this event?",
      confirmText: "Apply Now",
      cancelText: "Cancel",
      type: "info",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await applyEvent(event._id);
          toast.success("Application Submitted");
          setEvent((prev) => ({
            ...prev,
            registeredCount: prev.registeredCount + 1
          }));
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to apply");
        }
      }
    });
  };

  const handleDelete = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Event Campaign",
      message: "Are you sure you want to permanently delete this event campaign? This action cannot be undone.",
      confirmText: "Delete Event",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await deleteEvent(event._id);
          toast.success("Event Campaign Deleted Successfully");
          navigate("/events");
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete event");
        }
      }
    });
  };


  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
          {/* Skeleton Banner */}
          <div className="h-96 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl w-full"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="animate-pulse h-6 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
              <div className="animate-pulse h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-4">
                <div className="animate-pulse h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-4">
                <div className="animate-pulse h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="animate-pulse h-10 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="animate-pulse h-10 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-10 shadow-sm dark:shadow-none max-w-md mx-auto transition-colors duration-300">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">Event Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">The event you are looking for does not exist or has been removed.</p>
          <button
            onClick={() => navigate("/events")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow transition-all duration-200 cursor-pointer"
          >
            Back to Events
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const availableSeats = event.requiredVolunteers - event.registeredCount;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6 text-left">
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            ← Back to Events
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 mb-8 transition-colors">
          <img
            src={
              event.image ||
              "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
            }
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8 text-left">
            {/* Header */}
            <div>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wider transition-colors">
                {event.category}
              </span>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-4 transition-colors">
                {event.title}
              </h1>
            </div>

            {/* About Event */}
            <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors">About Event</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap transition-colors">
                {event.description}
              </p>
            </div>

            {/* Required Skills */}
            {event.requiredSkills && event.requiredSkills.length > 0 && (
              <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {event.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold px-4 py-2 rounded-full border border-blue-100/50 dark:border-blue-800/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl shadow-sm dark:shadow-none border border-slate-200/80 dark:border-slate-800/80 sticky top-6 space-y-6 text-left transition-colors">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 transition-colors">Event Info</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block font-semibold uppercase tracking-wider transition-colors">Location</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">📅</span>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block font-semibold uppercase tracking-wider transition-colors">Date</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                      {new Date(event.eventDate).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">🏷️</span>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block font-semibold uppercase tracking-wider transition-colors">Category</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{event.category}</span>
                  </div>
                </div>
              </div>

              {/* Skill Match Score */}
              {user?.role !== "admin" && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-left transition-colors">
                  <div className="flex justify-between items-center text-sm font-semibold mb-2">
                    <span className="text-slate-500 dark:text-slate-400 transition-colors">Skill Match</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
                      matchScore >= 70 ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50" :
                      matchScore >= 40 ? "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/50" :
                      matchScore > 0 ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50" :
                      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60"
                    }`}>
                      {matchScore}% Match
                    </span>
                  </div>
                  {matchedSkills.length > 0 ? (
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 dark:text-slate-500 block font-semibold uppercase tracking-wider transition-colors">Matched Skills</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {matchedSkills.map(skill => (
                          <span key={skill} className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/50 text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic font-medium block transition-colors">
                      No skills matched with this event.
                    </span>
                  )}
                </div>
              )}

              {/* Seats Progress & Available Seats */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 transition-colors">
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span className="text-slate-500 dark:text-slate-400 transition-colors">Volunteers</span>
                  <span className="text-slate-800 dark:text-slate-200 transition-colors">
                    {event.registeredCount} / {event.requiredVolunteers} Filled
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden transition-colors">
                  <div
                    className="bg-green-500 dark:bg-green-400 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((event.registeredCount / event.requiredVolunteers) * 100, 100)}%`
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 block font-medium transition-colors">
                  {availableSeats > 0 ? `${availableSeats} seats remaining` : "No seats remaining"}
                </span>
              </div>

              {/* Admin Actions vs Volunteer Apply Button */}
              {user?.role === "admin" ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-600/90 dark:hover:bg-rose-500 active:bg-rose-800 text-white font-semibold py-3.5 px-4 rounded-xl text-md transition-all duration-200 shadow shadow-rose-500/10 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer active:scale-[0.98] text-center"
                >
                  Delete Event Campaign
                </button>
              ) : (
                <button
                  disabled={availableSeats <= 0}
                  onClick={handleApply}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 active:bg-blue-800 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-semibold py-3.5 px-4 rounded-xl text-md transition-all duration-200 shadow shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {availableSeats > 0 ? "Apply Now" : "Event Full"}
                </button>
              )}
            </div>
          </div>
        </div>
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

export default EventDetails;
