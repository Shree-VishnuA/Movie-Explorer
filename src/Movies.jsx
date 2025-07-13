import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, LoaderCircle, Plus } from "lucide-react";
import MovieCard from "./Components/MovieCard";
import { useAppContext } from "./AppContext";

const Movies = () => {
  const {
    apiKey,
    moviesData,
    updateMoviesData,
    resetMoviesData
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToDown, setShowScrollToDown] = useState(false);

  // Get data from context
  const { movies, currentPage, totalPages, hasMore } = moviesData;

  useEffect(() => {
    // Only fetch if we don't have movies data
    if (movies.length === 0) {
      fetchTrendingMovies(1, true);
    } else {
      setLoading(false);
    }
  }, []);

  // Handle scroll to show/hide scroll buttons
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Show scroll to top button after scrolling down 300px
      setShowScrollToTop(scrollTop > 300);
      
      // Show scroll to bottom button when not at the bottom and there's content below
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollToDown(scrollTop >= 0&& !isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function fetchTrendingMovies(page = 1, isInitialLoad = false) {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (isInitialLoad) {
        // First load - replace data
        updateMoviesData({
          movies: data.results || [],
          currentPage: 1,
          totalPages: data.total_pages || 0,
          hasMore: data.total_pages > 1
        });
      } else {
        // Load more - append data
        const newMovies = data.results || [];
        const uniqueNewMovies = newMovies.filter(
          (newMovie) =>
            !movies.some((existingMovie) => existingMovie.id === newMovie.id)
        );
        
        updateMoviesData({
          movies: [...movies, ...uniqueNewMovies],
          currentPage: page,
          hasMore: page < (data.total_pages || 0)
        });
      }

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      if (isInitialLoad) {
        resetMoviesData();
      }
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // Load more movies
  function loadMoreMovies() {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      fetchTrendingMovies(nextPage, false);
    }
  }

  // Scroll to top function
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Scroll to bottom function
  function scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  // Filter movies
  const displayMovies = movies.filter((movie) => movie.vote_count > 0).filter(
    (movie) => movie.poster_path || movie.backdrop_path
  );

  return (
    <div className="min-h-screen bg-amber-100 relative">
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-black text-white p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </div>
      )}

      {/* Scroll to Bottom Button */}
      {showScrollToDown && (
        <div
          onClick={scrollToBottom}
          className="fixed top-25 right-5  bg-black text-white p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-500 cursor-pointer"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </div>
      )}

      {loading ? (
        <div className="h-screen justify-center items-center flex flex-col sm:flex-row text-2xl sm:text-3xl lg:text-4xl w-full bg-amber-100 opacity-50 px-4 gap-4">
          <div className="text-center">Loading Movies....</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10"></LoaderCircle>
          </div>
        </div>
      ) : (
        <div className="movie container w-screen px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl py-2 flex justify-center items-center font-bold text-violet-600">
              Trending Movies
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Discover the most popular movies right now
            </p>
          </div>

          {displayMovies.length === 0 ? (
            <div className="text-center p-6 sm:p-8">
              <p className="text-lg sm:text-xl text-gray-600 mb-4">
                No trending movies available at the moment.
              </p>
              <button
                onClick={() => fetchTrendingMovies(1, true)}
                className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Refresh Movies
              </button>
            </div>
          ) : (
            <div className="pb-8 sm:pb-12">
              {/* Results count */}
              <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-center items-center gap-2">
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  Showing {displayMovies.length} trending movies 
                </p>
              </div>

              {/* Movies */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-8">
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
                        <span>Load More Movies</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* End of results */}
              {!hasMore && displayMovies.length > 20 && (
                <div className="text-center mt-8 mb-4">
                  <p className="text-sm sm:text-base text-gray-500">
                    You've reached the end of trending movies
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;