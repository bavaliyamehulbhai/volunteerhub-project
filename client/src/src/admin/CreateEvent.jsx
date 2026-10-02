import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Sparkles } from "lucide-react";
import { createEvent } from "../services/eventService";
import EventForm from "../components/EventForm";
import DashboardLayout from "../layouts/DashboardLayout";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async (data) => {
    setLoading(true);
    try {
      await createEvent(data);
      toast.success("Event Created Successfully!");
      navigate("/events");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 text-left animate-in fade-in duration-300">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/dashboard" 
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600 hover:text-slate-800 flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Admin Dashboard / Event Builder
          </span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100 shadow-sm relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -ml-16 -mb-16"></div>
          
          <div className="text-left relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Event Campaign
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 tracking-tight">Create New Event</h1>
            <p className="text-slate-600 mt-2 text-sm md:text-base font-medium max-w-xl">Deploy a new volunteering project or campaign to recruit helpers and track engagement.</p>
          </div>
        </div>

        {/* Unified Event Form */}
        <EventForm 
          onSubmit={handleCreateEvent} 
          isLoading={loading} 
          submitButtonText={loading ? "Publishing Campaign..." : "Publish Event"} 
        />
        
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;
