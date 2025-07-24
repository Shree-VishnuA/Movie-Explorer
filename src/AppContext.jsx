import React, { createContext, useContext, useState } from "react";

// Create the context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Movies state
  const [moviesData, setMoviesData] = useState({
    movies: [],
    currentPage: 1,
    totalPages: 0,
    hasMore: false,
  });

  const [RecentSearches, setRecentSearches] = useState([]);

  // TV Shows state
  const [tvShowsData, setTvShowsData] = useState({
    tvShows: [],
    currentPage: 1,
    totalPages: 0,
    hasMore: false,
    loading: false,
    loadingMore: false,
    initialized: false, // Track if data has been loaded initially
  });

  // TV Shows filters (persistent across pages)
  const [tvShowFilters, setTVShowFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    country: "",
    sortBy: "popularity.desc",
  });

  // API Key
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  // Update TV shows data
  const updateTvShowsData = (newData) => {
    setTvShowsData((prev) => ({ ...prev, ...newData }));
  };

  // Fetch trending TV shows
  const fetchTrendingTVshows = async (page = 1, isInitialLoad = false) => {
    if (isInitialLoad) {
      setTvShowsData((prev) => ({ ...prev, loading: true }));
    } else {
      setTvShowsData((prev) => ({ ...prev, loadingMore: true }));
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (isInitialLoad) {
        setTvShowsData((prev) => ({
          ...prev,
          tvShows: data.results || [],
          totalPages: data.total_pages || 0,
          currentPage: 1,
          hasMore: data.total_pages > 1,
          loading: false,
          loadingMore: false,
          initialized: true,
        }));
      } else {
        setTvShowsData((prev) => {
          const newShows = data.results || [];
          const uniqueNewShows = newShows.filter(
            (newShow) =>
              !prev.tvShows.some(
                (existingShow) => existingShow.id === newShow.id
              )
          );
          return {
            ...prev,
            tvShows: [...prev.tvShows, ...uniqueNewShows],
            currentPage: page,
            hasMore: page < (data.total_pages || 0),
            loading: false,
            loadingMore: false,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching TV-shows:", error);
      setTvShowsData((prev) => ({
        ...prev,
        tvShows: [],
        loading: false,
        loadingMore: false,
        hasMore: false,
        initialized: true,
      }));
    }
  };

  // Load more TV shows
  const loadMoreTVshows = () => {
    if (!tvShowsData.loadingMore && tvShowsData.hasMore) {
      const nextPage = tvShowsData.currentPage + 1;
      fetchTrendingTVshows(nextPage, false);
    }
  };

  // Apply and Reset Filters
  const applyTVShowFilters = (newFilters) => {
    setTVShowFilters(newFilters);
  };

  const resetTVShowFilters = () => {
    setTVShowFilters({
      genre: "",
      year: "",
      rating: "",
      country: "",
      sortBy: "popularity.desc",
    });
  };

  // Update Movies data (like your TV shows version)
const updateMoviesData = (newData) => {
  setMoviesData((prev) => ({
    ...prev,
    ...newData, // Merge new data into existing state
  }));
};

 
  function resetMoviesData() {
  setMoviesData({
    movies: [],
    currentPage: 1,
    totalPages: 0,
    hasMore: true,
  });

  // Auto-fetch trending movies after clearing
  fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=1`)
    .then((res) => res.json())
    .then((data) => {
      setMoviesData({
        movies: data.results || [],
        currentPage: 1,
        totalPages: data.total_pages || 0,
        hasMore: data.total_pages > 1,
      });
    })
    .catch(() => {
      setMoviesData({
        movies: [],
        currentPage: 1,
        totalPages: 0,
        hasMore: false,
      });
    });
}

  // Get Filtered TV Shows
  const getFilteredTVShows = () => {
    return tvShowsData.tvShows
      .filter((show) => show.vote_count > 0)
      .filter((show) => show.poster_path || show.backdrop_path)
      .filter((show) =>
        tvShowFilters.genre ? show.genre_ids.includes(Number(tvShowFilters.genre)) : true
      )
      .filter((show) =>
        tvShowFilters.country ? show.origin_country?.includes(tvShowFilters.country) : true
      )
      .filter((show) =>
        tvShowFilters.year ? show.first_air_date?.startsWith(tvShowFilters.year) : true
      )
      .sort((a, b) => {
        switch (tvShowFilters.sortBy) {
          case "popularity.asc":
            return a.popularity - b.popularity;
          case "popularity.desc":
            return b.popularity - a.popularity;
          case "first_air_date.asc":
            return new Date(a.first_air_date) - new Date(b.first_air_date);
          case "first_air_date.desc":
            return new Date(b.first_air_date) - new Date(a.first_air_date);
          case "vote_average.asc":
            return a.vote_average - b.vote_average;
          case "vote_average.desc":
            return b.vote_average - a.vote_average;
          case "name.asc":
            return a.name.localeCompare(b.name);
          case "name.desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  };

  const contextValue = {
    // Movies
    moviesData,
    setMoviesData,
    resetMoviesData ,
    updateMoviesData,

    // TV Shows
    tvShowsData,
    fetchTrendingTVshows,
    loadMoreTVshows,
    getFilteredTVShows,
    tvShowFilters,
    applyTVShowFilters,
    resetTVShowFilters,
    updateTvShowsData,

    apiKey,

    RecentSearches,
  setRecentSearches,

  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
