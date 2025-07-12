import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, LoaderCircle, Plus } from "lucide-react";
import MovieCard from "./Components/MovieCard";

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [UserSearch, setUserSearch] = useState(query || "");
  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (query) {
      // Reset state when query changes
      setMovies([]);
      setCurrentPage(1);
      setTotalPages(0);
      setHasMore(false);
      fetchSearchedMovies(query, 1, true);
      setUserSearch(query);
    }
  }, [query]);

  // Fetch searched movies
  async function fetchSearchedMovies(searchQuery, page = 1, isNewSearch = false) {
    if (!searchQuery || searchQuery.trim() === "") {
      return;
    }

    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${encodeURIComponent(
          searchQuery
        )}&include_adult=false&language=en-US&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (isNewSearch) {
        // First load 
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 0);
        setCurrentPage(1);
        setHasMore(data.total_pages > 1);
      } else {
        // Load more - append to existing movies
        setMovies(prevMovies => {
          const newMovies = data.results || [];
          // Avoid repitition
          const uniqueNewMovies = newMovies.filter(
            newMovie => !prevMovies.some(existingMovie => existingMovie.id === newMovie.id)
          );
          return [...prevMovies, ...uniqueNewMovies];
        });
        setCurrentPage(page);
        setHasMore(page < (data.total_pages || 0));
      }
      
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error searching movies:", error);
      if (isNewSearch) {
        setMovies([]);
      }
      setLoading(false);
      setLoadingMore(false);
      setHasMore(false);
    }
  }

  // Load more movies
  function loadMoreMovies() {
    if (!loadingMore && hasMore && query) {
      const nextPage = currentPage + 1;
      fetchSearchedMovies(query, nextPage, false);
    }
  }

  // Handle new search from navbar
  function handleSearch(searchQuery) {
    if (!searchQuery || searchQuery.trim() === "") {
      navigate("/");
      return;
    }

    // Navigate to new search URL
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  }

  // Go back to landing page
  function goBackToLanding() {
    setUserSearch(() => "");
    navigate("/");
  }

  // Filter movies 
  const displayMovies = movies
    .filter((movie) => movie.vote_count > 0)
    .filter((movie) => movie.poster_path || movie.backdrop_path)
    .sort((a, b) => b.vote_average - a.vote_average);

  return (
    <div className="min-h-screen bg-amber-100">
      {/* Search Results */}
      {loading ? (
        <div className="h-[calc(100vh-90px)] justify-center items-center flex flex-col sm:flex-row text-2xl sm:text-3xl lg:text-4xl w-full bg-amber-100 opacity-50 px-4 gap-4">
          <div className="text-center">Loading Search Results....</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10"></LoaderCircle>
          </div>
        </div>
      ) : (
        <div className="movie container w-screen mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4 sm:gap-0">
            <button
              onClick={goBackToLanding}
              className="flex items-center gap-2 bg-gray-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base order-2 sm:order-1 self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </button>

            <div className="flex-1 sm:flex-none order-1 sm:order-2 w-full sm:w-auto">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-left sm:text-center font-semibold break-words">
                Search Results for "
                <span className="text-blue-600">{query}</span>"
              </p>
            </div>

          </div>

          {/* Results Section */}
          {displayMovies.length === 0 ? (
            <div className="text-center p-6 sm:p-8">
              <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6">
                No movies found for "
                <span className="font-semibold">{query}</span>".
              </p>
              <button
                onClick={goBackToLanding}
                className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Browse Trending Movies
              </button>
            </div>
          ) : (
            <div className="pb-8">
              {/* Results count info */}
              <div className="px-4 sm:px-6 mb-4 flex flex-col sm:flex-row justify-center items-start sm:items-center gap-2">
                <p className="text-sm sm:text-base text-gray-600">
                  Showing {displayMovies.length} movies
                </p>
                
              </div>

              {/* Movies Section */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-7 mb-8">
                {displayMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex-shrink-0 w-full max-w-sm sm:w-auto"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8 mb-4">
                  <button
                    onClick={loadMoreMovies}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
                  >
                    {loadingMore ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        <span>Loading More...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Load More Movies</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* End */}
              {!hasMore && displayMovies.length > 20 && (
                <div className="text-center mt-8 mb-4">
                  <p className="text-sm sm:text-base text-gray-500">
                    You've reached the end of search results
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

export default SearchResults;