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
        <div className="border-b border-slate-200/60 pb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Event Campaign
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">Create New Event</h1>
          <p className="text-slate-500 mt-1">Deploy a new volunteering project or campaign to recruit helpers and track engagement.</p>
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
