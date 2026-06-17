const SearchFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  location,
  setLocation,
  resetFilters
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow border border-slate-200/80 mb-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Search</label>
          <input
            type="text"
            placeholder="Search Events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Environment">Environment</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Community">Community</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Location</label>
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={resetFilters}
            type="button"
            className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium text-sm py-2.5 rounded-lg transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
