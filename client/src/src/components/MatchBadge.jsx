const MatchBadge = ({ score }) => {
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200/60";
  if (score >= 70) {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  } else if (score >= 40) {
    colorClass = "bg-sky-50 text-sky-700 border-sky-200/60";
  } else if (score > 0) {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200/60";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${colorClass} transition-all duration-200`}
    >
      {score}% Match
    </span>
  );
};

export default MatchBadge;
