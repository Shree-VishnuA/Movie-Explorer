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
  <div
    className="w-full max-w-xs mx-auto bg-black/40 backdrop-blur-md border border-white/30 rounded-xl shadow-lg hover:shadow-[0_0_20px_#00FFFF] transition-all duration-300 hover:scale-[1.03] cursor-pointer overflow-hidden group"
  >
    {/* Poster / Backdrop */}
    <div className="relative">
      <img
        src={`https://image.tmdb.org/t/p/w500${show?.poster_path || show?.backdrop_path || ""}`}
        alt={show?.name || "TV Show poster"}
        className="w-full h-56 object-contain transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      {/* Optional Gradient Overlay */}
      {hasBackdrop && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      )}

      {/* Rating Badge */}
      {show?.vote_average > 0 && (
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          ⭐ {show.vote_average.toFixed(1)}
        </div>
      )}

      {/* New Series Badge */}
      {isNewSeries && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
          NEW
        </div>
      )}

      {/* Popularity */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded-full">
        🔥 {formatPopularity(show?.popularity || 0)}
      </div>
    </div>

    {/* Card Content */}
    <div className="p-4 text-gray-100 space-y-3">
      {/* Title */}
      <h3 className="text-[clamp(1rem,1.5vw,1.25rem)] font-bold line-clamp-2 group-hover:text-red-400 transition-colors">
        {show?.name || "Unknown Title"}
      </h3>

      {/* Original Name */}
      {show?.original_name && show.original_name !== show?.name && (
        <p className="text-xs text-gray-400 italic">
          Original: {show.original_name}
        </p>
      )}

      {/* Genres */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {genres.map((genre, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-white/10 border border-white/20 text-gray-200 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
      )}

      {/* Overview */}
      <p className="text-xs text-gray-400 line-clamp-3">
        {show?.overview || "No description available."}
      </p>

      {/* Stats Row */}
      <div className="flex justify-between items-center text-xs text-gray-300 pt-2 border-t border-white/10">
        {show?.vote_count > 0 && (
          <span>👥 {show.vote_count.toLocaleString()} votes</span>
        )}
        {show?.original_language && show.original_language !== "en" && (
          <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-full">
            {getLanguageName(show.original_language)}
          </span>
        )}
      </div>

      {/* Footer Row */}
      <div className="flex justify-between items-center text-xs text-gray-300">
        <span>📅 {formatDate(show?.first_air_date)}</span>
        {show?.origin_country && show.origin_country.length > 0 && (
          <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
            🌍 {formatOriginCountries(show.origin_country)}
          </span>
        )}
      </div>
    </div>
  </div>
);


}

export default ShowCard;