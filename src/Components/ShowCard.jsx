import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ShowCard({ show = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getGenreNames = (genreIds) => {
    const genreMap = {
      10759: "Action & Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      10762: "Kids",
      9648: "Mystery",
      10763: "News",
      10764: "Reality",
      10765: "Sci-Fi & Fantasy",
      10766: "Soap",
      10767: "Talk",
      10768: "War & Politics",
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

  const genres = getGenreNames(show?.genre_ids);
  const isNewRelease =
    show?.first_air_date && new Date(show.first_air_date) > new Date();

  return (
    <>
      {/* Show Card */}
      <motion.div
        layoutId={`show-card-${show?.id}`}
        className="w-full max-w-xs mx-auto bg-black/40 backdrop-blur-md border border-white/30 rounded-xl shadow-lg hover:shadow-[0_0_15px_#f67c02] transition-all duration-300 cursor-pointer overflow-hidden group scrollbar-hide"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Poster */}
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/w500${
              show?.poster_path || show?.backdrop_path || ""
            }`}
            alt={show?.name}
            className="w-full h-56 object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {show?.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ {show.vote_average.toFixed(1)}
            </div>
          )}
          {isNewRelease && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
              NEW
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded-full">
            🔥 {formatPopularity(show?.popularity || 0)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 text-gray-100 space-y-3">
          <h3 className="text-[clamp(1rem,1.5vw,1.25rem)] font-bold line-clamp-2 group-hover:text-orange-400 transition-colors">
            {show?.name || "Unknown Show"}
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
            {show?.overview || "No description available."}
          </p>

          <div className="flex relative bottom-0 justify-between items-center text-xs text-gray-300 pt-2 border-t border-white/10">
            <span>📅 {formatDate(show?.first_air_date)}</span>
            <span className="capitalize bg-white/5 px-2 py-1 rounded-lg border border-white/10">
              {show?.media_type || "TV Show"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              layoutId={`show-card-${show?.id}`}
              className="fixed z-50 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/50 rounded-xl p-6 w-full max-w-lg text-gray-100 shadow-2xl overflow-y-auto scrollbar-hide will-change-transform"
              style={{
                top: "80px",
                maxHeight: "calc(100vh - 120px)",
                transform: "translate3d(-50%, 0, 0)",
              }}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.85,
                y: 30,
                transition: {
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => setIsModalOpen(false)}
                className="sticky top-0 z-10 flex justify-end pb-2 text-gray-300 text-2xl hover:text-red-400 cursor-pointer"
              >
                <X />
              </div>

              <img
                src={`https://image.tmdb.org/t/p/w500${
                  show?.poster_path || show?.backdrop_path || ""
                }`}
                alt={show?.name}
                className="w-full h-64 object-contain rounded-lg mb-4"
              />

              <h2 className="text-2xl font-bold text-orange-400 mb-3">
                {show?.name || "Unknown Show"}
              </h2>

              <p className="text-gray-300 mb-4">
                {show?.overview || "No description available."}
              </p>

              <div className="flex flex-col gap-2 text-sm text-gray-400">
                {show?.vote_count && (
                  <span>👥 {show.vote_count.toLocaleString()} votes</span>
                )}
                {show?.original_language && (
                  <span className="">
                    Language: {getLanguageName(show.original_language)}
                  </span>
                )}
                <span>First Air: {formatDate(show?.first_air_date)}</span>
                <span className="capitalize">
                  {show?.media_type || "TV Show"}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ShowCard;
