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
    language: "",
    region: "",
  });

  const genresList = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
  ];

  const sortOptions = [
    { value: "popularity.desc", label: "Popularity (High → Low)" },
    { value: "popularity.asc", label: "Popularity (Low → High)" },
    { value: "vote_average.desc", label: "Rating (High → Low)" },
    { value: "vote_average.asc", label: "Rating (Low → High)" },
    { value: "primary_release_date.desc", label: "Newest" },
    { value: "primary_release_date.asc", label: "Oldest" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "ja", name: "Japanese" },
  ];

  const regions = [
    { code: "US", name: "United States" },
    { code: "IN", name: "India" },
    { code: "GB", name: "United Kingdom" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
  ];

  const { movies, currentPage, totalPages, hasMore } = moviesData;

  useEffect(() => {
    if (movies.length === 0) {
      fetchTrendingMovies(1, true);
    } else {
      setLoading(false);
    }
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function fetchTrendingMovies(page = 1, isInitialLoad = false) {
    if (isInitialLoad) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`
      );
      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      const data = await response.json();

      if (isInitialLoad) {
        updateMoviesData({
          movies: data.results || [],
          currentPage: 1,
          totalPages: data.total_pages || 0,
          hasMore: data.total_pages > 1,
        });
      } else {
        const uniqueNewMovies = (data.results || []).filter(
          (m) => !movies.some((em) => em.id === m.id)
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
      resetMoviesData();
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function scrollToBottom() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  }

  function toggleFilters() {
    setisPersonalizerSelected((prev) => !prev);
  }

  function handleFilterChange(filterType, value) {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }

  async function applyFilters() {
    setLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1`;
      if (filters.genre) url += `&with_genres=${filters.genre}`;
      if (filters.year) url += `&primary_release_year=${filters.year}`;
      if (filters.rating) url += `&vote_average.gte=${filters.rating}`;
      if (filters.sortBy) url += `&sort_by=${filters.sortBy}`;
      if (filters.language) url += `&with_original_language=${filters.language}`;
      if (filters.region) url += `&region=${filters.region}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

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

  async function loadMoreMovies() {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      try {
        const nextPage = currentPage + 1;
        const hasActiveFilters =
          filters.genre || filters.year || filters.rating || filters.language || filters.region || filters.sortBy !== "popularity.desc";

        let url = hasActiveFilters
          ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${nextPage}`
          : `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${nextPage}`;

        if (hasActiveFilters) {
          if (filters.genre) url += `&with_genres=${filters.genre}`;
          if (filters.year) url += `&primary_release_year=${filters.year}`;
          if (filters.rating) url += `&vote_average.gte=${filters.rating}`;
          if (filters.sortBy) url += `&sort_by=${filters.sortBy}`;
          if (filters.language) url += `&with_original_language=${filters.language}`;
          if (filters.region) url += `&region=${filters.region}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

        const data = await response.json();
        const uniqueNewMovies = (data.results || []).filter(
          (m) => !movies.some((em) => em.id === m.id)
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

  async function resetFilters() {
    setFilters({ genre: "", year: "", rating: "", sortBy: "popularity.desc", language: "", region: "" });
    fetchTrendingMovies(1, true);
    setisPersonalizerSelected(false);
  }

  const displayMovies = movies.filter((m) => m.vote_count > 0 && (m.poster_path || m.backdrop_path));

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white relative">
      {/* Scroll divs */}
      {showScrollToTop && (
        <div onClick={scrollToTop} className="fixed bottom-2 right-2 bg-[#1A1A1F] text-[#00FFFF] p-3 rounded-full shadow-lg hover:bg-[#f67c02] cursor-pointer z-50">
          <ChevronUp />
        </div>
      )}
      {showScrollToDown && (
        <div onClick={scrollToBottom} className="fixed top-18 right-2 bg-[#1A1A1F] text-[#00FFFF] p-3 rounded-full shadow-lg hover:bg-[#f67c02] cursor-pointer z-50">
          <ChevronDown />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-[#00FFFF]">
          <span>Loading Movies...</span>
          <LoaderCircle className="animate-spin text-[#f67c02]" size={40} />
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-4">
          <h1 className="text-center font-bold text-[#f67c02] text-3xl my-6">Trending Movies</h1>

          {/* Filters Toggle */}
          <div className="flex justify-center mb-6">
            <div onClick={toggleFilters} className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${isPersonalizerSelected ? "bg-[#333]" : "bg-[#f67c02]"}`}>
              <Filter size={18} /> {isPersonalizerSelected ? "Hide Filters" : "Show Filters"}
            </div>
          </div>

          {/* Filters */}
          {isPersonalizerSelected && (
            <div className="bg-[#1A1A1F] p-6 rounded-lg shadow-lg border border-[#333] mb-8">
              <div className="flex justify-between mb-6">
                <h3 className="text-white text-lg font-semibold">Filter Movies</h3>
                <X className="cursor-pointer text-[#B3B3B3]" onClick={toggleFilters} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-[#00FFFF] mb-2">Genre</label>
                  <select className="w-full p-2 rounded bg-[#0D0D0F] border border-[#333]" onChange={(e) => handleFilterChange("genre", e.target.value)} value={filters.genre}>
                    <option value="">Select Genre</option>
                    {genresList.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[#00FFFF] mb-2">Release Year</label>
                  <select className="w-full p-2 rounded bg-[#0D0D0F] border border-[#333]" onChange={(e) => handleFilterChange("year", e.target.value)} value={filters.year}>
                    <option value="">Select Year</option>
                    {Array.from({ length: 24 }, (_, i) => 2024 - i).map((yr) => <option key={yr} value={yr}>{yr}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[#00FFFF] mb-2">Minimum Rating</label>
                  <select className="w-full p-2 rounded bg-[#0D0D0F] border border-[#333]" onChange={(e) => handleFilterChange("rating", e.target.value)} value={filters.rating}>
                    <option value="">Any Rating</option>
                    {[1,2,3,4,5,6,7,8,9].map((r) => <option key={r} value={r}>{r}+</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[#00FFFF] mb-2">Sort By</label>
                  <select className="w-full p-2 rounded bg-[#0D0D0F] border border-[#333]" onChange={(e) => handleFilterChange("sortBy", e.target.value)} value={filters.sortBy}>
                    {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[#00FFFF] mb-2">Language</label>
                  <select className="w-full p-2 rounded bg-[#0D0D0F] border border-[#333]" onChange={(e) => handleFilterChange("language", e.target.value)} value={filters.language}>
                    <option value="">Any</option>
                    {languages.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[#00FFFF] mb-2">Region</label>
                  <select className="w-full p-2 rounded bg-[#0D0D0F] border border-[#333]" onChange={(e) => handleFilterChange("region", e.target.value)} value={filters.region}>
                    <option value="">Any</option>
                    {regions.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <div onClick={applyFilters} className="bg-[#333] text-white  px-6 py-3 rounded-lg hover:bg-[#FFC107] flex items-center gap-2">
                  <Search size={18} /> Apply Filters
                </div>
                <div onClick={resetFilters} className="bg-[#333] text-white px-6 py-3 rounded-lg hover:bg-[#444] flex items-center gap-2">
                  <RotateCcw size={18} /> Reset Filters
                </div>
              </div>
            </div>
          )}

          {/* Movies Grid */}
          {displayMovies.length === 0 ? (
            <div className="text-center text-[#B3B3B3] py-12">No movies found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <div onClick={loadMoreMovies} disabled={loadingMore} className="bg-[#00FFFF] text-black px-6 py-3 rounded-lg hover:bg-[#FFC107] flex items-center gap-2">
                {loadingMore ? <LoaderCircle className="animate-spin" size={20} /> : <Plus size={18} />}
                {loadingMore ? "Loading..." : "Load More"}
              </div>
            </div>
          )}

          {!hasMore && displayMovies.length > 20 && (
            <p className="text-center text-[#B3B3B3] mt-8">You've reached the end of the list.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;
