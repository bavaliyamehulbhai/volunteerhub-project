import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEvents } from "../services/eventService";
import EventCard from "../components/EventCard";
import SearchFilters from "../components/SearchFilters";
import DashboardLayout from "../layouts/DashboardLayout";
import useDebounce from "../hooks/useDebounce";

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filter state values directly from URL search params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce the text search value to prevent spamming queries on every keystroke
  const debouncedSearch = useDebounce(search, 500);

  // Keep the browser URL query params synchronized with search filter state
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (location) params.location = location;
    if (page > 1) params.page = page;
    setSearchParams(params);
  }, [debouncedSearch, category, location, page, setSearchParams]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 6 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      if (location) params.location = location;

      const data = await getEvents(params);
      
      if (data && data.events) {
        setEvents(data.events);
        setTotalPages(data.totalPages || 1);
      } else {
        setEvents(Array.isArray(data) ? data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when debounced search or filter criteria updates
  useEffect(() => {
    fetchEvents();
  }, [debouncedSearch, category, location, page]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/50 shadow-sm relative overflow-hidden mb-8 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-16 -mt-16 transition-colors duration-300"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -ml-16 -mb-16 transition-colors duration-300"></div>
        <div className="text-left relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-slate-100 dark:via-indigo-300 dark:to-slate-200 tracking-tight transition-colors duration-300">Events</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm md:text-base font-medium transition-colors duration-300">Browse and search available volunteer opportunities.</p>
        </div>
      </div>

      {/* Advanced Search & Filters Component */}
      <SearchFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
        resetFilters={resetFilters}
      />

      {/* Results Count */}
      {!loading && events.length > 0 && (
        <div className="mb-4 text-left text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors duration-300">
          Found {events.length} events
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 space-y-4 backdrop-blur-md transition-colors duration-300">
              <div className="animate-pulse h-48 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="animate-pulse h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
                  <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
                </div>
                <div className="animate-pulse h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="animate-pulse h-5 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
                  <div className="animate-pulse h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Empty Search State */
        <div className="text-center py-20 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-10 shadow-sm dark:shadow-none max-w-md mx-auto backdrop-blur-md transition-colors duration-300">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">No Matching Events</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-300">Try changing filters or typing a different search query.</p>
          <button
            onClick={resetFilters}
            className="mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Grid Layout */
        <>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer shadow-sm dark:shadow-none"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer shadow-sm dark:shadow-none"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Events;