import { Link } from "react-router-dom";
import MatchBadge from "./MatchBadge";

const EventCard = ({ event }) => {
  return (
    <div className="
      bg-white
      rounded-2xl
      shadow-sm
      border
      border-slate-100
      overflow-hidden
      hover:-translate-y-1
      hover:shadow-lg
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
            text-green-700
            text-sm
            px-3
            py-1
            rounded-full
          ">
            {event.category}
          </span>

          <span className="text-sm text-gray-500">
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
        ">
          {event.title}
        </h2>

        <p className="
          text-gray-600
          mt-2
          line-clamp-2
          text-left
        ">
          {event.description}
        </p>

        <p className="
          mt-3
          text-sm
          text-gray-500
          text-left
        ">
          📍 {event.location}
        </p>

        {event.matchScore !== undefined && event.matchedSkills && event.matchedSkills.length > 0 && (
          <div className="mt-3 text-left">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Matched Skills</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {event.matchedSkills.map(skill => (
                <span key={skill} className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-xs px-2.5 py-0.5 rounded-full font-semibold">
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
            font-medium
          ">
            {event.registeredCount}/
            {event.requiredVolunteers}
          </span>

          <Link
            to={`/events/${event._id}`}
            className="
              bg-blue-600
              hover:bg-blue-700
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