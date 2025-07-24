import React from "react";
import { useNavigate } from "react-router-dom";

function Person({ person = {} }) {
  const navigate = useNavigate();

  const getGenderText = (genderCode) => {
    switch (genderCode) {
      case 1:
        return "Female";
      case 2:
        return "Male";
      default:
        return "Not specified";
    }
  };

  const getDepartmentIcon = (department) => {
    const departmentMap = {
      Acting: "🎭",
      Directing: "🎬",
      Writing: "✍️",
      Production: "📽️",
      Sound: "🎵",
      Camera: "📷",
      Editing: "✂️",
      Art: "🎨",
      "Costume & Make-Up": "👗",
      "Visual Effects": "✨",
      Crew: "🔧",
    };
    return departmentMap[department] || "🎪";
  };

  const formatPopularity = (popularity) => {
    if (popularity >= 1000) return `${(popularity / 1000).toFixed(1)}K`;
    return Math.round(popularity);
  };

  const hasProfileImage = !!person?.profile_path;
  const isPopular = person?.popularity > 10;

  // Get "Known For" titles (movies/TV)
  const knownForTitles =
    Array.isArray(person?.known_for) && person.known_for.length > 0
      ? person.known_for
          .map((item) => item.title || item.name || item.original_title || "")
          .filter(Boolean)
          .slice(0, 3) // Limit to 3 titles
      : [];

  return (
  <div
    onClick={() => navigate(`/person/${person.id}`)}
    className="cursor-pointer w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto
               bg-black/30 backdrop-blur-md border border-white/30 rounded-xl shadow-lg
               hover:shadow-[0_0_20px_#FFD700] transition-all duration-300 hover:scale-[1.03]
               flex flex-col h-full overflow-hidden group"
  >
    {/* Profile Image */}
    <div className="relative flex-shrink-0">
      <img
        src={
          person?.profile_path
            ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
            : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23111111'/%3E%3Cpath d='M200 180c-33.137 0-60-26.863-60-60s26.863-60 60-60 60 26.863 60 60-26.863 60-60 60zm0-100c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM300 360H100c-11.046 0-20-8.954-20-20 0-77.32 62.68-140 140-140h60c77.32 0 140 62.68 140 140 0 11.046-8.954 20-20 20z' fill='%23333333'/%3E%3C/svg%3E"
        }
        alt={person?.name || "Person photo"}
        className="w-full h-48 sm:h-64 md:h-72 object-contain transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      {hasProfileImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      )}

      {/* Top Badges */}
      <div className="absolute top-2 px-3 flex justify-between w-full">
        {isPopular && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-3 py-1 rounded-full font-bold shadow-md">
            POPULAR
          </div>
        )}
        {person?.popularity > 0 && (
          <div className="bg-black/70 text-white px-2 py-1 text-xs rounded-full flex items-center gap-1">
            ⭐ {person.popularity.toFixed(1)}
          </div>
        )}
      </div>

      {/* Gender Badge */}
      <div className="absolute bottom-2 right-2 bg-white/10 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 border border-white/20">
        <span>{person?.gender === 1 ? "👩" : person?.gender === 2 ? "👨" : "👤"}</span>
        <span className="hidden sm:inline">{getGenderText(person?.gender)}</span>
      </div>
    </div>

    {/* Card Body */}
    <div className="p-4 flex flex-col flex-grow text-gray-100 space-y-3">
      {/* Name */}
      <h3 className="text-[clamp(1rem,1.5vw,1.25rem)] font-bold line-clamp-2 group-hover:text-yellow-400 transition-colors">
        {person?.name || "Unknown Name"}
      </h3>

      {/* Original Name */}
      {person?.original_name && person.original_name !== person.name && (
        <span className="px-2 py-1 bg-white/10 border border-white/20 text-xs rounded-full text-gray-300">
          Originally: {person.original_name}
        </span>
      )}

      {/* Department */}
      {person?.known_for_department && (
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-white/10 border border-white/20 text-gray-300 text-xs rounded-full flex items-center gap-1">
            <span>{getDepartmentIcon(person.known_for_department)}</span>
            {person.known_for_department}
          </span>
        </div>
      )}

      {/* Known For Section */}
      {knownForTitles.length > 0 && (
        <div>
          <h4 className="text-xs text-gray-400 font-semibold mb-1">Known For:</h4>
          <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
            {knownForTitles.map((title, idx) => (
              <li key={idx}>{title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Popularity Footer */}
      {person?.popularity > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto border-t border-white/10 pt-2">
          🔥 {formatPopularity(person.popularity)}
          <span className="hidden sm:inline">popularity</span>
        </div>
      )}
    </div>
  </div>
);

}

export default Person;
