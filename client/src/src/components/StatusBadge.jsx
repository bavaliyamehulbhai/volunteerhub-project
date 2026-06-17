import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      className: "bg-amber-50 text-amber-700 border-amber-200/60",
      icon: <Clock className="w-3.5 h-3.5" />,
      label: "Pending"
    },
    approved: {
      className: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: "Approved"
    },
    rejected: {
      className: "bg-rose-50 text-rose-700 border-rose-200/60",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "Rejected"
    }
  };

  const current = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.className} transition-all duration-200`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export default StatusBadge;
