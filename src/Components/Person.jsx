import { useState, useEffect } from "react"
import { X, Star, Calendar, Users, Eye, MapPin, Briefcase, Film, Tv, Award, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function Person({ person = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [personDetails, setPersonDetails] = useState({})
  const [movieCredits, setMovieCredits] = useState([])
  const [tvCredits, setTvCredits] = useState([])
  const [images, setImages] = useState([])
  const [showFullBiography, setShowFullBiography] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)

  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  const fetchPersonData = async () => {
    if (!person?.id || !apiKey) return
    setLoading(true)
    
    try {
      const [detailsRes, movieCreditsRes, tvCreditsRes, imagesRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/person/${person.id}?api_key=${apiKey}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/person/${person.id}/movie_credits?api_key=${apiKey}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/person/${person.id}/tv_credits?api_key=${apiKey}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/person/${person.id}/images?api_key=${apiKey}`)
      ])

      const [detailsData, movieCreditsData, tvCreditsData, imagesData] = await Promise.all([
        detailsRes.json(),
        movieCreditsRes.json(),
        tvCreditsRes.json(),
        imagesRes.json()
      ])

      setPersonDetails(detailsData)
      
      // Sort and limit movie credits by popularity
      const sortedMovies = (movieCreditsData.cast || [])
        .filter(movie => movie.poster_path && movie.vote_average > 0)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 12)
      setMovieCredits(sortedMovies)

      // Sort and limit TV credits by popularity
      const sortedTv = (tvCreditsData.cast || [])
        .filter(show => show.poster_path && show.vote_average > 0)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 12)
      setTvCredits(sortedTv)

      setImages((imagesData.profiles || []).slice(0, 8))
    } catch (err) {
      console.error("Error fetching person data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto"
    if (isModalOpen) fetchPersonData()
    return () => (document.body.style.overflow = "auto")
  }, [isModalOpen])

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const getKnownFor = () => {
    return person?.known_for?.slice(0, 3) || []
  }

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
      {/* Person Card - Mobile Optimized */}
      <motion.div
        layoutId={`person-card-${person?.id}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="w-full max-w-xs sm:max-w-sm mx-auto bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-[0_0_30px_rgba(255,193,7,0.3)] transition-all duration-500 cursor-pointer overflow-hidden group"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Profile Image Section */}
        <div className="relative overflow-hidden">
          <motion.img
            src={`https://image.tmdb.org/t/p/w500${person?.profile_path || ""}`}
            alt={person?.name}
            className="w-full h-48 sm:h-56 md:h-64 object-contain transition-all duration-700 group-hover:scale-110"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Popularity Badge */}
          {person?.popularity > 0 && (
            <motion.div
              className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 backdrop-blur-sm text-[#FFC107] px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              {Math.round(person.popularity)}
            </motion.div>
          )}

          {/* Gender Badge */}
          <motion.div
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-blue-600/80 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {person?.gender === 1 ? "Female" : person?.gender === 2 ? "Male" : "Other"}
          </motion.div>
        </div>

        {/* Content Section */}
        <motion.div className="p-3 sm:p-4 md:p-5 text-gray-100 space-y-2 sm:space-y-3 md:space-y-4" variants={itemVariants}>
          <h3 className="text-sm sm:text-base md:text-lg font-bold line-clamp-2 group-hover:text-[#FFC107] transition-colors duration-300">
            {person?.name || "Unknown Person"}
          </h3>

          <p className="text-xs sm:text-sm text-gray-400 font-medium">
            {person?.known_for_department || "Actor"}
          </p>

          {/* Known For */}
          {getKnownFor().length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Known For:</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {getKnownFor().map((item, i) => (
                  <motion.span
                    key={i}
                    className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-gray-200 hover:bg-white/20 transition-colors line-clamp-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item?.title || item?.name}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-300 pt-2 sm:pt-3 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Popularity: {Math.round(person?.popularity || 0)}</span>
            </div>
            <span className="capitalize bg-white/10 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-white/10 text-xs">
              {person?.known_for_department || "Actor"}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Modal */}
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
              layoutId={`person-card-${person?.id}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed z-50 inset-x-2 sm:inset-x-4 md:left-1/2 md:-translate-x-1/2 top-4 md:top-1/2 md:-translate-y-1/2 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/30 rounded-xl sm:rounded-2xl w-auto md:max-w-4xl h-[calc(100vh-2rem)] md:max-h-[90vh] text-gray-100 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-xl border-b border-white/10 p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate pr-2">{person?.name}</h2>
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

              {/* Modal Content */}
              <div className="overflow-y-auto h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] scrollbar-hide">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#FFC107] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {/* Hero Section */}
                    <motion.div className="relative h-48 sm:h-64 md:h-80 overflow-hidden" variants={itemVariants}>
                      <img
                        src={`https://image.tmdb.org/t/p/original${images[0]?.file_path || person?.profile_path || ""}`}
                        alt={person?.name}
                        className="w-full h-full object-contain "
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                      {/* Hero Content */}
                      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6">
                        <div className="flex items-end gap-3 sm:gap-4 md:gap-6">
                          <img
                            src={`https://image.tmdb.org/t/p/w300${person?.profile_path || ""}`}
                            alt={person?.name}
                            className="w-20 h-30 sm:w-24 sm:h-36 md:w-32 md:h-48 object-cover rounded-lg shadow-2xl border-2 border-white/20 flex-shrink-0"
                          />
                          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                              <div className="flex items-center gap-1 sm:gap-2 text-[#FFC107] text-sm sm:text-base md:text-lg font-bold">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-current" />
                                {Math.round(person?.popularity || 0)}
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                                {personDetails?.known_for_department || "Actor"}
                              </div>
                              {personDetails?.birthday && (
                                <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Age {calculateAge(personDetails.birthday)}
                                </div>
                              )}
                            </div>

                            {personDetails?.place_of_birth && (
                              <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate">{personDetails.place_of_birth}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Tab Navigation */}
                    <div className="border-b border-white/10 px-3 sm:px-4 md:px-6 overflow-x-auto">
                      <div className="flex justify-center py-1 gap-4 sm:gap-6 min-w-max sm:min-w-0">
                        {["overview", "movies", "tv", "photos"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium capitalize transition-colors border-b-2 whitespace-nowrap ${
                              activeTab === tab
                                ? "text-[#FFC107] border-[#FFC107]"
                                : "text-gray-400 border-transparent hover:text-white"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab Content */}
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
                            {personDetails?.biography && (
                              <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Biography</h3>
                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                                  {showFullBiography 
                                    ? personDetails.biography 
                                    : `${personDetails.biography?.slice(0, 300)}...`
                                  }
                                </p>
                                {personDetails.biography?.length > 300 && (
                                  <button
                                    onClick={() => setShowFullBiography(!showFullBiography)}
                                    className="text-[#FFC107] hover:text-yellow-300 text-sm mt-2 transition-colors"
                                  >
                                    {showFullBiography ? "Show Less" : "Read More"}
                                  </button>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                              <div className="space-y-2 sm:space-y-3">
                                <h4 className="text-base sm:text-lg font-semibold text-white">Personal Info</h4>
                                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Born:</span>
                                    <span className="text-white">{formatDate(personDetails?.birthday)}</span>
                                  </div>
                                  {personDetails?.place_of_birth && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Place of Birth:</span>
                                      <span className="text-white text-right flex-1 ml-2">{personDetails.place_of_birth}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Known For:</span>
                                    <span className="text-white">{personDetails?.known_for_department}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Popularity:</span>
                                    <span className="text-white">{Math.round(personDetails?.popularity || 0)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === "movies" && (
                          <motion.div
                            key="movies"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4 sm:space-y-6"
                          >
                            <h3 className="text-lg sm:text-xl font-semibold text-white">Movies</h3>
                            {movieCredits.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                                {movieCredits.map((movie) => (
                                  <motion.div
                                    key={movie.id}
                                    className="text-center group cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <img
                                      src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                      alt={movie.title}
                                      className="w-full aspect-[2/3] rounded-lg object-cover border border-white/20 group-hover:border-white/40 transition-colors"
                                    />
                                    <p className="text-xs sm:text-sm text-white mt-1 sm:mt-2 font-medium group-hover:text-[#FFC107] transition-colors line-clamp-2">
                                      {movie.title}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"}
                                    </p>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 sm:py-8">
                                <p className="text-gray-400 text-sm sm:text-base">No movie credits available.</p>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {activeTab === "tv" && (
                          <motion.div
                            key="tv"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4 sm:space-y-6"
                          >
                            <h3 className="text-lg sm:text-xl font-semibold text-white">TV Shows</h3>
                            {tvCredits.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                                {tvCredits.map((show) => (
                                  <motion.div
                                    key={show.id}
                                    className="text-center group cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <img
                                      src={`https://image.tmdb.org/t/p/w185${show.poster_path}`}
                                      alt={show.name}
                                      className="w-full aspect-[2/3] rounded-lg object-cover border border-white/20 group-hover:border-white/40 transition-colors"
                                    />
                                    <p className="text-xs sm:text-sm text-white mt-1 sm:mt-2 font-medium group-hover:text-[#FFC107] transition-colors line-clamp-2">
                                      {show.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {show.first_air_date ? new Date(show.first_air_date).getFullYear() : "TBA"}
                                    </p>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 sm:py-8">
                                <p className="text-gray-400 text-sm sm:text-base">No TV show credits available.</p>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {activeTab === "photos" && (
                          <motion.div
                            key="photos"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4 sm:space-y-6"
                          >
                            <h3 className="text-lg sm:text-xl font-semibold text-white">Photos</h3>
                            {images.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                {images.map((image, index) => (
                                  <motion.div
                                    key={index}
                                    className="group cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <img
                                      src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                                      alt={`${person?.name} photo ${index + 1}`}
                                      className="w-full aspect-[2/3] rounded-lg object-cover border border-white/20 group-hover:border-white/40 transition-colors"
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 sm:py-8">
                                <p className="text-gray-400 text-sm sm:text-base">No photos available.</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Person