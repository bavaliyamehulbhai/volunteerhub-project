import DashboardLayout from "../layouts/DashboardLayout";

const Applications = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">Applications</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium transition-colors">Track and manage your submitted applications.</p>
      </div>
    </DashboardLayout>
  );
};

export default Applications;