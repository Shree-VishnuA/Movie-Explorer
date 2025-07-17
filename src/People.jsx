import Person from "./Components/Person";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Plus, ChevronUp } from "lucide-react";

function People() {
  const api_key = import.meta.env.VITE_TMDB_API_KEY;
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingPeople(1, true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function fetchTrendingPeople(page = 1, isInitialLoad = false) {
    if (isInitialLoad) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/person/day?language=en-US&api_key=${api_key}&page=${page}`
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (isInitialLoad) {
        setPeople(data.results || []);
        setTotalPages(data.total_pages || 0);
        setCurrentPage(1);
        setHasMore(data.total_pages > 1);
      } else {
        const newPeople = data.results || [];
        const uniqueNewPeople = newPeople.filter(
          (newPerson) => !people.some((existing) => existing.id === newPerson.id)
        );
        setPeople((prev) => [...prev, ...uniqueNewPeople]);
        setCurrentPage(page);
        setHasMore(page < (data.total_pages || 0));
      }

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching people:", error);
      if (isInitialLoad) setPeople([]);
      setLoading(false);
      setLoadingMore(false);
      setHasMore(false);
    }
  }

  function loadMorePeople() {
    if (!loadingMore && hasMore) fetchTrendingPeople(currentPage + 1, false);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const displayPeople = people.filter((p) => p.popularity > 0 && p.profile_path);

  return (
    <div className="min-h-screen bg-white text-gray-800 relative">
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-black text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      )}

      {loading ? (
        <div className="h-screen flex justify-center items-center flex-col bg-amber-100 opacity-70 px-4">
          <div className="mb-4 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium">
            Loading People...
          </div>
          <LoaderCircle className="animate-spin w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-violet-500" />
        </div>
      ) : (
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="py-6 sm:py-8 md:py-10">
            <h1 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-violet-700 mb-2 sm:mb-3 md:mb-4">
              Trending People
            </h1>
            <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 px-4 sm:px-6 md:px-8">
              Discover the most popular people in entertainment right now
            </p>
          </div>

          {displayPeople.length === 0 ? (
            <div className="text-center py-8 sm:py-12 md:py-16 px-4">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6">
                No trending people available at the moment.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Refresh Page
              </button>
            </div>
          ) : (
            <div className="pb-12 sm:pb-16 md:pb-20">
              {/* Results Counter */}
              <div className="text-center mb-4 sm:mb-6 md:mb-8 text-gray-600 text-xs sm:text-sm md:text-base">
                Showing {displayPeople.length} trending people
              </div>

              {/* People Grid - Enhanced Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {displayPeople.map((person) => (
                  <div key={person.id} className="w-full">
                    <Person person={person} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8 sm:mt-10 md:mt-12 px-4">
                  <button
                    onClick={loadMorePeople}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-violet-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed transition-all duration-300 text-xs sm:text-sm md:text-base lg:text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                  >
                    {loadingMore ? (
                      <>
                        <LoaderCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin" />
                        <span className="hidden xs:inline">Loading More...</span>
                        <span className="xs:hidden">Loading...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        <span className="hidden xs:inline">Load More People</span>
                        <span className="xs:hidden">Load More</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* End Message */}
              {!hasMore && displayPeople.length > 20 && (
                <div className="text-center mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm md:text-base text-gray-500 px-4">
                  You've reached the end of trending people
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default People;