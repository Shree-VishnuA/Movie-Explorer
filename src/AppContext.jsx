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

// Context Provider Component
export const AppProvider = ({ children }) => {
  // Movies state
  const [moviesData, setMoviesData] = useState({
    movies: [],
    currentPage: 1,
    totalPages: 0,
    hasMore: false,
  });

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

  // Loading states
  const [globalLoading, setGlobalLoading] = useState({
    movies: false,
    tvShows: false,
  });

  const [userSearch, setUserSearch] = useState("");

  // API Key
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  // Update movies data
  const updateMoviesData = (newData) => {
    setMoviesData((prev) => ({ ...prev, ...newData }));
  };

  // Update TV shows data
  const updateTvShowsData = (newData) => {
    setTvShowsData((prev) => ({ ...prev, ...newData }));
  };

  // Reset movies data
  const resetMoviesData = () => {
    setMoviesData({
      movies: [],
      currentPage: 1,
      totalPages: 0,
      hasMore: false,
    });
  };

  // Reset TV shows data
  const resetTvShowsData = () => {
    setTvShowsData({
      tvShows: [],
      currentPage: 1,
      totalPages: 0,
      hasMore: false,
      loading: false,
      loadingMore: false,
      initialized: false,
    });
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
        // First load - replace existing data
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
        // Load more - append to existing data
        setTvShowsData((prev) => {
          const newShows = data.results || [];
          // Remove any duplicates
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

      if (isInitialLoad) {
        setTvShowsData((prev) => ({
          ...prev,
          tvShows: [],
          loading: false,
          loadingMore: false,
          hasMore: false,
          initialized: true,
        }));
      } else {
        setTvShowsData((prev) => ({
          ...prev,
          loading: false,
          loadingMore: false,
          hasMore: false,
        }));
      }
    }
  };

  // Load more TV shows
  const loadMoreTVshows = () => {
    if (!tvShowsData.loadingMore && tvShowsData.hasMore) {
      const nextPage = tvShowsData.currentPage + 1;
      fetchTrendingTVshows(nextPage, false);
    }
  };

  // Set global loading state
  const setGlobalLoadingState = (type, loading) => {
    setGlobalLoading((prev) => ({ ...prev, [type]: loading }));
  };

  // Filter TV shows (same logic as in your component)
  const getFilteredTVShows = () => {
    return tvShowsData.tvShows
      .filter((show) => show.vote_count > 0)
      .filter((show) => show.poster_path || show.backdrop_path);
  };

  const contextValue = {
    // Movies
    moviesData,
    updateMoviesData,
    resetMoviesData,

    // TV Shows
    tvShowsData,
    updateTvShowsData,
    resetTvShowsData,
    fetchTrendingTVshows,
    loadMoreTVshows,
    getFilteredTVShows,

    // Global loading
    globalLoading,
    setGlobalLoadingState,

    // API Key
    apiKey,

    userSearch,
    setUserSearch,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
