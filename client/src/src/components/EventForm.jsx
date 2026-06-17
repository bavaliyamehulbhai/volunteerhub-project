import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "../utils/eventSchema";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadImage } from "../services/uploadService";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Layers, 
  Tag, 
  FileText, 
  UploadCloud, 
  Sparkles, 
  Check, 
  AlertCircle,
  Eye
} from "lucide-react";

const EventForm = ({ onSubmit, initialData, submitButtonText = "Create Event", isLoading = false }) => {
  const formattedInitialData = initialData
    ? {
        ...initialData,
        requiredSkills: Array.isArray(initialData.requiredSkills)
          ? initialData.requiredSkills.join(", ")
          : (initialData.requiredSkills || "")
      }
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: formattedInitialData || {
      title: "",
      description: "",
      location: "",
      category: "",
      eventDate: "",
      requiredVolunteers: 10,
      requiredSkills: ""
    }
  });

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false
  });

  const handleFormSubmit = async (data) => {
    try {
      let imageUrl = initialData?.image || "";
      
      if (image) {
        setIsUploading(true);
        const uploadResult = await uploadImage(image, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        });
        imageUrl = uploadResult.imageUrl;
      }

      const processedData = {
        ...data,
        image: imageUrl,
        requiredSkills: data.requiredSkills
          ? data.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
          : []
      };
      
      await onSubmit(processedData);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="max-w-5xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden text-left"
    >
      {/* Outer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
        
        {/* Left Column: Media Dropzone & Visual Block */}
        <div className="lg:col-span-2 p-8 space-y-6 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              Event Media
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Upload a high-quality event banner. This will be displayed across the volunteer search platform.</p>
          </div>

          {/* Banner Dropzone */}
          <div className="space-y-3">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                isDragActive 
                  ? "border-indigo-500 bg-indigo-50/20" 
                  : "border-slate-200 hover:border-indigo-500/40 bg-white hover:bg-slate-50/50"
              }`}
            >
              <input {...getInputProps()} />
              {image ? (
                <div className="space-y-3">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt="Preview" 
                    className="h-44 w-full rounded-xl object-cover border border-slate-100 shadow-sm" 
                  />
                  <p className="text-[11px] font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                    Click or drag new banner to replace
                  </p>
                </div>
              ) : initialData?.image ? (
                <div className="space-y-3">
                  <img 
                    src={initialData.image} 
                    alt="Current Banner" 
                    className="h-44 w-full rounded-xl object-cover border border-slate-100 shadow-sm" 
                  />
                  <p className="text-[11px] font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                    Click or drag new banner to replace
                  </p>
                </div>
              ) : (
                <div className="py-10 space-y-2.5">
                  <div className="p-3 bg-indigo-50 rounded-full w-fit mx-auto text-indigo-600 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Drop banner image here</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG or WEBP up to 5MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Uploading progress bar */}
            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-indigo-600">
                  <span>Uploading to Cloudinary...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Form Details */}
        <div className="lg:col-span-3 p-8 space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Event Settings
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Enter details for this event. These parameters help volunteers search and filter slots.</p>
          </div>

          <div className="space-y-4">
            
            {/* Title field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Event Title</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                placeholder="e.g. Community Food Drive Ahmedabad"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Description</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  rows="4"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Describe the volunteering details, responsibilities, schedule, and context..."
                  {...register("description")}
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Grid for Location & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="e.g. Satellite, Ahmedabad"
                    {...register("location")}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Category</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-slate-800 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
                    {...register("category")}
                  >
                    <option value="">Select Category</option>
                    <option value="Education">Education</option>
                    <option value="Environment">Environment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Community">Community</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.category.message}
                  </p>
                )}
              </div>

            </div>

            {/* Grid for Date & Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Event Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    {...register("eventDate")}
                  />
                </div>
                {errors.eventDate && (
                  <p className="text-red-500 text-xs mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.eventDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Volunteers Needed</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-55 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="e.g. 15"
                    {...register("requiredVolunteers")}
                  />
                </div>
                {errors.requiredVolunteers && (
                  <p className="text-red-500 text-xs mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.requiredVolunteers.message}
                  </p>
                )}
              </div>

            </div>

            {/* Required Skills field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Required Skills</label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  placeholder="e.g. Teaching, Communication, First Aid (comma separated)"
                  {...register("requiredSkills")}
                />
              </div>
              {errors.requiredSkills && (
                <p className="text-red-500 text-xs mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.requiredSkills.message}
                </p>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="bg-slate-50 p-6 px-8 border-t border-slate-200/80 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          🛡️ SaaS Secure Creation
        </span>
        
        <button
          type="submit"
          disabled={isSubmitting || isLoading || isUploading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer hover:shadow-indigo-600/25 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting || isUploading ? "Uploading & Creating..." : submitButtonText}
          <Check className="w-4 h-4" />
        </button>
      </div>

    </form>
  );
};

export default EventForm;