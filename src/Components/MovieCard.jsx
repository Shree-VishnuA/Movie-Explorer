import { useState, useEffect } from "react";
import { X } from "lucide-react";

function MovieCard({ movie = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Reset when unmounting
    };
  }, [isModalOpen]);

  const formatPopularity = (popularity) => {
    if (popularity >= 1000) return `${(popularity / 1000).toFixed(1)}K`;
    return Math.round(popularity);
  };

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
    <>
      {/* Glassmorphic Movie Card */}
      <div
        className="w-full max-w-xs mx-auto bg-black/40 backdrop-blur-md border border-white/30 rounded-xl shadow-lg hover:shadow-[0_0_15px_#f67c02] transition-all duration-300 cursor-pointer overflow-hidden group"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Poster Section */}
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/w500${
              movie?.poster_path || movie?.backdrop_path || ""
            }`}
            alt={movie?.title}
            className="w-full h-56 object-contain transition-transform duration-300 group-hover:scale-102"
            loading="lazy"
          />
          {/* Rating Badge */}
          {movie?.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              ⭐ {movie.vote_average.toFixed(1)}
            </div>
          )}
          {/* New Badge */}
          {isNewRelease && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
              NEW
            </div>
          )}
          {/* Popularity Badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded-full">
            🔥 {formatPopularity(movie?.popularity || 0)}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 text-gray-100 space-y-3">
          {/* Title */}
          <h3 className="text-[clamp(1rem,1.5vw,1.25rem)] font-bold line-clamp-2 group-hover:text-orange-400 transition-colors">
            {movie?.title || "Unknown Title"}
          </h3>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((g, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-gray-200"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          <p className="text-xs text-gray-400 line-clamp-3">
            {movie?.overview || "No description available."}
          </p>

          {/* Footer Row */}
          <div className="flex justify-between items-center text-xs text-gray-300 pt-2 border-t border-white/10">
            <span>📅 {formatDate(movie?.release_date)}</span>
            <span className="capitalize bg-white/5 px-2 py-1 rounded-lg border border-white/10">
              {movie?.media_type || "Movie"}
            </span>
          </div>
        </div>
      </div>

      {/* Glassmorphic Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-start z-50 p-4"
          style={{ paddingTop: "80px" }} // offset for navbar (~64-80px space)
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-6 w-full max-w-lg text-gray-100 relative shadow-2xl
                 max-h-[calc(100vh-100px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (Sticky) */}
            <div
              onClick={() => setIsModalOpen(false)}
              className="sticky top-0 z-10 flex justify-end pb-2 bg-gradient-to-b
                   text-gray-300 text-2xl hover:text-red-400 cursor-pointer"
            >
              <X />
            </div>

            {/* Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w500${
                movie?.poster_path || movie?.backdrop_path || ""
              }`}
              alt={movie?.title}
              className="w-full h-64 object-contain rounded-lg mb-4"
            />

            {/* Title */}
            <h2 className="text-2xl font-bold text-orange-400 mb-3">
              {movie?.title || "Unknown Title"}
            </h2>

            {/* Overview */}
            <p className="text-gray-300 mb-4">
              {movie?.overview || "No description available."}
            </p>

            {/* Extra Details */}
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              {movie?.vote_count && (
                <span>👥 {movie.vote_count.toLocaleString()} votes</span>
              )}
              {movie?.original_language && (
                <span>
                  Language: {getLanguageName(movie.original_language)}
                </span>
              )}
              <span>Release: {formatDate(movie?.release_date)}</span>
              <span className="capitalize">{movie?.media_type || "Movie"}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MovieCard;
