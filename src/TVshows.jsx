import { useState, useEffect, useMemo } from "react";
import {
  LoaderCircle,
  ChevronUp,
  ChevronDown,
  Plus,
  Filter,
  X,
} from "lucide-react";
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
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    if (!tvShowsData.initialized) {
      fetchTrendingTVshows(1, true);
    }
  }, [tvShowsData.initialized, fetchTrendingTVshows]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      setShowScrollToTop(scrollTop > 300);
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollToDown(scrollTop > 100 && !isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  const displayTVshows = useMemo(() => getFilteredTVShows(), [getFilteredTVShows]);

  return (
    <div className="min-h-screen bg-amber-100 relative">
      {/* Scroll Buttons */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-2 right-2 sm:bottom-2 sm:right-2 bg-black text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50"
        >
          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}
      {showScrollToDown && (
        <div
          onClick={scrollToBottom}
          className="fixed top-18 sm:top-20 right-2 sm:right-3 bg-black text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
        >
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}

      {/* Loading */}
      {tvShowsData.loading ? (
        <div className="h-screen justify-center items-center flex flex-col text-xl sm:text-2xl md:text-3xl lg:text-4xl w-full bg-amber-100 opacity-50 px-4 gap-4">
          <div className="text-center">Loading TV Shows...</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="py-4 sm:py-6 md:py-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl py-2 flex justify-center items-center font-bold text-violet-600 text-center">
              Trending TV Shows
            </h1>
          </div>

          {/* Results count - Responsive text */}
              <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center items-center">
                <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center">
                  Showing {displayTVshows.length} trending TV-shows
                </p>
              </div>

          {/* Filters Toggle */}
          <div className="flex justify-center">
            <div className="mb-4 sm:mb-6 flex justify-center sm:justify-start">
            <button
              onClick={() => setisPersonalizerSelected(!isPersonalizerSelected)}
              className={`cursor-pointer px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 text-sm sm:text-base ${
                isPersonalizerSelected
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
            >
              <Filter className="h-4 w-4" />
              {isPersonalizerSelected ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
          </div>

          {/* Filters Section */}
          {isPersonalizerSelected && (
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 mx-auto max-w-6xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Filter TV Shows
                </h3>
                <button
                  onClick={() => setisPersonalizerSelected(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <select
                  value={tvShowFilters.genre}
                  onChange={(e) => handleTVShowFilterChange("genre", e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
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

                <select
                  value={tvShowFilters.year}
                  onChange={(e) => handleTVShowFilterChange("year", e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">All Years</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>

                <select
                  value={tvShowFilters.rating}
                  onChange={(e) => handleTVShowFilterChange("rating", e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Any Rating</option>
                  <option value="9">9+ Outstanding</option>
                  <option value="8">8+ Very Good</option>
                  <option value="7">7+ Good</option>
                </select>

                <select
                  value={tvShowFilters.language}
                  onChange={(e) => handleTVShowFilterChange("language", e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">All Languages</option>
                  <option value="en">English</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                <button
                  onClick={() => {
                    applyTVShowFilters();
                    setisPersonalizerSelected(false);
                  }}
                  className="bg-violet-600 text-white px-6 py-2 sm:py-3 rounded-md hover:bg-violet-700 transition-colors font-medium text-sm sm:text-base flex items-center justify-center"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    resetTVShowFilters();
                    setisPersonalizerSelected(false);
                  }}
                  className="bg-gray-500 text-white px-6 py-2 sm:py-3 rounded-md hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base flex items-center justify-center"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* TV Shows Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-1 sm:px-2 md:px-0">
            {displayTVshows.map((show) => (
              <div key={show.id} className="flex justify-center w-full">
                <ShowCard show={show} />
              </div>
            ))}
          </div>

          {/* Load More */}
          {tvShowsData.hasMore && (
            <div className="flex justify-center mt-6 sm:mt-8 mb-4">
              <button
                onClick={loadMoreTVshows}
                disabled={tvShowsData.loadingMore}
                className="flex items-center gap-2 bg-violet-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
              >
                {tvShowsData.loadingMore ? (
                  <>
                    <LoaderCircle className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Loading More...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    Load More TV Shows
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TVshows;
