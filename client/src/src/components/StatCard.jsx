const StatCard = ({ title, value, icon, color = "blue" }) => {
  const borderColors = {
    blue: "border-blue-500",
    emerald: "border-emerald-500",
    amber: "border-amber-500",
    rose: "border-rose-500",
  };
  
  const bgColors = {
    blue: "bg-blue-50/50",
    emerald: "bg-emerald-50/50",
    amber: "bg-amber-50/50",
    rose: "bg-rose-50/50",
  };

  return (
    <div className={`bg-white dark:bg-slate-900/60 p-6 rounded-2xl border-l-4 ${borderColors[color] || "border-blue-500"} shadow-sm dark:shadow-none flex items-center justify-between hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-indigo-900/10 transition-all duration-200 text-left backdrop-blur-md`}>
      <div>
        <h3 className="text-slate-400 dark:text-slate-500 text-sm font-semibold uppercase tracking-wider transition-colors duration-300">{title}</h3>
        <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 transition-colors duration-300">
          {value ?? 0}
        </p>
      </div>
      {icon && (
        <div className={`p-3 rounded-xl ${bgColors[color] || "bg-blue-50/50"}`}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;