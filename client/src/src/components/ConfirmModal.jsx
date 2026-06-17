import React, { useEffect } from "react";
import { AlertTriangle, HelpCircle, CheckCircle, Trash2, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "Do you really want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "info" // "info", "warning", "danger", "success"
}) => {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Icon and theme mapping
  const getThemeDetails = () => {
    switch (type) {
      case "danger":
        return {
          icon: <Trash2 className="w-6 h-6 text-rose-600" />,
          iconBg: "bg-rose-50",
          confirmBtn: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white shadow-rose-600/10 hover:shadow-rose-600/20",
          border: "border-rose-100",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          iconBg: "bg-amber-50",
          confirmBtn: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white shadow-amber-600/10 hover:shadow-amber-600/20",
          border: "border-amber-100",
        };
      case "success":
        return {
          icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
          iconBg: "bg-emerald-50",
          confirmBtn: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white shadow-emerald-600/10 hover:shadow-emerald-600/20",
          border: "border-emerald-100",
        };
      case "info":
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-indigo-600" />,
          iconBg: "bg-indigo-50",
          confirmBtn: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white shadow-indigo-600/10 hover:shadow-indigo-600/20",
          border: "border-indigo-100",
        };
    }
  };

  const theme = getThemeDetails();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Close button */}
        <button 
          onClick={onCancel} 
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Body */}
        <div className="p-6 pt-8 flex items-start gap-4">
          <div className={`p-3 rounded-xl ${theme.iconBg} flex-shrink-0`}>
            {theme.icon}
          </div>
          <div className="space-y-2 flex-1 pr-6">
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98] ${theme.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
