import Person from "./Components/Person";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Plus, ChevronUp, ChevronDown } from "lucide-react";

const FullScreenLoader = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="relative w-16 h-16 sm:w-24 sm:h-24">
      <div className="absolute inset-0 rounded-full border-4 sm:border-6 border-t-[#f67c02] border-b-[#00FFFF] border-l-transparent border-r-transparent animate-spin-slow"></div>
      <div className="absolute inset-4 sm:inset-6 bg-[#f67c02] rounded-full animate-pulse-glow"></div>
    </div>
  </div>
);

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

  // ✅ Apply filter once and use consistently
  const filteredPeople = people.filter(
    (p) => p.popularity > 2 && p.profile_path && !p.adult && p.gender !== 0
  );

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white relative">
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-2 right-2 sm:bottom-4 sm:right-2 bg-[#1A1A1F] text-[#FFC107] p-3 rounded-full shadow-lg hover:bg-[#FFC107] hover:text-white transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2"
        >
          <ChevronUp className="h-5 w-5" />
        </div>
      )}

      {/* Scroll to Bottom Button */}
      {showScrollToDown && (
        <div
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className="fixed top-18 right-2 sm:top-18 sm:right-2 bg-[#1A1A1F] text-[#FFC107] p-3 rounded-full shadow-lg hover:bg-[#FFC107] hover:text-white transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:ring-offset-2"
        >
          <ChevronDown className="h-5 w-5" />
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <FullScreenLoader />
      ) : (
        <div className="w-full px-4 max-w-7xl mx-auto">
          {/* Header */}
          <div className="py-8">
            <h1
              className="text-center font-bold text-[#FFC107]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              Trending People
            </h1>
          </div>

          {/* Empty State */}
          {filteredPeople.length === 0 ? (
            <div className="text-center py-16">
              <p
                className="text-[#B3B3B3]"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
              >
                No trending people available at the moment.
              </p>
              <div
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#FFC107] text-white px-6 py-3 rounded-lg hover:bg-[#FFC107] transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
              >
                Refresh Page
              </div>
            </div>
          ) : (
            <div className="pb-16">
              {/* People Count */}
              <p
                className="text-center text-[#B3B3B3] mb-6"
                style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}
              >
                Showing {filteredPeople.length} trending people
              </p>

              {/* People Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-1 sm:px-2 md:px-0">
                {filteredPeople.map((person) => (
                  <Person key={person.id} person={person} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <div
                    onClick={loadMorePeople}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-[#FFC107] text-black px-6 py-3 rounded-lg hover:bg-[#FFC107] disabled:bg-[#555] disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg hover:cursor-pointer"
                    style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                  >
                    {loadingMore ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin text-[#f67c02]" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Load More People
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* End Message */}
              {!hasMore && filteredPeople.length > 20 && (
                <p
                  className="text-center mt-6 text-[#888]"
                  style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}
                >
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
