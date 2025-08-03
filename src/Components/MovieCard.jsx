"use client"

import { useState, useEffect } from "react"
import { X, Play, Star, Calendar, Users, Eye, ThumbsUp, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function MovieCard({ movie = {}, apiKey }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cast, setCast] = useState([])
  const [crew, setCrew] = useState([])
  const [reviews, setReviews] = useState([])
  const [videos, setVideos] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [showFullOverview, setShowFullOverview] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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
    }
    return (
      genreIds
        ?.slice(0, 3)
        .map((id) => genreMap[id])
        .filter(Boolean) || []
    )
  }

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
    }
    return languageMap[code] || "Unknown"
  }

  const fetchAllData = async () => {
    if (!movie?.id || !apiKey) return
    try {
      // Fetch multiple endpoints in parallel
      const [creditsRes, reviewsRes, recommendationsRes, videosRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/reviews?api_key=${apiKey}&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=${apiKey}&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`),
      ])

      const [creditsData, reviewsData, recommendationsData, videosData] = await Promise.all([
        creditsRes.json(),
        reviewsRes.json(),
        recommendationsRes.json(),
        videosRes.json(),
      ])

      setCast((creditsData.cast || []).slice(0, 10))

      const importantCrew = (creditsData.crew || []).filter((person) => {
        return (
          person.job === "Director" ||
          person.job === "Writer" ||
          person.job === "Screenplay" ||
          person.job === "Producer" ||
          person.job === "Original Music Composer"
        )
      })

      const directors = importantCrew.filter((p) => p.job === "Director")
      const producers = importantCrew.filter((p) => p.job === "Producer").slice(0, 3)
      const screenplay = importantCrew.filter((p) => p.job === "Screenplay").slice(0, 3)
      const writers = importantCrew.filter((p) => p.job === "Writer").slice(0, 3)
      const music = importantCrew.filter((p) => p.job === "Original Music Composer")

      setCrew([...directors, ...producers, ...screenplay, ...writers, ...music])
      setReviews((reviewsData.results || []).slice(0, 5))
      setRecommendations((recommendationsData.results || []).slice(0, 6))

      // Get trailers and teasers
      const trailers = (videosData.results || [])
        .filter((video) => video.type === "Trailer" || video.type === "Teaser")
        .slice(0, 3)
      setVideos(trailers)
    } catch (err) {
      console.error("Error fetching details:", err)
    }
  }

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto"
    if (isModalOpen) fetchAllData()
    return () => (document.body.style.overflow = "auto")
  }, [isModalOpen])

  const formatPopularity = (popularity) =>
    popularity >= 1000 ? `${(popularity / 1000).toFixed(1)}K` : Math.round(popularity)

  const formatDate = (dateString) => {
    if (!dateString) return "To Be Announced"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return "Unknown"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-400"
    if (rating >= 6) return "text-yellow-400"
    return "text-red-400"
  }

  const genres = getGenreNames(movie?.genre_ids)
  const isNewRelease = movie?.release_date && new Date(movie.release_date) > new Date()

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      {/* Enhanced Movie Card */}
      <motion.div
        layoutId={`movie-card-${movie?.id}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="w-full max-w-xs mx-auto bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-500 cursor-pointer overflow-hidden group"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Enhanced Poster Section */}
        <div className="relative overflow-hidden">
          <motion.img
            src={`https://image.tmdb.org/t/p/w500${movie?.poster_path || movie?.backdrop_path || ""}`}
            alt={movie?.title}
            className="w-full h-64 object-contain transition-all duration-700 group-hover:scale-110"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-orange-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </motion.div>

          {/* Enhanced Badges */}
          {movie?.vote_average > 0 && (
            <motion.div
              className={`absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 ${getRatingColor(movie.vote_average)}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-3 h-3 fill-current" />
              {movie.vote_average.toFixed(1)}
            </motion.div>
          )}

          {isNewRelease && (
            <motion.div
              className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm px-3 py-1.5 rounded-full font-bold shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              NEW
            </motion.div>
          )}

          <motion.div
            className="absolute bottom-3 right-3 bg-orange-600/80 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-full flex items-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Eye className="w-3 h-3" />
            {formatPopularity(movie?.popularity || 0)}
          </motion.div>
        </div>

        {/* Enhanced Content */}
        <motion.div className="p-5 text-gray-100 space-y-4" variants={itemVariants}>
          <h3 className="text-lg font-bold line-clamp-2 group-hover:text-orange-400 transition-colors duration-300">
            {movie?.title || "Unknown Title"}
          </h3>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, i) => (
                <motion.span
                  key={i}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-200 hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {genre}
                </motion.span>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
            {movie?.overview || "No description available."}
          </p>

          <div className="flex justify-between items-center text-sm text-gray-300 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(movie?.release_date)}</span>
            </div>
            <span className="capitalize bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 text-xs">
              {movie?.media_type || "Movie"}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Responsive Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              layoutId={`movie-card-${movie?.id}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed z-50 inset-0 sm:inset-4 sm:left-1/2 sm:top-27/50 top-18 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border-0 sm:border border-white/30 rounded-none sm:rounded-2xl w-full sm:max-w-4xl h-full sm:max-h-[90vh] text-gray-100 shadow-2xl overflow-hidden"
            >
              {/* Mobile-Optimized Modal Header */}
              <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10 px-3 py-1 sm:p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-2xl font-bold text-white truncate pr-4">{movie?.title}</h2>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 sm:p-2 rounded-full bg-white/10 text-gray-300 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto h-full pb-20 sm:pb-0 sm:max-h-[calc(90vh-80px)] scrollbar-hide">
                {/* Mobile-Optimized Hero Section */}
                <motion.div className="relative h-48 sm:h-80 overflow-hidden" variants={itemVariants}>
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path || movie?.poster_path || ""}`}
                    alt={movie?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Mobile Hero Content */}
                  <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
                    <div className="flex items-end gap-3 sm:gap-6">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie?.poster_path || ""}`}
                        alt={movie?.title}
                        className="w-20 h-28 sm:w-32 sm:h-48 object-cover rounded-lg shadow-2xl border-2 border-white/20 flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                          {movie?.vote_average > 0 && (
                            <div
                              className={`flex items-center gap-1 sm:gap-2 text-sm sm:text-lg font-bold ${getRatingColor(movie.vote_average)}`}
                            >
                              <Star className="w-3 h-3 sm:w-5 sm:h-5 fill-current" />
                              {movie.vote_average.toFixed(1)}
                            </div>
                          )}
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{formatDate(movie?.release_date)}</span>
                            <span className="sm:hidden">{new Date(movie?.release_date).getFullYear()}</span>
                          </div>
                          {movie?.runtime && (
                            <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              {formatRuntime(movie.runtime)}
                            </div>
                          )}
                        </div>

                        {genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {genres.slice(0, 2).map((genre, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white"
                              >
                                {genre}
                              </span>
                            ))}
                            {genres.length > 2 && (
                              <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white">
                                +{genres.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Mobile-Optimized Tab Navigation */}
                <div className="border-b border-white/10 px-3 sm:px-6 py-1 overflow-x-auto">
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 min-w-max">
                    {["overview", "cast", "reviews", "videos"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-1 text-sm font-medium capitalize transition-colors border-b-2 whitespace-nowrap ${
                          activeTab === tab
                            ? "text-orange-400 border-orange-400"
                            : "text-gray-400 border-transparent hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile-Optimized Tab Content */}
                <div className="p-3 sm:p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Overview</h3>
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            {showFullOverview ? movie?.overview : `${movie?.overview?.slice(0, 200)}...`}
                          </p>
                          {movie?.overview?.length > 200 && (
                            <button
                              onClick={() => setShowFullOverview(!showFullOverview)}
                              className="text-orange-400 hover:text-orange-300 text-sm mt-2 transition-colors"
                            >
                              {showFullOverview ? "Show Less" : "Read More"}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-3">
                            <h4 className="text-base sm:text-lg font-semibold text-white">Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Language:</span>
                                <span className="text-white">{getLanguageName(movie?.original_language)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Release:</span>
                                <span className="text-white">{formatDate(movie?.release_date)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Popularity:</span>
                                <span className="text-white">{formatPopularity(movie?.popularity)}</span>
                              </div>
                              {movie?.budget && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Budget:</span>
                                  <span className="text-white text-xs sm:text-sm">
                                    ${movie.budget.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {movie?.revenue && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Revenue:</span>
                                  <span className="text-white text-xs sm:text-sm">
                                    ${movie.revenue.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "cast" && (
                      <motion.div
                        key="cast"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        {cast.length > 0 && (
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Cast</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                              {cast.map((actor) => (
                                <motion.div
                                  key={actor.id}
                                  className="text-center group cursor-pointer"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <img
                                    src={
                                      actor.profile_path
                                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                        : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                                    }
                                    alt={actor.name}
                                    className="w-full aspect-square rounded-lg object-cover border border-white/20 bg-gray-800 group-hover:border-white/40 transition-colors"
                                  />
                                  <p className="text-xs sm:text-sm text-white mt-2 font-medium group-hover:text-orange-400 transition-colors line-clamp-2">
                                    {actor.name}
                                  </p>
                                  <p className="text-xs text-gray-400 line-clamp-2">{actor.character}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {crew.length > 0 && (
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Crew</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                              {crew.map((member) => (
                                <motion.div
                                  key={member.id}
                                  className="text-center group cursor-pointer"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <img
                                    src={
                                      member.profile_path
                                        ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                                        : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                                    }
                                    alt={member.name}
                                    className="w-full aspect-square rounded-lg object-cover border border-white/20 bg-gray-800 group-hover:border-white/40 transition-colors"
                                  />
                                  <p className="text-xs sm:text-sm text-white mt-2 font-medium group-hover:text-orange-400 transition-colors line-clamp-2">
                                    {member.name}
                                  </p>
                                  <p className="text-xs text-gray-400 line-clamp-1">{member.job}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "reviews" && (
                      <motion.div
                        key="reviews"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        <h3 className="text-lg sm:text-xl font-semibold text-white">Reviews</h3>
                        {reviews.length > 0 ? (
                          <div className="space-y-3 sm:space-y-4">
                            {reviews.map((review) => (
                              <motion.div
                                key={review.id}
                                className="p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                  <img
                                    src={
                                      review.author_details.avatar_path
                                        ? `https://image.tmdb.org/t/p/w185${review.author_details.avatar_path}`
                                        : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                                    }
                                    alt={review.author}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-white font-medium truncate">
                                      {review.author}
                                    </p>
                                    {review.author_details.rating && (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                        <span className="text-xs text-gray-400">{review.author_details.rating}/10</span>
                                      </div>
                                    )}
                                  </div>
                                  <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                                </div>
                                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-4">
                                  {review.content}
                                </p>
                                <a
                                  href={review.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-orange-400 mt-2 inline-block hover:text-orange-300 transition-colors"
                                >
                                  Read full review →
                                </a>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8">
                            <p className="text-gray-400 mb-4">No reviews available for this movie.</p>
                            {recommendations.length > 0 && (
                              <div>
                                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                                  You might also like
                                </h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                                  {recommendations.map((rec) => (
                                    <motion.div
                                      key={rec.id}
                                      className="text-center group cursor-pointer"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <img
                                        src={
                                          rec.poster_path
                                            ? `https://image.tmdb.org/t/p/w185${rec.poster_path}`
                                            : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                                        }
                                        alt={rec.title}
                                        className="w-full aspect-[2/3] rounded-lg object-cover border border-white/20 group-hover:border-white/40 transition-colors"
                                      />
                                      <p className="text-xs text-white mt-1 sm:mt-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                                        {rec.title}
                                      </p>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "videos" && (
                      <motion.div
                        key="videos"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        <h3 className="text-lg sm:text-xl font-semibold text-white">Trailers & Videos</h3>
                        {videos.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {videos.map((video) => (
                              <motion.div
                                key={video.id}
                                className="group cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, "_blank")}
                              >
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                                  <img
                                    src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                                    alt={video.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-600/90 rounded-full flex items-center justify-center">
                                      <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-1" />
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs sm:text-sm text-white mt-2 font-medium group-hover:text-orange-400 transition-colors line-clamp-2">
                                  {video.name}
                                </p>
                                <p className="text-xs text-gray-400">{video.type}</p>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8">
                            <p className="text-gray-400">No videos available for this movie.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MovieCard