import React from "react";

function MovieCard({ movie = {} }) {
  const getGenreNames = (genreIds) => {
    const genreMap = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Sci-Fi",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    return (
      genreIds
        ?.slice(0, 3)
        .map((id) => genreMap[id])
        .filter(Boolean) || []
    );
  };

  const getLanguageName = (languageCode) => {
    const languageMap = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
      hi: "Hindi",
      ar: "Arabic",
      th: "Thai",
      tr: "Turkish",
      pl: "Polish",
      nl: "Dutch",
      sv: "Swedish",
      no: "Norwegian",
      da: "Danish",
      fi: "Finnish",
      he: "Hebrew",
      cs: "Czech",
      hu: "Hungarian",
      ro: "Romanian",
      bg: "Bulgarian",
      hr: "Croatian",
      sk: "Slovak",
      sl: "Slovenian",
      et: "Estonian",
      lv: "Latvian",
      lt: "Lithuanian",
      uk: "Ukrainian",
      be: "Belarusian",
      mk: "Macedonian",
      sr: "Serbian",
      bs: "Bosnian",
      sq: "Albanian",
      mt: "Maltese",
      is: "Icelandic",
      ga: "Irish",
      cy: "Welsh",
      eu: "Basque",
      ca: "Catalan",
      gl: "Galician",
      af: "Afrikaans",
      sw: "Swahili",
      zu: "Zulu",
      xh: "Xhosa",
      am: "Amharic",
      bn: "Bengali",
      gu: "Gujarati",
      kn: "Kannada",
      ml: "Malayalam",
      mr: "Marathi",
      ne: "Nepali",
      or: "Odia",
      pa: "Punjabi",
      si: "Sinhala",
      ta: "Tamil",
      te: "Telugu",
      ur: "Urdu",
      vi: "Vietnamese",
      id: "Indonesian",
      ms: "Malay",
      tl: "Filipino",
      fa: "Persian",
      ku: "Kurdish",
      az: "Azerbaijani",
      ka: "Georgian",
      hy: "Armenian",
      el: "Greek",
      la: "Latin",
      eo: "Esperanto",
    };
    return (
      languageMap[languageCode] || languageCode?.toUpperCase() || "Unknown"
    );
  };

  // function to format popularity
  const formatPopularity = (popularity) => {
    if (popularity >= 1000) return `${(popularity / 1000).toFixed(1)}K`;
    return Math.round(popularity);
  };

  // function to format release date
  const formatDate = (dateString) => {
    if (!dateString) return "To Be Announced";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const genres = getGenreNames(movie?.genre_ids);
  const hasBackdrop = movie?.backdrop_path;
  const isNewRelease =
    movie?.release_date && new Date(movie.release_date) > new Date();

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-101 relative">
      {/* Backdrop/Poster Image  */}
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${
            movie?.poster_path || movie?.backdrop_path || ""
          }`}
          alt={movie?.title || "Movie poster"}
          className="w-full h-64 object-contain"
        />

        {/* Overlay with gradient */}
        {hasBackdrop && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}

        {/* Rating Badge */}
        {movie?.vote_average > 0 && (
          <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* New Release Badge for movies releasing in future */}
        {isNewRelease && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            NEW
          </div>
        )}

        {/* Popularity Indicator */}
        <div className="absolute bottom-3 right-3 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
          🔥 {formatPopularity(movie?.popularity || 0)}
        </div>
      </div>

      {/*Text Content of the movie*/}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
          {movie?.title || "Unknown Title"}
        </h3>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {genres.map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {movie?.overview || "No description available."}
        </p>

        {/* Stats Row */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            {movie?.vote_count > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-blue-500">👥</span>
                {movie.vote_count.toLocaleString()} votes
              </span>
            )}
          </div>
          {/* Language Badge */}
        {movie?.original_language && movie.original_language !== "en" && (
          <div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium uppercase">
              Original Language : {getLanguageName(movie.original_language)}
            </span>
          </div>
        )}
        </div>

        

        {/* Release Date */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Release Date:{formatDate(movie?.release_date)}
          </span>

          {/* Media Type Badge */}
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium capitalize">
            {movie?.media_type || "Movie"}
          </span>
        </div>

        
      </div>
    </div>
  );
}

export default MovieCard;
