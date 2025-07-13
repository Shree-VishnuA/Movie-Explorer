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

  async function fetchTrendingPeople(page = 1, isInitialLoad = false) {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/person/day?language=en-US&api_key=${api_key}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (isInitialLoad) {
        setPeople(data.results || []);
        setTotalPages(data.total_pages || 0);
        setCurrentPage(1);
        setHasMore(data.total_pages > 1);
      } else {
        // Load more
        setPeople((prevPeople) => {
          const newPeople = data.results || [];
          // Avoiding repetitions
          const uniqueNewPeople = newPeople.filter(
            (newPerson) =>
              !prevPeople.some(
                (existingPerson) => existingPerson.id === newPerson.id
              )
          );
          return [...prevPeople, ...uniqueNewPeople];
        });
        setCurrentPage(page);
        setHasMore(page < (data.total_pages || 0));
      }

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching people:", error);
      if (isInitialLoad) {
        setPeople([]);
      }
      setLoading(false);
      setLoadingMore(false);
      setHasMore(false);
    }
  }

  // Load more people
  function loadMorePeople() {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      fetchTrendingPeople(nextPage, false);
    }
  }

  // Scroll to top function
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Filter people
  const displayPeople = people
    .filter((person) => person.popularity > 0)
    .filter((person) => person.profile_path);

  return (
    <div className="min-h-screen bg-amber-100">
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-black text-white rounded-full shadow-lg p-3 hover:bg-violet-600 transition-all duration-300 transform hover:scale-105 z-50 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </div>
      )}

      {loading ? (
        <div className="h-screen justify-center items-center flex flex-col sm:flex-row text-2xl sm:text-3xl lg:text-4xl w-full bg-amber-100 opacity-50 px-4 gap-4">
          <div className="text-center">Loading People....</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10"></LoaderCircle>
          </div>
        </div>
      ) : (
        <div className="people container w-screen px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex justify-center items-center py-2 font-bold text-violet-600">
              Trending People
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Discover the most popular people in entertainment right now
            </p>
          </div>

          {displayPeople.length === 0 ? (
            <div className="text-center p-6 sm:p-8">
              <p className="text-lg sm:text-xl text-gray-600 mb-4">
                No trending people available at the moment.
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
                  Showing {displayPeople.length} trending people
                </p>
              </div>

              {/* People Section */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-8">
                {displayPeople.map((person) => (
                  <div
                    key={person.id}
                    className="flex-shrink-0 w-full max-w-sm sm:w-auto"
                  >
                    <Person person={person} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8 mb-4">
                  <button
                    onClick={loadMorePeople}
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
                        <span>Load More People</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* End of results */}
              {!hasMore && displayPeople.length > 20 && (
                <div className="text-center mt-8 mb-4">
                  <p className="text-sm sm:text-base text-gray-500">
                    You've reached the end of trending people
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

export default People;