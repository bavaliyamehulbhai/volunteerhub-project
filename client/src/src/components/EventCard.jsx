import { Link } from "react-router-dom";
import MatchBadge from "./MatchBadge";

const EventCard = ({ event }) => {
  return (
    <div className="
      bg-white
      dark:bg-slate-900/60
      backdrop-blur-md
      rounded-2xl
      shadow-sm
      dark:shadow-none
      border
      border-slate-100
      dark:border-slate-800
      overflow-hidden
      hover:-translate-y-1
      hover:shadow-lg
      dark:hover:shadow-indigo-900/20
      transition-all
      duration-300
    ">

      <img
        src={
          event.image ||
          "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
        }
        alt={event.title}
        className="
          w-full
          h-48
          object-cover
        "
      />

      <div className="p-5">

        <div className="
          flex
          justify-between
          items-center
        ">

          <span className="
            bg-green-100
            dark:bg-emerald-900/30
            text-green-700
            dark:text-emerald-400
            text-sm
            px-3
            py-1
            rounded-full
          ">
            {event.category}
          </span>

          <span className="text-sm text-gray-500 dark:text-slate-400 transition-colors">
            {new Date(
              event.eventDate
            ).toLocaleDateString()}
          </span>

        </div>

        {event.matchScore !== undefined && (
          <div className="flex flex-wrap items-center gap-2 mt-3 text-left">
            <MatchBadge score={event.matchScore} />
            {event.matchScore >= 70 && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                Recommended
              </span>
            )}
          </div>
        )}

        <h2 className="
          text-xl
          font-bold
          mt-4
          text-left
          text-slate-800
          dark:text-slate-100
          transition-colors
        ">
          {event.title}
        </h2>

        <p className="
          text-gray-600
          dark:text-slate-400
          mt-2
          line-clamp-2
          text-left
          transition-colors
        ">
          {event.description}
        </p>

        <p className="
          mt-3
          text-sm
          text-gray-500
          dark:text-slate-500
          text-left
          transition-colors
        ">
          📍 {event.location}
        </p>

        {event.matchScore !== undefined && event.matchedSkills && event.matchedSkills.length > 0 && (
          <div className="mt-3 text-left">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block transition-colors">Matched Skills</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {event.matchedSkills.map(skill => (
                <span key={skill} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/30 text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="
          flex
          justify-between
          items-center
          mt-5
        ">

          <span className="
            text-blue-600
            dark:text-indigo-400
            font-medium
            transition-colors
          ">
            {event.registeredCount}/
            {event.requiredVolunteers}
          </span>

          <Link
            to={`/events/${event._id}`}
            className="
              bg-blue-600
              hover:bg-blue-700
              dark:bg-indigo-600
              dark:hover:bg-indigo-500
              text-white
              px-4
              py-2
              rounded-lg
              transition-colors
              duration-200
            "
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
};

export default EventCard;