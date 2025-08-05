"use client"

import { useState, useEffect } from "react"
import { X, Play, Star, Calendar, Users, Eye, ThumbsUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function ShowCard({ show = {}, apiKey }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cast, setCast] = useState([])
  const [crew, setCrew] = useState([])
  const [reviews, setReviews] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [videos, setVideos] = useState([])
  const [showFullOverview, setShowFullOverview] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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
    }
    return (
      genreIds
        ?.slice(0, 3)
        .map((id) => genreMap[id])
        .filter(Boolean) || []
    )
  }

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
    }
    return languageMap[languageCode] || "Unknown"
  }

  const fetchAllData = async () => {
    if (!show?.id || !apiKey) return
    try {
      // Fetch multiple endpoints in parallel
      const [creditsRes, reviewsRes, recommendationsRes, videosRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/tv/${show.id}/credits?api_key=${apiKey}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/tv/${show.id}/reviews?api_key=${apiKey}&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/tv/${show.id}/recommendations?api_key=${apiKey}&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/tv/${show.id}/videos?api_key=${apiKey}&language=en-US`),
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
      setCrew(importantCrew.slice(0, 6))

      setReviews((reviewsData.results || []).slice(0, 5))
      setRecommendations((recommendationsData.results || []).slice(0, 6))

      // Get trailers and teasers
      const trailers = (videosData.results || [])
        .filter((video) => video.type === "Trailer" || video.type === "Teaser")
        .slice(0, 3)
      setVideos(trailers)
    } catch (err) {
      console.error("Error fetching data:", err)
    }
  }

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto"
    if (isModalOpen) fetchAllData()
    return () => (document.body.style.overflow = "auto")
  }, [isModalOpen])

  const formatPopularity = (popularity) => {
    if (popularity >= 1000) return `${(popularity / 1000).toFixed(1)}K`
    return Math.round(popularity)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "To Be Announced"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-400"
    if (rating >= 6) return "text-yellow-400"
    return "text-red-400"
  }

  const genres = getGenreNames(show?.genre_ids)
  const isNewRelease = show?.first_air_date && new Date(show.first_air_date) > new Date()

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
      {/* Enhanced Show Card - Mobile Optimized */}
      <motion.div
        layoutId={`show-card-${show?.id}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="w-full max-w-xs sm:max-w-sm mx-auto bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-500 cursor-pointer overflow-hidden group"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Enhanced Poster Section - Mobile Optimized */}
        <div className="relative overflow-hidden">
          <motion.img
            src={`https://image.tmdb.org/t/p/w500${show?.poster_path || show?.backdrop_path || ""}`}
            alt={show?.name}
            className="w-full h-48 sm:h-56 md:h-64 object-contain transition-all duration-700 group-hover:scale-110"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Button Overlay - Mobile Optimized */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
              <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-1" />
            </div>
          </motion.div>

          {/* Enhanced Badges - Mobile Optimized */}
          {show?.vote_average > 0 && (
            <motion.div
              className={`absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 ${getRatingColor(show.vote_average)}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              {show.vote_average.toFixed(1)}
            </motion.div>
          )}

          {isNewRelease && (
            <motion.div
              className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-bold shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              NEW
            </motion.div>
          )}

          <motion.div
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-blue-600/80 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-full flex items-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {formatPopularity(show?.popularity || 0)}
          </motion.div>
        </div>

        {/* Enhanced Content - Mobile Optimized */}
        <motion.div className="p-3 sm:p-4 md:p-5 text-gray-100 space-y-2 sm:space-y-3 md:space-y-4" variants={itemVariants}>
          <h3 className="text-sm sm:text-base md:text-lg font-bold line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
            {show?.name || "Unknown Show"}
          </h3>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {genres.slice(0, 3).map((genre, i) => (
                <motion.span
                  key={i}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-200 hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {genre}
                </motion.span>
              ))}
            </div>
          )}

          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {show?.overview || "No description available."}
          </p>

          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-300 pt-2 sm:pt-3 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{formatDate(show?.first_air_date)}</span>
            </div>
            <span className="capitalize bg-white/10 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-white/10 text-xs">
              {show?.media_type || "TV Show"}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Modal - Mobile Optimized */}
      <motion.div>
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
              layoutId={`show-card-${show?.id}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed z-50 inset-x-2 sm:inset-x-4 md:left-1/2 md:-translate-x-1/2 top-15 md:top-27/50 md:-translate-y-1/2 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/30 rounded-xl sm:rounded-2xl w-auto md:max-w-4xl h-[calc(100vh-2rem)] md:max-h-[90vh] text-gray-100 shadow-2xl overflow-hidden"
            >
              {/* Modal Header - Mobile Optimized */}
              <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-xl border-b border-white/10 p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate pr-2">{show?.name}</h2>
                  <div className="flex items-center flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsModalOpen(false)}
                      className="p-1.5 sm:p-2 rounded-full bg-white/10 text-gray-300 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Modal Content - Mobile Optimized */}
              <div className="overflow-y-auto h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] scrollbar-hide">
                {/* Hero Section - Mobile Optimized */}
                <motion.div className="relative h-48 sm:h-64 md:h-80 overflow-hidden" variants={itemVariants}>
                  <img
                    src={`https://image.tmdb.org/t/p/original${show?.backdrop_path || show?.poster_path || ""}`}
                    alt={show?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Hero Content - Mobile Optimized */}
                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6">
                    <div className="flex items-end gap-3 sm:gap-4 md:gap-6">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${show?.poster_path || ""}`}
                        alt={show?.name}
                        className="w-20 h-30 sm:w-24 sm:h-36 md:w-32 md:h-48 object-cover rounded-lg shadow-2xl border-2 border-white/20 flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                          {show?.vote_average > 0 && (
                            <div
                              className={`flex items-center gap-1 sm:gap-2 text-sm sm:text-base md:text-lg font-bold ${getRatingColor(show.vote_average)}`}
                            >
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-current" />
                              {show.vote_average.toFixed(1)}
                            </div>
                          )}
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {formatDate(show?.first_air_date)}
                          </div>
                          <div className="hidden sm:flex items-center gap-2 text-gray-300 text-sm">
                            <Users className="w-4 h-4" />
                            {show?.vote_count?.toLocaleString()} votes
                          </div>
                        </div>

                        {genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {genres.slice(0, window.innerWidth < 640 ? 2 : 4).map((genre, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tab Navigation - Mobile Optimized */}
                <div className="border-b border-white/10 px-3 sm:px-4 md:px-6 overflow-x-auto">
                  <div className="flex justify-center py-1 gap-4 sm:gap-6 min-w-max sm:min-w-0">
                    {["overview", "cast", "reviews", "videos"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium capitalize transition-colors border-b-2 whitespace-nowrap ${
                          activeTab === tab
                            ? "text-blue-400 border-blue-400"
                            : "text-gray-400 border-transparent hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content - Mobile Optimized */}
                <div className="p-3 sm:p-4 md:p-6">
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
                            {showFullOverview ? show?.overview : `${show?.overview?.slice(0, 250)}...`}
                          </p>
                          {show?.overview?.length > 250 && (
                            <button
                              onClick={() => setShowFullOverview(!showFullOverview)}
                              className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors"
                            >
                              {showFullOverview ? "Show Less" : "Read More"}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2 sm:space-y-3">
                            <h4 className="text-base sm:text-lg font-semibold text-white">Details</h4>
                            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Language:</span>
                                <span className="text-white">{getLanguageName(show?.original_language)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">First Air Date:</span>
                                <span className="text-white">{formatDate(show?.first_air_date)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Popularity:</span>
                                <span className="text-white">{formatPopularity(show?.popularity)}</span>
                              </div>
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
                                  <p className="text-xs sm:text-sm text-white mt-1 sm:mt-2 font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {actor.name}
                                  </p>
                                  <p className="text-xs text-gray-400 line-clamp-1">{actor.character}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {crew.length > 0 && (
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Crew</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
                                  <p className="text-xs sm:text-sm text-white mt-1 sm:mt-2 font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
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
                                    <p className="text-xs sm:text-sm text-white font-medium truncate">{review.author}</p>
                                    {review.author_details.rating && (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-current" />
                                        <span className="text-xs text-gray-400">{review.author_details.rating}/10</span>
                                      </div>
                                    )}
                                  </div>
                                  <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-green-400 cursor-pointer transition-colors flex-shrink-0" />
                                </div>
                                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-4">{review.content}</p>
                                <a
                                  href={review.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-400 mt-2 inline-block hover:text-blue-300 transition-colors"
                                >
                                  Read full review →
                                </a>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8">
                            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">No reviews available for this show.</p>
                            {recommendations.length > 0 && (
                              <div>
                                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">You might also like</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
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
                                        alt={rec.name}
                                        className="w-full aspect-[2/3] rounded-lg object-cover border border-white/20 group-hover:border-white/40 transition-colors"
                                      />
                                      <p className="text-xs text-white mt-1 sm:mt-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                        {rec.name}
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
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600/90 rounded-full flex items-center justify-center">
                                      <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-1" />
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs sm:text-sm text-white mt-2 font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                                  {video.name}
                                </p>
                                <p className="text-xs text-gray-400">{video.type}</p>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8">
                            <p className="text-gray-400 text-sm sm:text-base">No videos available for this show.</p>
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
      </motion.div>
    </>
  )
}

export default ShowCard