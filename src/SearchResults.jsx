import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, LoaderCircle, Plus, ChevronUp, ChevronDown } from "lucide-react";
import MovieCard from "./Components/MovieCard";

function SearchResults() {
  const { query } = useParams(); // /search/:query
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

  // Fetch whenever query changes
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

  // Show scroll buttons
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      setShowScrollToTop(scrollTop > 300);
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollToDown(scrollTop >= 0 && !isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function fetchSearchResults(searchQuery, page = 1, isNewSearch = false) {
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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const filteredResults = (data.results || []).filter((item) =>
        ["movie", "tv", "person"].includes(item.media_type)
      );

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
                  existing.id === newItem.id && existing.media_type === newItem.media_type
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
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  }

  // Separate types for rendering
  const movies = results.filter((r) => r.media_type === "movie" && r.poster_path);
  const tvShows = results.filter((r) => r.media_type === "tv" && r.poster_path);
  const people = results.filter((r) => r.media_type === "person");

  return (
    <div className="min-h-screen bg-amber-100 relative">
      {/* Scroll Buttons */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-2 right-2 sm:bottom-2 sm:right-2 bg-black text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
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

      {loading ? (
        <div className="h-screen flex flex-col justify-center items-center text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 gap-4">
          <div>Loading Search Results...</div>
          <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10 animate-spin" />
        </div>
      ) : (
        <div className="movie-container w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 md:py-8 gap-4">
            <button
              onClick={goBackToLanding}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </button>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 text-center sm:text-right">
              Results for "<span className="text-blue-600">{query}</span>"
            </h2>
          </div>

          {/* If no results */}
          {results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No results found.</p>
              <button
                onClick={goBackToLanding}
                className="mt-4 bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600"
              >
                Browse Trending
              </button>
            </div>
          ) : (
            <>
              {/* Movies */}
              {movies.length > 0 && (
                <section className="mb-10">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Movies
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {movies.map((movie) => (
                      <MovieCard key={`movie-${movie.id}`} movie={movie} />
                    ))}
                  </div>
                </section>
              )}

              {/* TV Shows */}
              {tvShows.length > 0 && (
                <section className="mb-10">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    TV Shows
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {tvShows.map((tv) => (
                      <MovieCard key={`tv-${tv.id}`} movie={tv} />
                    ))}
                  </div>
                </section>
              )}

              {/* People */}
              {people.length > 0 && (
                <section>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    People
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {people.map((person) => (
                      <div
                        key={`person-${person.id}`}
                        className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                      >
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                            alt={person.name}
                            className="rounded-lg w-full h-64 object-cover mb-3"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gray-300 rounded-lg mb-3 flex items-center justify-center text-gray-500 text-sm">
                            No Image
                          </div>
                        )}
                        <h4 className="font-semibold text-sm sm:text-base">
                          {person.name}
                        </h4>
                        {person.known_for_department && (
                          <p className="text-gray-600 text-xs">{person.known_for_department}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8 mb-4">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-violet-500 text-white px-6 py-3 rounded-lg hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium shadow-md"
                  >
                    {loadingMore ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        <span>Loading More...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Load More</span>
                      </>
                    )}
                  </button>
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
