import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MovieCard({ movie = {}, apiKey }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);

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

  const getLanguageName = (code) => {
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
    return languageMap[code] || "Unknown";
  };

  // Fetch cast & crew only when modal is opened
  const fetchCredits = async () => {
    if (!movie?.id || !apiKey) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=en-US`
      );
      const data = await res.json();
      // Top 10 cast
      setCast((data.cast || []).slice(0, 10));
      // Filter and categorize crew by specific roles
      const importantCrew = (data.crew || []).filter((person) => {
        return (
          person.job === "Director" ||
          person.job === "Writer" ||
          person.job === "Screenplay" ||
          person.job === "Producer" ||
          person.job === "Original Music Composer"
        );
      });

      // Group by role and apply limits
      const directors = importantCrew.filter((p) => p.job === "Director");
      const producers = importantCrew
        .filter((p) => p.job === "Producer")
        .slice(0, 3);
      const screenplay = importantCrew
        .filter((p) => p.job === "Screenplay")
        .slice(0, 3);
      const writers = importantCrew
        .filter((p) => p.job === "Writer")
        .slice(0, 3);
      const music = importantCrew.filter(
        (p) => p.job === "Original Music Composer"
      );

      // Combine into one array for rendering
      setCrew([
        ...directors,
        ...producers,
        ...screenplay,
        ...writers,
        ...music,
      ]);
    } catch (err) {
      console.error("Error fetching credits:", err);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    if (isModalOpen) fetchCredits();
    return () => (document.body.style.overflow = "auto");
  }, [isModalOpen]);

  const formatPopularity = (popularity) =>
    popularity >= 1000
      ? `${(popularity / 1000).toFixed(1)}K`
      : Math.round(popularity);

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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              layoutId={`movie-card-${movie?.id}`}
              className="fixed z-50 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 w-full max-w-2xl text-gray-100 shadow-2xl overflow-y-auto scrollbar-hide"
              style={{ top: "80px", maxHeight: "calc(100vh - 120px)" }}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              {/* Close Button */}
              <div
                onClick={() => setIsModalOpen(false)}
                className="sticky top-0 flex justify-end text-gray-300 text-2xl hover:text-red-400 cursor-pointer"
              >
                <X />
              </div>

              {/* Poster & Info */}
              <img
                src={`https://image.tmdb.org/t/p/w500${
                  movie?.poster_path || movie?.backdrop_path || ""
                }`}
                alt={movie?.title}
                className="w-full h-64 object-contain rounded-lg mb-4"
              />
              <h2 className="text-3xl font-bold text-orange-400 mb-4">
                {movie?.title}
              </h2>
              <p className="text-gray-300 mb-6">{movie?.overview}</p>

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
               
              </div>

              {/* Cast */}
              {cast.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-orange-300 mb-3">
                    Cast
                  </h3>
                  <div className="flex gap-3 flex-wrap scrollbar-hide">
                    {cast.map((actor) => (
                      <div
                        key={actor.id}
                        className="flex-shrink-0 w-28 text-center"
                      >
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                              : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                          }
                          alt={actor.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto border border-white/20 bg-gray-800"
                        />

                        <p className="text-sm text-white mt-2 font-medium">
                          {actor.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          as {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crew */}
              {crew.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-orange-300 mb-3">
                    Crew
                  </h3>
                  <div className="flex gap-3 flex-wrap scrollbar-hide">
                    {crew.map((member) => (
                      <div
                        key={member.id}
                        className="flex-shrink-0 w-28 text-center"
                      >
                        <img
                          src={
                            member.profile_path
                              ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                              : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                          }
                          alt={member.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto border border-white/20 bg-gray-800"
                        />

                        <p className="text-sm text-white mt-2 font-medium">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-400">{member.job}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MovieCard;
