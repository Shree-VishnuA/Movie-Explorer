import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LoaderCircle,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToDown, setShowScrollToDown] = useState(false);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const trimmedQuery = query?.trim();
    if (trimmedQuery) {
      setResults([]);
      setCurrentPage(1);
      setTotalPages(0);
      setHasMore(false);
      fetchSearchResults(trimmedQuery, 1, true);
    } else {
      navigate("/");
    }
  }, [query]);

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function fetchSearchResults(
    searchQuery,
    page = 1,
    isNewSearch = false
  ) {
    const trimmedQuery = searchQuery?.trim();
    if (!trimmedQuery) return;

    if (isNewSearch) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apikey}&query=${encodeURIComponent(
          trimmedQuery
        )}&include_adult=false&language=en-US&page=${page}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const filteredResults = (data.results || []).filter((item) => {
        const q = ` ${trimmedQuery.toLowerCase()} `; // Add spaces to both sides
        const name = ` ${(item.title || item.name || "").toLowerCase()} `; // Add spaces to match as full word

        return (
          ["movie", "tv", "person"].includes(item.media_type) &&
          name.includes(q) // Match only full word (with spaces)
        );
      });

      if (isNewSearch) {
        setResults(filteredResults);
        setTotalPages(data.total_pages || 0);
        setCurrentPage(1);
        setHasMore(data.total_pages > 1);
      } else {
        setResults((prev) => {
          const unique = filteredResults.filter(
            (newItem) =>
              !prev.some(
                (existing) =>
                  existing.id === newItem.id &&
                  existing.media_type === newItem.media_type
              )
          );
          return [...prev, ...unique];
        });
        setCurrentPage(page);
        setHasMore(page < (data.total_pages || 0));
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      if (isNewSearch) setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function loadMore() {
    if (!loadingMore && hasMore && query) {
      fetchSearchResults(query, currentPage + 1, false);
    }
  }

  function goBackToLanding() {
    navigate("/");
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

  const movies = results.filter(
    (r) => r.media_type === "movie" && r.poster_path
  );
  const tvShows = results.filter((r) => r.media_type === "tv" && r.poster_path);
  const people = results.filter((r) => r.media_type === "person");

  const renderCard = (item) => {
    const isPerson = item.media_type === "person";
    const imagePath = isPerson ? item.profile_path : item.poster_path;
    const title = item.title || item.name;
    const subText =
      isPerson && item.known_for_department
        ? item.known_for_department
        : item.release_date || item.first_air_date || "";

    return (
      <div
        key={`${item.media_type}-${item.id}`}
        className="bg-[#1A1A1F] rounded-xl shadow-md p-3 flex flex-col items-center text-center hover:shadow-[0_0_12px_#E50914] transition-all hover:scale-105"
      >
        {imagePath ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${imagePath}`}
            alt={title}
            className="rounded-lg w-full h-64 object-cover mb-3"
          />
        ) : (
          <div className="w-full h-64 bg-[#333] rounded-lg mb-3 flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}
        <h4 className="font-semibold text-white text-sm sm:text-base">
          {title}
        </h4>
        {subText && <p className="text-gray-400 text-xs">{subText}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white relative">
      {/* Scroll divs */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-3 right-3 bg-[#1A1A1F] text-[#FFD700] p-3 rounded-full shadow-md hover:bg-[#E50914] hover:text-white transition-all duration-300 transform hover:scale-110 z-50"
        >
          <ChevronUp className="h-5 w-5" />
        </div>
      )}
      {showScrollToDown && (
        <div
          onClick={scrollToBottom}
          className="fixed top-20 right-3 bg-[#1A1A1F] text-[#FFD700] p-3 rounded-full shadow-md hover:bg-[#E50914] hover:text-white transition-all duration-300 transform hover:scale-110 z-50"
        >
          <ChevronDown className="h-5 w-5" />
        </div>
      )}

      {loading ? (
        <div className="h-screen flex flex-col justify-center items-center gap-4">
          <p
            className="text-[#FFD700] drop-shadow-[0_0_6px_#FFD700]"
            style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}
          >
            Loading Search Results...
          </p>
          <LoaderCircle className="h-10 w-10 animate-spin text-[#E50914]" />
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div
              onClick={goBackToLanding}
              className="flex items-center gap-2 bg-[#1A1A1F] text-[#FFD700] px-4 py-2 rounded-lg hover:bg-[#E50914] hover:text-white transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </div>
            <h2
              className="font-bold text-center sm:text-right text-[#E50914] drop-shadow-[0_0_8px_#E50914]"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
            >
              Results for <span className="text-[#FFD700]">{query}</span>
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-10">
              <p
                className="text-gray-400"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
              >
                No results found.
              </p>
              <div
                onClick={goBackToLanding}
                className="mt-4 bg-[#E50914] text-white px-6 py-3 rounded-lg hover:bg-[#B20710] transition-all"
                style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
              >
                Browse Trending
              </div>
            </div>
          ) : (
            <>
              {/* Movies */}
              {movies.length > 0 && (
                <section className="mb-10">
                  <h3
                    className="font-semibold text-[#FFD700] mb-4 drop-shadow-[0_0_4px_#FFD700]"
                    style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}
                  >
                    Movies
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {movies.map(renderCard)}
                  </div>
                </section>
              )}

              {/* TV Shows */}
              {tvShows.length > 0 && (
                <section className="mb-10">
                  <h3
                    className="font-semibold text-[#FFD700] mb-4 drop-shadow-[0_0_4px_#FFD700]"
                    style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}
                  >
                    TV Shows
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {tvShows.map(renderCard)}
                  </div>
                </section>
              )}

              {/* People */}
              {people.length > 0 && (
                <section>
                  <h3
                    className="font-semibold text-[#FFD700] mb-4 drop-shadow-[0_0_4px_#FFD700]"
                    style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}
                  >
                    People
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {people.map(renderCard)}
                  </div>
                </section>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-8 mb-4">
                  <div
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-[#FFD700] text-black px-6 py-3 hover:cursor-pointer rounded-lg hover:bg-[#FFC107] disabled:bg-[#444] disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
                    style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                  >
                    {loadingMore ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin text-[#E50914]" />
                        Loading More...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Load More
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
