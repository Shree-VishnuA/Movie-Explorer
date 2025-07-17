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
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm 2xl:max-w-md mx-auto h-full bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative group">
      {/* Backdrop Image Container - Enhanced responsive sizing */}
      <div className="relative overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w500${
            movie?.poster_path || movie?.backdrop_path || ""
          }`}
          alt={movie?.title || "Movie poster"}
          className="w-full h-40 xs:h-44 sm:h-48 md:h-56 lg:h-44 xl:h-52 2xl:h-60 object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Background with gradient - Enhanced for better text readability */}
        {hasBackdrop && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        )}

        {/* Rating Badge - Enhanced responsive design */}
        {movie?.vote_average > 0 && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/90 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 shadow-lg">
            <span className="text-yellow-400">⭐</span>
            <span className="font-mono">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* New Release Badge - Enhanced styling */}
        {isNewRelease && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
            NEW
          </div>
        )}

        {/* Popularity Badge - Enhanced responsive design */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/95 backdrop-blur-sm text-gray-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
          <span className="text-orange-500">🔥</span> {formatPopularity(movie?.popularity || 0)}
        </div>
      </div>
      
      {/* Content Container - Enhanced responsive padding */}
      <div className="p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5 space-y-3 sm:space-y-4">
        {/* Title - Enhanced responsive typography */}
        <h3 className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl font-bold text-gray-800 line-clamp-2 leading-tight hover:text-blue-600 transition-colors duration-200">
          {movie?.title || "Unknown Title"}
        </h3>

        {/* Genres - Enhanced responsive layout */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {genres.map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs sm:text-sm rounded-full font-medium border border-blue-200 hover:bg-blue-200 transition-colors duration-200"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Overview - Enhanced responsive text */}
        <p className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base text-gray-600 line-clamp-3 leading-relaxed">
          {movie?.overview || "No description available."}
        </p>

        {/* Stats Row - Enhanced responsive layout */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 xs:gap-1">
          {/* Vote Count */}
          {movie?.vote_count > 0 && (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
              <span className="text-blue-500">👥</span>
              <span className="font-medium">{movie.vote_count.toLocaleString()} votes</span>
            </div>
          )}
          
          {/* Language Badge - Enhanced responsive design */}
          {movie?.original_language && movie.original_language !== "en" && (
            <div className="flex-shrink-0">
              <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-green-50 to-green-100 text-green-700 text-xs sm:text-sm rounded-full font-medium border border-green-200 hover:bg-green-200 transition-colors duration-200">
                <span className="hidden sm:inline">Lang: </span>
                {getLanguageName(movie.original_language)}
              </span>
            </div>
          )}
        </div>

        {/* Release Date and Media Type - Enhanced responsive layout */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 pt-2 border-t border-gray-100">
          <div className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1">
            <span className="text-gray-500">📅</span>
            <span className="hidden sm:inline">Release: </span>
            <span className="font-semibold">{formatDate(movie?.release_date)}</span>
          </div>

          {/* Media Type Badge - Enhanced styling */}
          <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-xs sm:text-sm rounded-full font-medium capitalize border border-gray-200 hover:bg-gray-200 transition-colors duration-200 self-start xs:self-auto">
            {movie?.media_type || "Movie"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;