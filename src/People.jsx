import Person from "./Components/Person";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Plus, ChevronUp, ChevronDown } from "lucide-react";

function People() {
  const api_key = import.meta.env.VITE_TMDB_API_KEY;
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToDown, setShowScrollToDown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingPeople(1, true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      setShowScrollToTop(scrollTop > 300);
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollToDown(scrollTop >= 0 && !isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function fetchTrendingPeople(page = 1, isInitialLoad = false) {
    if (isInitialLoad) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/person/day?language=en-US&api_key=${api_key}&page=${page}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (isInitialLoad) {
        setPeople(data.results || []);
        setTotalPages(data.total_pages || 0);
        setCurrentPage(1);
        setHasMore(data.total_pages > 1);
      } else {
        const newPeople = data.results || [];
        const uniqueNewPeople = newPeople.filter(
          (newPerson) =>
            !people.some((existing) => existing.id === newPerson.id)
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

  function scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  const displayPeople = people.filter(
    (p) => p.popularity > 0 && p.profile_path && !p.adult && !p.gender == 0
  );

  return (
    <div className="min-h-screen bg-amber-100 text-gray-800 relative">
      {/* Scroll Buttons */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-violet-700 text-white p-3 rounded-full shadow-md hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
        >
          <ChevronUp className="h-5 w-5" />
        </div>
      )}
      {showScrollToDown && (
        <div
          onClick={scrollToBottom}
          className="fixed top-20 right-4 bg-violet-700 text-white p-3 rounded-full shadow-md hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
        >
          <ChevronDown className="h-5 w-5" />
        </div>
      )}

      {loading ? (
        <div className="h-screen flex flex-col justify-center items-center bg-amber-100 opacity-80">
          <p className="mb-4 text-lg sm:text-2xl font-semibold text-violet-700">
            Loading Trending People...
          </p>
          <LoaderCircle className="animate-spin h-10 w-10 text-violet-600" />
        </div>
      ) : (
        <div className="w-full px-4 max-w-7xl mx-auto">
          {/* Header */}
          <div className="py-8">
            <h1 className="text-center text-3xl sm:text-5xl font-bold text-violet-800">
              Trending People
            </h1>
          </div>

          {displayPeople.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">
                No trending people available at the moment.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>
          ) : (
            <div className="pb-16">
              <p className="text-center text-gray-600 text-sm mb-6">
                Showing {displayPeople.length} trending people
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayPeople
                  .filter((person) => person.popularity > 2)
                  .map((person) => (
                    <Person key={person.id} person={person} />
                  ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={loadMorePeople}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {loadingMore ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Load More
                      </>
                    )}
                  </button>
                </div>
              )}

              {!hasMore && displayPeople.length > 20 && (
                <p className="text-center mt-6 text-gray-500 text-sm">
                  You’ve reached the end of trending people.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default People;
