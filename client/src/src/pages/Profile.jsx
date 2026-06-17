import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Sparkles, 
  UploadCloud, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Tag
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { getProfile, updateProfile } from "../services/authService";
import { uploadImage } from "../services/uploadService";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";

const Profile = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("personal");
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {},
    type: "info"
  });

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // Password state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // MFA & Security Questions state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState([
    { question: "What was your first pet's name?", answer: "" },
    { question: "In what city did your parents meet?", answer: "" },
    { question: "What was the name of your first school?", answer: "" }
  ]);

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch current profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile
  });

  // Populate form states when data loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
      setProfileImage(profile.profileImage || "");
      setSelectedSkills(profile.skills || []);
      setMfaEnabled(profile.mfaEnabled || false);
      if (profile.securityQuestions && profile.securityQuestions.length === 3) {
        setSecurityQuestions(profile.securityQuestions.map(q => ({ question: q.question, answer: "" })));
      }
    }
  }, [profile]);

  // Profile update mutation
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedData) => {
      toast.success("Profile updated successfully!");
      // Update react-query cache and session user storage
      queryClient.setQueryData(["profile"], updatedData);
      
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        name: updatedData.name,
        profileImage: updatedData.profileImage
      }));
      
      // Reset password states
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  });

  // Dropzone callback for image upload
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadImage(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });
      setProfileImage(response.imageUrl);
      toast.success("Avatar uploaded successfully! Save changes to apply.");
    } catch (error) {
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1
  });

  // Skills preset list
  const availableSkills = [
    "Teaching", 
    "Healthcare", 
    "First Aid", 
    "Event Planning", 
    "Social Media", 
    "Environment", 
    "Mentoring", 
    "Public Relations", 
    "Fundraising", 
    "Design", 
    "Logistics", 
    "Translation"
  ];

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (activeTab === "security") {
      if (!currentPassword) {
        toast.error("Current password is required to update security settings");
        return;
      }
      if (password && password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    const payload = {
      name,
      phone,
      city,
      profileImage,
      skills: selectedSkills
    };

    if (activeTab === "security") {
      payload.currentPassword = currentPassword;
      payload.mfaEnabled = mfaEnabled;

      const filledQuestions = securityQuestions.filter(q => q.answer.trim() !== "");
      if (filledQuestions.length > 0) {
        if (filledQuestions.length < 3) {
          toast.error("Please answer all 3 security questions to save them");
          return;
        }
        payload.securityQuestions = filledQuestions;
      }

      if (password) {
        payload.password = password;
      }
    }

    const title = activeTab === "security" ? "Update Security Settings" : "Save Profile Changes";
    const message = activeTab === "security" 
      ? "Are you sure you want to update your security settings?" 
      : "Are you sure you want to save changes to your profile?";

    setConfirmConfig({
      isOpen: true,
      title,
      message,
      confirmText: activeTab === "security" ? "Update Settings" : "Save Changes",
      cancelText: "Cancel",
      type: activeTab === "security" ? "warning" : "info",
      onConfirm: () => {
        updateMutation.mutate(payload);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
          <Loader />
          <p className="text-slate-500 font-medium">Syncing account details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12 text-left">
        
        {/* Header Title */}
        <div className="border-b border-slate-200/60 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your public profile, customize volunteer skills, and adjust security settings.</p>
        </div>

        {/* Outer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar Panel */}
          <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 snap-x whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setActiveTab("personal")}
              type="button"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer flex-shrink-0 snap-start ${
                activeTab === "personal"
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <User className="w-4 h-4" />
              Personal Info
            </button>
            
            {profile?.role !== "admin" && (
              <button
                onClick={() => setActiveTab("skills")}
                type="button"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer flex-shrink-0 snap-start ${
                  activeTab === "skills"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Tag className="w-4 h-4" />
                Volunteer Skills
              </button>
            )}

            <button
              onClick={() => setActiveTab("security")}
              type="button"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer flex-shrink-0 snap-start ${
                activeTab === "security"
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Lock className="w-4 h-4" />
              Security
            </button>
          </div>

          {/* Form Content Area */}
          <div className="md:col-span-3">
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
              
              <div className="p-8 space-y-8">
                
                {/* Tab: Personal Info */}
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                      <p className="text-slate-400 text-xs mt-0.5">Your email address is managed by your organization administration.</p>
                    </div>

                    {/* Avatar Upload Container */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <div className="relative">
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt={name} 
                            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/10 shadow-md"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-3xl shadow-md">
                            {name?.charAt(0) || "U"}
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-slate-900/60 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold">
                            <span>{uploadProgress}%</span>
                            <span className="animate-pulse mt-0.5">Uploading</span>
                          </div>
                        )}
                      </div>

                      {/* Drag & Drop Area */}
                      <div 
                        {...getRootProps()} 
                        className={`flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                          isDragActive 
                            ? "border-indigo-500 bg-indigo-50/10" 
                            : "border-slate-200 hover:border-indigo-500/40"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-600">
                          {isDragActive ? "Drop your avatar file here" : "Drag & drop avatar image, or click to browse"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP or GIF up to 5MB</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 opacity-70">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            disabled
                            value={profile?.email || ""}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium text-sm cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">City / Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="San Francisco, CA"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Tab: Skills (Volunteer Only) */}
                {activeTab === "skills" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Volunteer Skills & Interests</h2>
                      <p className="text-slate-400 text-xs mt-0.5">Select the skills you want to contribute. This will customize your recommended events dashboard.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableSkills.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            className={`p-3.5 border rounded-xl text-xs font-bold transition-all text-center flex items-center justify-between group cursor-pointer ${
                              isSelected
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <span>{skill}</span>
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                              isSelected 
                                ? "bg-indigo-600 text-white" 
                                : "bg-slate-100 group-hover:bg-slate-200 text-transparent"
                            }`}>
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab: Security */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Password & Security</h2>
                      <p className="text-slate-400 text-xs mt-0.5">Protect your account with high-level Z-security controls.</p>
                    </div>

                    {/* Current Password Validation Required */}
                    <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-600" />
                        <h3 className="text-sm font-bold text-amber-800">Authentication Required</h3>
                      </div>
                      <p className="text-xs text-amber-600/90 leading-relaxed">
                        To update any sensitive security settings (password, MFA, or security questions), you must enter your current password.
                      </p>
                      <div className="space-y-1.5 max-w-md">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 my-4"></div>

                    {/* MFA Configuration */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50/60 border border-slate-200/60 rounded-2xl">
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-bold text-slate-800">Email Multi-Factor Authentication (MFA)</h3>
                          <p className="text-xs text-slate-400">Receive a 6-digit OTP code to your email upon login.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMfaEnabled(!mfaEnabled)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            mfaEnabled ? "bg-indigo-600" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              mfaEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 my-4"></div>

                    {/* Password Change */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800">Update Password</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Confirm New Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 my-4"></div>

                    {/* Security Questions */}
                    <div className="space-y-4 text-left">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Setup Security Questions</h3>
                        <p className="text-xs text-slate-400">Configure three security questions to verify your identity on administrative operations.</p>
                      </div>

                      <div className="space-y-4">
                        {securityQuestions.map((sq, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                              Question {idx + 1}: {sq.question}
                            </label>
                            <input
                              type="text"
                              value={sq.answer}
                              onChange={(e) => {
                                const newSq = [...securityQuestions];
                                newSq[idx].answer = e.target.value;
                                setSecurityQuestions(newSq);
                              }}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                              placeholder="Enter your security answer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Bottom Action Footer */}
              <div className="bg-slate-50 p-6 px-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  SaaS Protected Profile
                </div>
                
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer hover:shadow-indigo-600/25 transition-all duration-200 flex items-center gap-2"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  <Check className="w-4 h-4" />
                </button>
              </div>

            </form>
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

export default Profile;
