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

  // Filter states
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    sortBy: "popularity.desc",
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
  }, []);

  // Handle scroll to show/hide scroll buttons
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Show scroll to top button after scrolling down 300px
      setShowScrollToTop(scrollTop > 300);

      // Show scroll to bottom button when not at the bottom and there's content below
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

  // Show/Hide filters function
  function showFilters() {
    setisPersonalizerSelected((prev) => !prev);
  }

  // Handle filter changes
  function handleFilterChange(filterType, value) {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }

  //  applying filters function
  async function applyFilters() {
    setLoading(true);

    try {
      // Build the base URL
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1`;

      // Add filters to URL if they exist
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

      console.log("Filter URL:", url); // For debugging

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update movies data with filtered results
      updateMoviesData({
        movies: data.results || [],
        currentPage: 1,
        totalPages: data.total_pages || 0,
        hasMore: data.total_pages > 1,
      });

      setLoading(false);
      setisPersonalizerSelected(false); // Close filter panel
    } catch (error) {
      console.error("Error applying filters:", error);
      setLoading(false);
    }
  }

  // loadmore movies function in applied filters
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

  // Reset filters function - UPDATED
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
    <div className="min-h-screen bg-amber-100 relative">
      {/* Scroll to Top Button - Responsive positioning */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}

      {/* Scroll to Bottom Button - Responsive positioning */}
      {showScrollToDown && (
        <div
          onClick={scrollToBottom}
          className="fixed top-20 sm:top-22 right-2 sm:right-3 bg-black text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-violet-600 transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}

      {loading ? (
        <div className="h-screen justify-center items-center flex flex-col text-xl sm:text-2xl md:text-3xl lg:text-4xl w-full bg-amber-100 opacity-50 px-4 gap-4">
          <div className="text-center">Loading Movies....</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"></LoaderCircle>
          </div>
        </div>
      ) : (
        <div className="movie-container w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="py-4 sm:py-6 md:py-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl py-2 flex justify-center items-center font-bold text-violet-600 text-center">
              Trending Movies
            </h1>
          </div>

          {displayMovies.length === 0 ? (
            <div className="text-center p-4 sm:p-6 md:p-8">
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4">
                No trending movies available at the moment.
              </p>
              <button
                onClick={() => fetchTrendingMovies(1, true)}
                className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base font-medium"
              >
                Refresh Movies
              </button>
            </div>
          ) : (
            <div className="pb-6 sm:pb-8 md:pb-12">
              {/* Results count - Responsive text */}
              <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center items-center">
                <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center">
                  Showing {displayMovies.length} trending movies
                </p>
              </div>

              {/* Personalizer Toggle - Responsive button */}
              <div className="mb-4 sm:mb-6 flex justify-center sm:justify-start">
                <button
                  onClick={showFilters}
                  className={`cursor-pointer px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 text-sm sm:text-base ${
                    isPersonalizerSelected 
                      ? "bg-gray-500 hover:bg-gray-600" 
                      : "bg-violet-600 hover:bg-violet-700"
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  {isPersonalizerSelected ? "Hide Filters" : "Show Filters"}
                </button>
              </div>

              {/* Filter Section - Responsive modal-like design */}
              {isPersonalizerSelected && (
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 mx-auto max-w-6xl">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                      Filter Movies
                    </h3>
                    <button
                      onClick={showFilters}
                      className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                    >
                      <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>

                  {/* Filter Grid - Responsive columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                    {/* Genre Filter */}
                    <div className="space-y-2">
                      <label className="block text-sm sm:text-base font-medium text-gray-700">
                        Genre
                      </label>
                      <select
                        value={filters.genre}
                        onChange={(e) =>
                          handleFilterChange("genre", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="">All Genres</option>
                        <option value="28">Action</option>
                        <option value="12">Adventure</option>
                        <option value="16">Animation</option>
                        <option value="35">Comedy</option>
                        <option value="80">Crime</option>
                        <option value="99">Documentary</option>
                        <option value="18">Drama</option>
                        <option value="10751">Family</option>
                        <option value="14">Fantasy</option>
                        <option value="36">History</option>
                        <option value="27">Horror</option>
                        <option value="10402">Music</option>
                        <option value="9648">Mystery</option>
                        <option value="10749">Romance</option>
                        <option value="878">Science Fiction</option>
                        <option value="10770">TV Movie</option>
                        <option value="53">Thriller</option>
                        <option value="10752">War</option>
                        <option value="37">Western</option>
                      </select>
                    </div>

                    {/* Year Filter */}
                    <div className="space-y-2">
                      <label className="block text-sm sm:text-base font-medium text-gray-700">
                        Release Year
                      </label>
                      <select
                        value={filters.year}
                        onChange={(e) =>
                          handleFilterChange("year", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="">All Years</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                      </select>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <label className="block text-sm sm:text-base font-medium text-gray-700">
                        Minimum Rating
                      </label>
                      <select
                        value={filters.rating}
                        onChange={(e) =>
                          handleFilterChange("rating", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="">Any Rating</option>
                        <option value="8">8.0+ Excellent</option>
                        <option value="7">7.0+ Very Good</option>
                        <option value="6">6.0+ Good</option>
                        <option value="5">5.0+ Average</option>
                        <option value="4">4.0+ Below Average</option>
                      </select>
                    </div>

                    {/* Sort By Filter */}
                    <div className="space-y-2">
                      <label className="block text-sm sm:text-base font-medium text-gray-700">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          handleFilterChange("sortBy", e.target.value)
                        }
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="popularity.desc">
                          Popularity (High to Low)
                        </option>
                        <option value="popularity.asc">
                          Popularity (Low to High)
                        </option>
                        <option value="release_date.desc">
                          Release Date (Newest)
                        </option>
                        <option value="release_date.asc">
                          Release Date (Oldest)
                        </option>
                        <option value="vote_average.desc">
                          Rating (High to Low)
                        </option>
                        <option value="vote_average.asc">
                          Rating (Low to High)
                        </option>
                        <option value="title.asc">Title (A to Z)</option>
                        <option value="title.desc">Title (Z to A)</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Action Buttons - Responsive layout */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                    <button
                      onClick={applyFilters}
                      className="bg-violet-600 text-white px-6 py-2 sm:py-3 rounded-md hover:bg-violet-700 transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      Apply Filters
                    </button>
                    <button
                      onClick={resetFilters}
                      className="bg-gray-500 text-white px-6 py-2 sm:py-3 rounded-md hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Movies Grid - Responsive layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                {displayMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex justify-center"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>

              {/* Load More Button - Responsive design */}
              {hasMore && (
                <div className="flex justify-center mt-6 sm:mt-8 mb-4">
                  <button
                    onClick={loadMoreMovies}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-violet-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
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
                  </button>
                </div>
              )}

              {/* End of results - Responsive text */}
              {!hasMore && displayMovies.length > 20 && (
                <div className="text-center mt-6 sm:mt-8 mb-4">
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