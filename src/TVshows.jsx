import { useState, useEffect } from "react";
import { LoaderCircle, ArrowLeft, ChevronUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShowCard from "./Components/ShowCard";

function TVshows() {
  const [TVshows, setTVshows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const apikey = import.meta.env.VITE_TMDB_API_KEY;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingTVshows(1, true);
  }, []);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function fetchTrendingTVshows(page = 1, isInitialLoad = false) {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/tv/day?api_key=${apikey}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (isInitialLoad) {
        // First load for replacing 
        setTVshows(data.results || []);
        setTotalPages(data.total_pages || 0);
        setCurrentPage(1);
        setHasMore(data.total_pages > 1);
      } else {
        // Load more
        setTVshows(prevShows => {
          const newShows = data.results || [];
          // Remove any duplicates
          const uniqueNewShows = newShows.filter(
            newShow => !prevShows.some(existingShow => existingShow.id === newShow.id)
          );
          return [...prevShows, ...uniqueNewShows];
        });
        setCurrentPage(page);
        setHasMore(page < (data.total_pages || 0));
      }
      
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching TV-shows:", error);
      if (isInitialLoad) {
        setTVshows([]);
      }
      setLoading(false);
      setLoadingMore(false);
      setHasMore(false);
    }
  }

  // Load more TV shows
  function loadMoreTVshows() {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      fetchTrendingTVshows(nextPage, false);
    }
  }

  // Go back to landing page
  function goBackToLanding() {
    navigate("/");
  }

  // Scroll to top function
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Filter TV shows 
  const displayTVshows = TVshows
    .filter((show) => show.vote_count > 0)
    .filter((show) => show.poster_path || show.backdrop_path);

  return (
    <div className="min-h-screen bg-amber-100">
      {/* back to home */}
      <button
        onClick={goBackToLanding}
        className="fixed top-25 left-3 z-50 flex items-center gap-2 bg-gray-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base shadow-lg"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Home</span>
      </button>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-black text-white p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {loading ? (
        <div className="h-screen justify-center items-center flex flex-col sm:flex-row text-2xl sm:text-3xl lg:text-4xl w-full bg-amber-100 opacity-50 px-4 gap-4">
          <div className="text-center">Loading TV-Shows....</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10"></LoaderCircle>
          </div>
        </div>
      ) : (
        <div className="movie container w-screen px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex justify-center items-center  font-bold text-violet-600">
              Trending TV-Shows
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Discover the most popular TV-Shows right now
            </p>
          </div>

          {displayTVshows.length === 0 ? (
            <div className="text-center p-6 sm:p-8">
              <p className="text-lg sm:text-xl text-gray-600 mb-4">
                No trending TV-Shows available at the moment.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Refresh Page
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

              {/* TV Shows */}
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
              {hasMore && (
                <div className="flex justify-center mt-8 mb-4">
                  <button
                    onClick={loadMoreTVshows}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-violet-500 text-white px-6 py-3 rounded-lg hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
                  >
                    {loadingMore ? (
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
              {!hasMore && displayTVshows.length > 20 && (
                <div className="text-center mt-8 mb-4">
                  <p className="text-sm sm:text-base text-gray-500">
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