import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    kn: "Kannada",
    fr: "French",
    es: "Spanish",
    de: "German",
    ja: "Japanese",
    ko: "Korean",
    it: "Italian",
    zh: "Chinese",
    ru: "Russian", 
    pt: "Portuguese",
    nl: "Dutch",
    tr: "Turkish",
    ar: "Arabic",
    pl: "Polish",
    sv: "Swedish",
  };

  return languageMap[languageCode] || "Unknown";
};
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
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
  const isNewRelease =
    movie?.release_date && new Date(movie.release_date) > new Date();

  return (
    <>
      {/* Movie Card */}
      <motion.div
        layoutId={`movie-card-${movie?.id}`}
        className="w-full max-w-xs mx-auto bg-black/40 backdrop-blur-md border border-white/30 rounded-xl shadow-lg hover:shadow-[0_0_15px_#f67c02] transition-all duration-300 cursor-pointer overflow-hidden group scrollbar-hide"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Poster */}
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/w500${
              movie?.poster_path || movie?.backdrop_path || ""
            }`}
            alt={movie?.title}
            className="w-full h-56 object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          {movie?.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ {movie.vote_average.toFixed(1)}
            </div>
          )}
          {isNewRelease && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
              NEW
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded-full">
            🔥 {formatPopularity(movie?.popularity || 0)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 text-gray-100 space-y-3">
          <h3 className="text-[clamp(1rem,1.5vw,1.25rem)] font-bold line-clamp-2 group-hover:text-orange-400 transition-colors">
            {movie?.title || "Unknown Title"}
          </h3>

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

          <p className="text-xs text-gray-400 line-clamp-3">
            {movie?.overview || "No description available."}
          </p>

          <div className="flex justify-between items-center text-xs text-gray-300 pt-2 border-t border-white/10">
            <span>📅 {formatDate(movie?.release_date)}</span>
            <span className="capitalize bg-white/5 px-2 py-1 rounded-lg border border-white/10">
              {movie?.media_type || "Movie"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Modal with animation */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />
            {/* Expanding Modal */}
            <motion.div
              layoutId={`movie-card-${movie?.id}`}
              className="fixed z-50 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/50 rounded-xl p-6 w-full max-w-lg text-gray-100 shadow-2xl overflow-y-auto scrollbar-hide will-change-transform"
              style={{
                top: "80px", // leave space for navbar
                maxHeight: "calc(100vh - 120px)",
                transform: "translate3d(-50%, 0, 0)", // GPU acceleration
              }}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1], // smooth spring-like easing
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.85,
                y: 30,
                transition: {
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1], // smooth ease-in-out on close
                },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div
                onClick={() => setIsModalOpen(false)}
                className="sticky top-0 z-10 flex justify-end pb-2 text-gray-300 text-2xl hover:text-red-400 cursor-pointer"
              >
                <X />
              </div>

              <img
                src={`https://image.tmdb.org/t/p/w500${
                  movie?.poster_path || movie?.backdrop_path || ""
                }`}
                alt={movie?.title}
                className="w-full h-64 object-contain rounded-lg mb-4"
              />

              <h2 className="text-2xl font-bold text-orange-400 mb-3">
                {movie?.title || "Unknown Title"}
              </h2>

              <p className="text-gray-300 mb-4">
                {movie?.overview || "No description available."}
              </p>

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
                <span className="capitalize">
                  {movie?.media_type || "Movie"}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MovieCard;
