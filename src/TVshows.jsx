import { useState, useEffect } from "react";
import { LoaderCircle, ChevronUp, Plus } from "lucide-react";
import ShowCard from "./Components/ShowCard";
import { useAppContext } from "./AppContext"; // Update the import path

function TVshows() {
  const { 
    tvShowsData, 
    fetchTrendingTVshows, 
    loadMoreTVshows, 
    getFilteredTVShows 
  } = useAppContext();

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    if (!tvShowsData.initialized) {
      fetchTrendingTVshows(1, true);
    }
  }, [tvShowsData.initialized]);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 300);
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

  // Get filtered TV shows from context
  const displayTVshows = getFilteredTVShows();

  return (
    <div className="min-h-screen bg-amber-100 relative">
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-black text-white p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </div>
      )}

      {tvShowsData.loading ? (
        <div className="h-screen justify-center items-center flex flex-col sm:flex-row text-2xl sm:text-3xl lg:text-4xl w-full bg-amber-100 opacity-50 px-4 gap-4">
          <div className="text-center">Loading TV-Shows....</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10"></LoaderCircle>
          </div>
        </div>
      ) : (
        <div className="movie container w-screen px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl py-2 flex justify-center items-center font-bold text-violet-600">
              Trending TV-Shows
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Discover the most popular TV-Shows right now
            </p>
          </div>

          {displayTVshows.length === 0 && tvShowsData.initialized ? (
            <div className="text-center p-6 sm:p-8">
              <p className="text-lg sm:text-xl text-gray-600 mb-4">
                No trending TV-Shows available at the moment.
              </p>
              <button
                onClick={() => fetchTrendingTVshows(1, true)}
                className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Refresh TV Shows
              </button>
            </div>
          ) : (
            <div className="pb-8 sm:pb-12">
              {/* Results count */}
              <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-center items-center gap-2">
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  Showing {displayTVshows.length} trending TV-Shows
                </p>
              </div>

              {/* TV Shows Grid */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-8">
                {displayTVshows.map((show) => (
                  <div
                    key={show.id}
                    className="flex-shrink-0 w-full max-w-sm sm:w-auto"
                  >
                    <ShowCard show={show} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {tvShowsData.hasMore && (
                <div className="flex justify-center mt-8 mb-4">
                  <button
                    onClick={loadMoreTVshows}
                    disabled={tvShowsData.loadingMore}
                    className="flex items-center gap-2 bg-violet-500 text-white px-6 py-3 rounded-lg hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
                  >
                    {tvShowsData.loadingMore ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        <span>Loading More...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Load More TV Shows</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* End of results */}
              {!tvShowsData.hasMore && displayTVshows.length > 20 && (
                <div className="text-center mt-8 mb-4">
                  <p className="text-sm sm:text-base text-gray-500">
                    You've reached the end of trending TV shows
                  </p>
                </div>
              )}

              {/* Loading more indicator */}
              {tvShowsData.loadingMore && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2 text-violet-600">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading more TV shows...</span>
                  </div>
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