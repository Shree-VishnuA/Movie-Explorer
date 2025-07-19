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
      className="cursor-pointer w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col h-full"
    >
      {/* Profile Image */}
      <div className="relative flex-shrink-0">
        <img
          src={
            person?.profile_path
              ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
              : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Cpath d='M200 180c-33.137 0-60-26.863-60-60s26.863-60 60-60 60 26.863 60 60-26.863 60-60 60zm0-100c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM300 360H100c-11.046 0-20-8.954-20-20 0-77.32 62.68-140 140-140h60c77.32 0 140 62.68 140 140 0 11.046-8.954 20-20 20z' fill='%23d1d5db'/%3E%3C/svg%3E"
          }
          alt={person?.name || "Person photo"}
          className="w-full h-40 xs:h-48 sm:h-56 md:h-64 lg:h-72 object-contain"
        />

        {/* Gradient Overlay */}
        {hasProfileImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}

        {/* Top Badges */}
        <div className="absolute top-1 sm:top-2 left-1 sm:left-2 right-1 sm:right-2 flex justify-between items-start gap-1">
          {isPopular && (
            <div className="bg-purple-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
              <span className="hidden xs:inline">POPULAR</span>
              <span className="xs:hidden">🔥</span>
            </div>
          )}
          {person?.popularity > 0 && (
            <div className="bg-black/80 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span>{person.popularity.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Gender Badge */}
        <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-white/90 text-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span>
            {person?.gender === 1 ? "👩" : person?.gender === 2 ? "👨" : "👤"}
          </span>
          <span className="hidden sm:inline">
            {getGenderText(person?.gender)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
        {/* Name */}
        <div className="flex-shrink-0 mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-2 leading-tight">
            {person?.name || "Unknown Name"}
          </h3>

          {/* Original Name */}
          {person?.original_name && person.original_name !== person.name && (
            <div className="mb-1 sm:mb-2">
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                <span className="hidden sm:inline">Originally: </span>
                <span className="sm:hidden">Orig: </span>
                <span className="truncate max-w-32 sm:max-w-none inline-block">
                  {person.original_name}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Department */}
        {person?.known_for_department && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3 flex-shrink-0">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1">
              <span>{getDepartmentIcon(person.known_for_department)}</span>
              <span className="hidden xs:inline sm:inline">
                {person.known_for_department}
              </span>
            </span>
          </div>
        )}

        {/* Known For Section */}
        {knownForTitles.length > 0 && (
          <div className="mb-2 sm:mb-3">
            <h4 className="text-xs sm:text-sm text-gray-600 font-semibold mb-1">
              Known For:
            </h4>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-500 space-y-1">
              {knownForTitles.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 flex-shrink-0 mt-auto">
          {person?.popularity > 0 && (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
              <span className="text-red-500">🔥</span>
              <span>{formatPopularity(person.popularity)}</span>
              <span className="hidden sm:inline">popularity</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Person;
