import { useState, useEffect, useMemo } from "react";
import {
  LoaderCircle,
  ChevronUp,
  ChevronDown,
  Plus,
  Filter,
  X,
  Search,
  RotateCcw,
} from "lucide-react";
import ShowCard from "./Components/ShowCard";
import { useAppContext } from "./AppContext";


const FullScreenLoader = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="relative w-16 h-16 sm:w-24 sm:h-24">
      <div className="absolute inset-0 rounded-full border-4 sm:border-6 border-t-[#f67c02] border-b-[#00FFFF] border-l-transparent border-r-transparent animate-spin-slow"></div>
      <div className="absolute inset-4 sm:inset-6 bg-[#f67c02] rounded-full animate-pulse-glow"></div>
    </div>
  </div>
);

function TVshows() {
  const {
    tvShowsData,
    fetchTrendingTVshows,
    loadMoreTVshows,
    getFilteredTVShows,
    applyTVShowFilters,
    resetTVShowFilters,
    tvShowFilters,
  } = useAppContext();

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToDown, setShowScrollToDown] = useState(false);
  const [isPersonalizerSelected, setisPersonalizerSelected] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;


  // Filter states
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    country: "",
    sortBy: "none",
  });

  useEffect(() => {
    if (!tvShowsData.initialized) {
      fetchTrendingTVshows(1, true);
    }
  }, [tvShowsData.initialized, fetchTrendingTVshows]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
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
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });

  const displayTVshows = useMemo(
    () => getFilteredTVShows(),
    [getFilteredTVShows]
  );

  // Handler to close filters
  const hideFilters = () => {
    setisPersonalizerSelected(false);
  };

  // Handler for filter changes - using the context function
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler for applying filters
  const applyFilters = () => {
    applyTVShowFilters(filters);
  };

  // Handler for resetting filters
  const resetFilters = () => {
    setFilters({
      genre: "",
      year: "",
      rating: "",
      country: "",
      sortBy: "none",
    });
    resetTVShowFilters(); // resets in context too
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] relative text-white">
      {/* Scroll Buttons */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-2 right-2 sm:bottom-2 sm:right-2 bg-[#1A1A1F] text-[#00FFFF] p-3 rounded-full shadow-md hover:bg-[#00FFFF] hover:text-white transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
        >
          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}
      {showScrollToDown && (
        <div
          onClick={scrollToBottom}
          className="fixed top-18 sm:top-18 right-2 sm:right-2 bg-[#1A1A1F] text-[#00FFFF] p-3 rounded-full shadow-md hover:bg-[#00FFFF] hover:text-white transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
        >
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}

      {/* Loading */}
      {tvShowsData.loading ? (
        <FullScreenLoader />
      ) : (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Title */}
          <div className="py-6">
            <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-[#00FFFF] text-center">
              Trending TV Shows
            </h1>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-center items-center">
            <p className="text-[clamp(0.85rem,1.5vw,1.1rem)] text-[#B3B3B3] text-center">
              Showing {displayTVshows.length} trending TV-shows
            </p>
          </div>

          {/* Filters Toggle */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div
              onClick={() => setisPersonalizerSelected(!isPersonalizerSelected)}
              className={`cursor-pointer px-5 py-3 rounded-lg font-semibold flex items-center gap-2 text-[clamp(0.85rem,1.5vw,1.1rem)] transition-all duration-200 ${
                isPersonalizerSelected
                  ? "bg-[#333] hover:bg-[#444] text-white"
                  : "bg-[#00FFFF] text-black hover:bg-[#00CED1]"
              }`}
            >
              <Filter className="h-4 w-4" />
              {isPersonalizerSelected ? "Hide Filters" : "Show Filters"}
            </div>
          </div>

          {/* Filters Section */}
          {isPersonalizerSelected && (
            <div className="bg-[#1A1A1F] rounded-lg shadow-lg p-5 sm:p-6 mb-8 border border-[#333] mx-auto max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[clamp(1rem,2vw,1.25rem)] font-semibold text-white">
                  Filter TV Shows
                </h3>
                <div
                  onClick={hideFilters}
                  className="text-[#B3B3B3] hover:text-white cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {/* Genre Filter */}
                <div className="space-y-2">
                  <label className="block text-[clamp(0.8rem,1.5vw,1rem)] font-medium text-[#00FFFF]">
                    Genre
                  </label>
                  <select
                    value={filters.genre || ""}
                    onChange={(e) =>
                      handleFilterChange("genre", e.target.value)
                    }
                    className="w-full p-3 border border-[#333] rounded-md bg-[#0D0D0F] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF] text-[clamp(0.8rem,1.5vw,1rem)]"
                  >
                    <option value="">All Genres</option>
                    <option value="18">Drama</option>
                    <option value="35">Comedy</option>
                    <option value="10759">Action & Adventure</option>
                    <option value="16">Animation</option>
                    <option value="99">Documentary</option>
                    <option value="9648">Mystery</option>
                    <option value="10765">Sci-Fi & Fantasy</option>
                    <option value="80">Crime</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="block text-[clamp(0.8rem,1.5vw,1rem)] font-medium text-[#00FFFF]">
                    First Air Year
                  </label>
                  <select
                    value={filters.year || ""}
                    onChange={(e) => handleFilterChange("year", e.target.value)}
                    className="w-full p-3 border border-[#333] rounded-md bg-[#0D0D0F] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF] text-[clamp(0.8rem,1.5vw,1rem)]"
                  >
                    <option value="">All Years</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>

                {/* Country Filter */}
                <div className="space-y-2">
                  <label className="block text-[clamp(0.8rem,1.5vw,1rem)] font-medium text-[#00FFFF]">
                    Origin Country
                  </label>
                  <select
                    value={filters.country || ""}
                    onChange={(e) =>
                      handleFilterChange("country", e.target.value)
                    }
                    className="w-full p-3 border border-[#333] rounded-md bg-[#0D0D0F] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF] text-[clamp(0.8rem,1.5vw,1rem)]"
                  >
                    <option value="">All Countries</option>
                    <option value="US">United States</option>
                    <option value="TR">Turkey</option>
                    <option value="GB">United Kingdom</option>
                    <option value="KR">South Korea</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>

                {/* Sort By Filter */}
                <div className="space-y-2">
                  <label className="block text-[clamp(0.8rem,1.5vw,1rem)] font-medium text-[#00FFFF]">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy || "none"}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full p-3 border border-[#333] rounded-md bg-[#0D0D0F] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF] text-[clamp(0.8rem,1.5vw,1rem)]"
                  >
                    <option value="none">None (Default API Order)</option>
                    <option value="popularity.desc">
                      Popularity (High to Low)
                    </option>
                    <option value="popularity.asc">
                      Popularity (Low to High)
                    </option>
                    <option value="first_air_date.desc">
                      First Air Date (Newest)
                    </option>
                    <option value="first_air_date.asc">
                      First Air Date (Oldest)
                    </option>
                    <option value="vote_average.desc">
                      Rating (High to Low)
                    </option>
                    <option value="vote_average.asc">
                      Rating (Low to High)
                    </option>
                    <option value="vote_count.desc">
                      Vote Count (High to Low)
                    </option>
                    <option value="vote_count.asc">
                      Vote Count (Low to High)
                    </option>
                    <option value="name.asc">Name (A to Z)</option>
                    <option value="name.desc">Name (Z to A)</option>
                  </select>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div
                  onClick={applyFilters}
                  className="bg-[#333] text-white px-6 py-3 rounded-md hover:bg-[#444] transition-all flex items-center justify-center gap-2 text-[clamp(0.85rem,1.5vw,1.1rem)] font-medium hover:cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  Apply Filters
                </div>
                <div
                  onClick={resetFilters}
                  className="bg-[#333] text-white px-6 py-3 rounded-md hover:bg-[#444] transition-all flex items-center justify-center gap-2 text-[clamp(0.85rem,1.5vw,1.1rem)] font-medium hover:cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Filters
                </div>
              </div>
            </div>
          )}

          {/* TV Shows Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-1 sm:px-2 md:px-0">
            {displayTVshows.map((show) => (
              <div key={show.id} className="flex justify-center w-full">
                <ShowCard show={show} apiKey={apiKey}/>
              </div>
            ))}
          </div>

          {/* Load More */}
          {tvShowsData.hasMore && (
            <div className="flex justify-center mt-8 mb-4">
              <div
                onClick={loadMoreTVshows}
                disabled={tvShowsData.loadingMore}
                className="flex items-center gap-2 bg-[#00FFFF] text-black px-6 py-3 rounded-lg hover:bg-[#00CED1] disabled:bg-[#555] disabled:cursor-not-allowed transition-all text-[clamp(0.85rem,1.5vw,1.1rem)] font-medium shadow-md hover:shadow-lg hover:cursor-pointer"
              >
                {tvShowsData.loadingMore ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin text-[#f67c02]" />
                    Loading More...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Load More TV Shows
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TVshows;
