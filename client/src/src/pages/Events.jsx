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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Events</h1>
          <p className="text-slate-500 mt-1">Browse and search available volunteer opportunities.</p>
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
        <div className="mb-4 text-left text-gray-500 text-sm font-medium">
          Found {events.length} events
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
              <div className="animate-pulse h-48 bg-slate-200 rounded-xl w-full"></div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="animate-pulse h-6 bg-slate-200 rounded-full w-24"></div>
                  <div className="animate-pulse h-4 bg-slate-200 rounded w-16"></div>
                </div>
                <div className="animate-pulse h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="animate-pulse h-4 bg-slate-200 rounded w-full"></div>
                <div className="animate-pulse h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="animate-pulse h-5 bg-slate-200 rounded w-12"></div>
                  <div className="animate-pulse h-8 bg-slate-200 rounded-lg w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Empty Search State */
        <div className="text-center py-20 bg-white border border-slate-200/80 rounded-2xl p-10 shadow-sm max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-slate-800">No Matching Events</h2>
          <p className="text-slate-500 mt-2">Try changing filters or typing a different search query.</p>
          <button
            onClick={resetFilters}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow transition-all duration-200 active:scale-[0.98] cursor-pointer"
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
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
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