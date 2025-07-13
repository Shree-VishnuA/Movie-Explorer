import React from "react";

function Person({ person = {} }) {
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

  const hasProfileImage = person?.profile_path;
  const isPopular = person?.popularity > 10;

  return (
    <div className="w-80 max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-101 flex flex-col h-full">
      {/* Profile Image Container */}
      <div className="relative flex-shrink-0">
        <img
          src={`https://image.tmdb.org/t/p/w500${person?.profile_path || ""}`}
          alt={person?.name || "Person photo"}
          className="w-full h-48 sm:h-56 md:h-64 object-contain"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Cpath d='M200 180c-33.137 0-60-26.863-60-60s26.863-60 60-60 60 26.863 60 60-26.863 60-60 60zm0-100c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM300 360H100c-11.046 0-20-8.954-20-20 0-77.32 62.68-140 140-140h60c77.32 0 140 62.68 140 140 0 11.046-8.954 20-20 20z' fill='%23d1d5db'/%3E%3C/svg%3E";
            e.target.className =
              "w-full h-48 sm:h-56 md:h-64 object-cover bg-gray-100";
          }}
        />

        {/* Background Gradient Overlay */}
        {hasProfileImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}

        {/* Top Badge Container */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {/* Popular Badge */}
          {isPopular && (
            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              POPULAR
            </div>
          )}

          {/* Popularity Badge */}
          {person?.popularity > 0 && (
            <div className="bg-black/80 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              {person.popularity.toFixed(1)}
            </div>
          )}
        </div>

        {/* Gender Badge */}
        <div className="absolute bottom-2 right-2 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span>
            {person?.gender === 1 ? "👩" : person?.gender === 2 ? "👨" : "👤"}
          </span>
          <span className="hidden sm:inline">
            {getGenderText(person?.gender)}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="flex-shrink-0 mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
            {person?.name || "Unknown Name"}
          </h3>

          {/* Original Name */}
          {person?.original_name && person.original_name !== person?.name && (
            <div className="mb-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                Originally: {person.original_name}
              </span>
            </div>
          )}
        </div>

        {/* Department Section */}
        {person?.known_for_department && (
          <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1">
              <span>{getDepartmentIcon(person.known_for_department)}</span>
              {person.known_for_department}
            </span>
          </div>
        )}

        {/* Bottom Stats Section */}
        <div className="flex justify-between items-center flex-shrink-0 mt-auto">
          {/* Popularity */}
          {person?.popularity > 0 && (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
              <span className="text-red-500">🔥</span>
              <span>{formatPopularity(person.popularity)} popularity</span>
            </div>
          )}

          {/* Adult Content Badge */}
          {person?.adult === false && (
            <div className="ml-auto">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                <span className="hidden sm:inline">Family </span>
                Safe
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Person;
