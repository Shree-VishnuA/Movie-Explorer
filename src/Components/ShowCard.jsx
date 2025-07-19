function ShowCard({ show = {} }) {
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
      10759: "Action & Adventure",
      10762: "Kids",
      10763: "News",
      10764: "Reality",
      10765: "Sci-Fi & Fantasy",
      10766: "Soap",
      10767: "Talk",
      10768: "War & Politics",
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

  // function to format air date
  const formatDate = (dateString) => {
    if (!dateString) return "To Be Announced";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // function to format origin countries
  const formatOriginCountries = (countries) => {
    if (!countries || countries.length === 0) return "";
    return countries.join(", ");
  };

  const genres = getGenreNames(show?.genre_ids);
  const hasBackdrop = show?.backdrop_path;
  const isNewSeries =
    show?.first_air_date && new Date(show.first_air_date) > new Date();

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm 2xl:max-w-md mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative group">
      {/* Backdrop Image  */}
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${
            show?.poster_path || show?.backdrop_path || ""
          }`}
          alt={show?.name || "TV Show poster"}
          className="w-full h-48 sm:h-56 md:h-64 lg:h-56 xl:h-64 object-contain"
        />

        {/* Background with gradient */}
        {hasBackdrop && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}

        {/* Rating Badge */}
        {show?.vote_average > 0 && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            {show.vote_average.toFixed(1)}
          </div>
        )}

        {/* New Series Badge */}
        {isNewSeries && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            NEW
          </div>
        )}

        {/* Popularity  */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
          🔥 {formatPopularity(show?.popularity || 0)}
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
          {show?.name || "Unknown Title"}
        </h3>

        {/* Original Name (if different from main name) */}
        {show?.original_name && show?.original_name !== show?.name && (
          <p className="text-xs text-gray-500 mb-2 italic">
            Original: {show.original_name}
          </p>
        )}

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
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
        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {show?.overview || "No description available."}
        </p>

        {/* Stats Row */}
        <div className="mb-3 flex justify-between items-start">
          {show?.vote_count > 0 && (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mb-2">
              <span className="text-blue-500">👥</span>
              <span>{show.vote_count.toLocaleString()} votes</span>
            </div>
          )}
          
          {/* Language Badge */}
          {show?.original_language && show.original_language !== "en" && (
            <div className="mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                <span className="hidden sm:inline">Language: </span>
                {getLanguageName(show.original_language)}
              </span>
            </div>
          )}
        </div>

        {/* First Air Date and Origin Countries */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
          <div className="text-xs sm:text-sm font-medium text-gray-700">
            <span className="hidden sm:inline">First Air Date: </span>
            <span className="sm:hidden">📅 </span>
            {formatDate(show?.first_air_date)}
          </div>

          {/* Origin Countries */}
          {show?.origin_country && show.origin_country.length > 0 && (
            <div className="text-xs text-gray-500">
              <span className="hidden sm:inline">Origin: </span>
              <span className="sm:hidden">🌍 </span>
              {formatOriginCountries(show.origin_country)}
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}

export default ShowCard;