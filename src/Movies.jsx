import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  LoaderCircle,
  Plus,
  Filter,
  X,
  RotateCcw,
  Search,
} from "lucide-react";
import MovieCard from "./Components/MovieCard";
import { useAppContext } from "./AppContext";

const Movies = () => {
  const { apiKey, moviesData, updateMoviesData, resetMoviesData } =
    useAppContext();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToDown, setShowScrollToDown] = useState(false);
  const [isPersonalizerSelected, setisPersonalizerSelected] = useState(false);

  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    sortBy: "popularity.desc",
    language: "", // e.g., 'en', 'hi'
    region: "", // e.g., 'US', 'IN'
  });

  // Get data from context
  const { movies, currentPage, totalPages, hasMore } = moviesData;

  useEffect(() => {
    // Only fetch if we don't have movies data
    if (movies.length === 0) {
      fetchTrendingMovies(1, true);
    } else {
      setLoading(false);
    }
  }, []); // Added empty dependency array to prevent infinite calls

  // Handle scroll to show/hide scroll divs
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Show scroll to top div after scrolling down 300px
      setShowScrollToTop(scrollTop > 300);

      // Show scroll to bottom div when not at the bottom and there's content below
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollToDown(scrollTop >= 0 && !isNearBottom);
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
          hasMore: data.total_pages > 1,
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
          hasMore: page < (data.total_pages || 0),
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

  // Show/Hide filters function
  function toggleFilters() {
    setisPersonalizerSelected((prev) => !prev);
  }

  // Handle filter changes
  function handleFilterChange(filterType, value) {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }

  // Applying filters function
  async function applyFilters() {
    setLoading(true);

    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1`;

      if (filters.genre) {
        url += `&with_genres=${filters.genre}`;
      }
      if (filters.year) {
        url += `&primary_release_year=${filters.year}`;
      }
      if (filters.rating) {
        url += `&vote_average.gte=${filters.rating}`;
      }
      if (filters.sortBy) {
        url += `&sort_by=${filters.sortBy}`;
      }
      if (filters.language) {
        url += `&with_original_language=${filters.language}`;
      }
      if (filters.region) {
        url += `&region=${filters.region}`;
      }

      console.log("Filter URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      updateMoviesData({
        movies: data.results || [],
        currentPage: 1,
        totalPages: data.total_pages || 0,
        hasMore: data.total_pages > 1,
      });

      setLoading(false);
      setisPersonalizerSelected(false);
    } catch (error) {
      console.error("Error applying filters:", error);
      setLoading(false);
    }
  }

  // Load more movies function with filters support
  async function loadMoreMovies() {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);

      try {
        const nextPage = currentPage + 1;

        // Check if filters are applied
        const hasActiveFilters =
          filters.genre ||
          filters.year ||
          filters.rating ||
          filters.sortBy !== "popularity.desc";

        let url;
        if (hasActiveFilters) {
          // Use discover API with filters
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${nextPage}`;

          if (filters.genre) {
            url += `&with_genres=${filters.genre}`;
          }

          if (filters.year) {
            url += `&primary_release_year=${filters.year}`;
          }

          if (filters.rating) {
            url += `&vote_average.gte=${filters.rating}`;
          }

          if (filters.sortBy) {
            url += `&sort_by=${filters.sortBy}`;
          }
          if (filters.language) {
            url += `&with_original_language=${filters.language}`;
          }
          if (filters.region) {
            url += `&region=${filters.region}`;
          }
        } else {
          // Use trending API which is normal
          url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${nextPage}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Append new movies to existing ones
        const newMovies = data.results || [];
        const uniqueNewMovies = newMovies.filter(
          (newMovie) =>
            !movies.some((existingMovie) => existingMovie.id === newMovie.id)
        );

        updateMoviesData({
          movies: [...movies, ...uniqueNewMovies],
          currentPage: nextPage,
          hasMore: nextPage < (data.total_pages || 0),
        });

        setLoadingMore(false);
      } catch (error) {
        console.error("Error loading more movies:", error);
        setLoadingMore(false);
      }
    }
  }

  // Reset filters function
  async function resetFilters() {
    // Reset filter state
    setFilters({
      genre: "",
      year: "",
      rating: "",
      sortBy: "popularity.desc",
    });

    // Fetch trending movies again to show all movies
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Reset movies data to trending movies
      updateMoviesData({
        movies: data.results || [],
        currentPage: 1,
        totalPages: data.total_pages || 0,
        hasMore: data.total_pages > 1,
      });

      setLoading(false);
      setisPersonalizerSelected(false); // Close filter panel
    } catch (error) {
      console.error("Error resetting filters:", error);
      setLoading(false);
    }
  }

  // Filter movies
  const displayMovies = movies
    .filter((movie) => movie.vote_count > 0)
    .filter((movie) => movie.poster_path || movie.backdrop_path);

  return (
    <div className="min-h-screen bg-[#0D0D0F] relative text-white">
      {/* Scroll to Top div */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-2 right-2 sm:bottom-4 sm:right-2 bg-[#1A1A1F] text-[#00FFFF] p-3 rounded-full shadow-lg hover:bg-[#f67c02] hover:text-white transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}

      {/* Scroll to Bottom div */}
      {showScrollToDown && (
        <div
          onClick={scrollToBottom}
          className="fixed top-18 right-2 sm:top-18 sm:right-2 bg-[#1A1A1F] text-[#00FFFF] p-3 rounded-full shadow-lg hover:bg-[#f67c02] hover:text-white transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:ring-offset-2"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}

      {loading ? (
        <div className="h-screen flex flex-col justify-center items-center gap-4 px-4 bg-[#0D0D0F] opacity-80 text-[#00FFFF] text-center">
          <div
            style={{
              fontSize: "clamp(1.25rem, 3vw, 2.5rem)", // Scales 20px to 40px
            }}
          >
            Loading Movies...
          </div>
          <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin text-[#f67c02]" />
        </div>
      ) : (
        <div className="movie-container w-full max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Heading */}
          <div className="py-4 sm:py-6 md:py-8">
            <h1
              className="flex justify-center items-center text-center font-bold text-[#f67c02] drop-shadow-[0_0_8px_#f67c02]"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 3rem)", // 24px to 48px
              }}
            >
              Trending Movies
            </h1>
          </div>

          {/* No Movies Case */}
          {displayMovies.length === 0 ? (
            <div className="text-center p-4 sm:p-6 md:p-8">
              <p
                className="mb-4 text-[#B3B3B3]"
                style={{
                  fontSize: "clamp(0.875rem, 2vw, 1.25rem)", // 14px–20px
                }}
              >
                No trending movies available at the moment.
              </p>
              <div
                onClick={() => fetchTrendingMovies(1, true)}
                className="bg-[#00FFFF] text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-[#FFC107] transition-colors font-medium"
                style={{
                  fontSize: "clamp(0.75rem, 1.5vw, 1rem)", // 12px–16px
                }}
              >
                Refresh Movies
              </div>
            </div>
          ) : (
            <div className="pb-6 sm:pb-8 md:pb-12">
              {/* Results count */}
              <div className="mb-4 sm:mb-6 flex justify-center">
                <p
                  className="text-[#B3B3B3] text-center"
                  style={{
                    fontSize: "clamp(0.75rem, 1.5vw, 1.125rem)", // 12px–18px
                  }}
                >
                  Showing {displayMovies.length} trending movies
                </p>
              </div>

              {/* Filters Toggle */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div
                  onClick={toggleFilters}
                  className={`px-4 py-2 sm:px-6 sm:py-3 hover:cursor-pointer rounded-lg font-semibold flex items-center gap-2 transition-all duration-200`}
                  style={{
                    fontSize: "clamp(0.75rem, 1.5vw, 1rem)", // 12px–16px
                    backgroundColor: isPersonalizerSelected
                      ? "#333"
                      : "#f67c02",
                  }}
                >
                  <Filter className="h-4 w-4" />
                  {isPersonalizerSelected ? "Hide Filters" : "Show Filters"}
                </div>
              </div>

              {/* Filters Section */}
              {isPersonalizerSelected && (
                <div className="bg-[#1A1A1F] rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-[#333] mx-auto max-w-6xl">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3
                      className="text-white font-semibold"
                      style={{
                        fontSize: "clamp(1rem, 2vw, 1.5rem)", // 16px–24px
                      }}
                    >
                      Filter Movies
                    </h3>
                    <div
                      onClick={toggleFilters}
                      className="text-[#B3B3B3] hover:text-white p-1"
                    >
                      <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>

                  {/* Filters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
                    {[
                      "Genre",
                      "Release Year",
                      "Minimum Rating",
                      "Sort By",
                      "Language",
                      "Region",
                    ].map((label, idx) => (
                      <div className="space-y-2" key={idx}>
                        <label
                          className="block text-[#00FFFF] font-medium"
                          style={{
                            fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                          }}
                        >
                          {label}
                        </label>
                        <select
                          className="w-full p-2 sm:p-3 border border-[#333] rounded-md bg-[#0D0D0F] text-white focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                          style={{
                            fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                          }}
                        >
                          <option value="">Select {label}</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Filters divs */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                    <div
                      onClick={applyFilters}
                      className="bg-[#333] text-white px-6 py-3 rounded-md hover:bg-[#444] transition-colors flex items-center justify-center gap-2 font-medium hover:cursor-pointer"
                      style={{
                        fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                      }}
                    >
                      <Search className="h-4 w-4" />
                      Apply Filters
                    </div>
                    <div
                      onClick={resetFilters}
                      className="bg-[#333] text-white px-6 py-3 rounded-md hover:bg-[#444] transition-colors flex items-center justify-center gap-2 font-medium hover:cursor-pointer"
                      style={{
                        fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset Filters
                    </div>
                  </div>
                </div>
              )}

              {/* Movies Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-1 sm:px-2 md:px-0">
                {displayMovies.map((movie) => (
                  <div key={movie.id} className="flex justify-center w-full">
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>

              {/* Load More div */}
              {hasMore && (
                <div className="flex justify-center mt-6 sm:mt-8 mb-4">
                  <div
                    onClick={loadMoreMovies}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-[#00FFFF] text-black px-6 py-3 rounded-lg disabled:bg-[#555] disabled:cursor-not-allowed hover:bg-[#FFC107] transition-colors font-medium shadow-md hover:shadow-lg hover:cursor-pointer"
                    style={{
                      fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                    }}
                  >
                    {loadingMore ? (
                      <>
                        <LoaderCircle className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span>Loading More...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Load More Movies</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* End of Results */}
              {!hasMore && displayMovies.length > 20 && (
                <div className="text-center mt-6 sm:mt-8 mb-4">
                  <p
                    className="text-[#B3B3B3]"
                    style={{
                      fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                    }}
                  >
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
