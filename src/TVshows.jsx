import { useState, useEffect, useMemo } from "react";
import { LoaderCircle, ChevronUp, ChevronDown, Plus, Filter, X } from "lucide-react";
import ShowCard from "./Components/ShowCard";
import { useAppContext } from "./AppContext";

function TVshows() {
  const {
    tvShowsData,
    fetchTrendingTVshows,
    loadMoreTVshows,
    getFilteredTVShows,
    applyTVShowFilters,
    resetTVShowFilters,
    tvShowFilters,
    handleTVShowFilterChange,
  } = useAppContext();

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToDown, setShowScrollToDown] = useState(false);
  const [isPersonalizerSelected, setisPersonalizerSelected] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    if (!tvShowsData.initialized) {
      fetchTrendingTVshows(1, true);
    }
  }, [tvShowsData.initialized, fetchTrendingTVshows]);

  // Handle scroll to show/hide scroll buttons
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Show scroll to top button after scrolling down 200px on mobile, 300px on desktop
      const scrollThreshold = window.innerWidth < 768 ? 200 : 300;
      setShowScrollToTop(scrollTop > scrollThreshold);

      // Show scroll to bottom button when not at the bottom and there's content below
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollToDown(scrollTop > 100 && !isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Scroll to bottom function
  function scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  function showFilters() {
    setisPersonalizerSelected((prev) => !prev);
  }

  // Get filtered TV shows from context - memoized for performance
  const displayTVshows = useMemo(() => getFilteredTVShows(), [getFilteredTVShows]);

  return (
    <div className="min-h-screen bg-amber-100 relative">
      {/* Scroll to Top Button - Enhanced responsive positioning */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 bg-black text-white p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </button>
      )}

      {/* Scroll to Bottom Button - Enhanced responsive positioning */}
      {showScrollToDown && (
        <button
          onClick={scrollToBottom}
          className="fixed top-16 right-4 sm:top-20 sm:right-6 md:top-24 md:right-8 bg-black text-white p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </button>
      )}

      {/* Loading State - Enhanced responsive design */}
      {tvShowsData.loading ? (
        <div className="h-screen justify-center items-center flex flex-col w-full bg-amber-100 opacity-50 px-4 gap-3 sm:gap-4 md:gap-5">
          <div className="text-center font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            Loading TV-Shows....
          </div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" />
          </div>
        </div>
      ) : (
        <div className="movie container w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 max-w-7xl mx-auto">
          {/* Header Section - Enhanced responsive typography */}
          <div className="py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl py-2 flex justify-center items-center font-bold text-violet-600 text-center leading-tight">
              Trending TV-Shows
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 text-center mt-2 sm:mt-3 md:mt-4 px-2 sm:px-4 md:px-6">
              Discover the most popular TV shows right now
            </p>
          </div>

          {displayTVshows.length === 0 && tvShowsData.initialized ? (
            <div className="text-center p-4 sm:p-6 md:p-8 lg:p-10">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6 md:mb-8 px-4">
                No trending TV-Shows available at the moment.
              </p>
              <button
                onClick={() => fetchTrendingTVshows(1, true)}
                className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm sm:text-base md:text-lg font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Refresh TV Shows
              </button>
            </div>
          ) : (
            <div className="pb-6 sm:pb-8 md:pb-12 lg:pb-16">
              {/* Results count - Enhanced responsive design */}
              <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col items-center">
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 text-center px-4">
                  Showing {displayTVshows.length} trending TV-Shows
                </p>
              </div>

              {/* Personalizer Toggle - Enhanced responsive design */}
              <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 px-4">
                <button
                  onClick={showFilters}
                  className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg text-white font-medium text-sm sm:text-base md:text-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 ${
                    isPersonalizerSelected 
                      ? "bg-gray-500 hover:bg-gray-600 focus:ring-gray-500" 
                      : "bg-violet-600 hover:bg-violet-700 focus:ring-violet-500"
                  }`}
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <span className="whitespace-nowrap">
                    {isPersonalizerSelected ? "Hide Filters" : "Show Filters"}
                  </span>
                </button>
              </div>

              {/* Filter Section - Completely responsive */}
              {isPersonalizerSelected && (
                <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8 border border-gray-200 mx-1 sm:mx-2 md:mx-4 lg:mx-0">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                      Filter TV Shows
                    </h3>
                    <button
                      onClick={showFilters}
                      className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      aria-label="Close filters"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 hover:text-red-600" />
                    </button>
                  </div>

                  {/* Filter Grid - Enhanced responsive grid system */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-6 md:mb-8">
                    {/* Genre Filter */}
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                        Genre
                      </label>
                      <select
                        value={tvShowFilters.genre}
                        onChange={(e) =>
                          handleTVShowFilterChange("genre", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                        aria-label="Filter by genre"
                      >
                        <option value="">All Genres</option>
                        <option value="10759">Action & Adventure</option>
                        <option value="16">Animation</option>
                        <option value="35">Comedy</option>
                        <option value="80">Crime</option>
                        <option value="18">Drama</option>
                        <option value="10751">Family</option>
                        <option value="9648">Mystery</option>
                        <option value="10765">Sci-Fi & Fantasy</option>
                      </select>
                    </div>

                    {/* Year Filter */}
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                        First Air Date Year
                      </label>
                      <select
                        value={tvShowFilters.year}
                        onChange={(e) =>
                          handleTVShowFilterChange("year", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                        aria-label="Filter by year"
                      >
                        <option value="">All Years</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                        <option value="1999">1999</option>
                      </select>
                    </div>

                    {/* Rating Filter */}
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                        Minimum Rating
                      </label>
                      <select
                        value={tvShowFilters.rating}
                        onChange={(e) =>
                          handleTVShowFilterChange("rating", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                        aria-label="Filter by rating"
                      >
                        <option value="">Any Rating</option>
                        <option value="9">9.0+ Outstanding</option>
                        <option value="8.5">8.5+ Excellent</option>
                        <option value="8">8.0+ Very Good</option>
                        <option value="7.5">7.5+ Good</option>
                        <option value="7">7.0+ Above Average</option>
                        <option value="6">6.0+ Average</option>
                      </select>
                    </div>

                    {/* Language Filter */}
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                        Language
                      </label>
                      <select
                        value={tvShowFilters.language || ""}
                        onChange={(e) =>
                          handleTVShowFilterChange("language", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                        aria-label="Filter by language"
                      >
                        <option value="">All Languages</option>
                        <option value="en">English</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>

                    {/* Country Filter */}
                    <div className="w-full">
                      <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                        Country
                      </label>
                      <select
                        value={tvShowFilters.country || ""}
                        onChange={(e) =>
                          handleTVShowFilterChange("country", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                        aria-label="Filter by country"
                      >
                        <option value="">All Countries</option>
                        <option value="US">United States</option>
                        <option value="JP">Japan</option>
                        <option value="KR">South Korea</option>
                        <option value="CN">China</option>
                      </select>
                    </div>

                    {/* Sort By Filter */}
                    <div className="w-full sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 2xl:col-span-6">
                      <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                        Sort By
                      </label>
                      <select
                        value={tvShowFilters.sortBy}
                        onChange={(e) =>
                          handleTVShowFilterChange("sortBy", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                        aria-label="Sort by"
                      >
                        <option value="popularity.desc">Popularity (High to Low)</option>
                        <option value="popularity.asc">Popularity (Low to High)</option>
                        <option value="first_air_date.desc">First Air Date (Newest)</option>
                        <option value="first_air_date.asc">First Air Date (Oldest)</option>
                        <option value="vote_average.desc">Rating (High to Low)</option>
                        <option value="vote_average.asc">Rating (Low to High)</option>
                        <option value="name.asc">Name (A to Z)</option>
                        <option value="name.desc">Name (Z to A)</option>
                        <option value="vote_count.desc">Most Voted</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Action Buttons - Enhanced responsive design */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start">
                    <button
                      onClick={() => {
                        applyTVShowFilters();
                        setisPersonalizerSelected(false);
                      }}
                      className="bg-violet-600 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-md hover:bg-violet-700 transition-all duration-300 font-medium text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transform hover:scale-105"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={() => {
                        resetTVShowFilters();
                        setisPersonalizerSelected(false);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-md hover:bg-gray-600 transition-all duration-300 font-medium text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}

              {/* TV Shows Grid - Enhanced responsive grid system */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6  px-1 sm:px-2 md:px-0">
                {displayTVshows.map((show) => (
                  <div
                    key={show.id}
                    className="w-full flex justify-center"
                  >
                    <ShowCard show={show} />
                  </div>
                ))}
              </div>

              {/* Load More Button - Enhanced responsive design */}
              {tvShowsData.hasMore && (
                <div className="flex justify-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-4 px-4">
                  <button
                    onClick={loadMoreTVshows}
                    disabled={tvShowsData.loadingMore}
                    className="flex items-center justify-center gap-2 sm:gap-3 bg-violet-500 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base md:text-lg font-medium shadow-md hover:shadow-lg w-full sm:w-auto max-w-xs sm:max-w-sm md:max-w-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
                  >
                    {tvShowsData.loadingMore ? (
                      <>
                        <LoaderCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin" />
                        <span>Loading More...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        <span>Load More TV Shows</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* End of results - Enhanced responsive design */}
              {!tvShowsData.hasMore && displayTVshows.length > 20 && (
                <div className="text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-4 px-4">
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500">
                    You've reached the end of trending TV shows
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TVshows;