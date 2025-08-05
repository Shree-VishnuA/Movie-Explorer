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
    initialized: false,
  });

  // TV Shows filters
  const [tvShowFilters, setTVShowFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    country: "",
    sortBy: "popularity.desc",
  });

  // People state (NEW)
  const [peopleData, setPeopleData] = useState({
    people: [],
    currentPage: 1,
    totalPages: 0,
    hasMore: false,
    loading: false,
    loadingMore: false,
    initialized: false,
  });

  // API Key
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  // ---------------- MOVIES FUNCTIONS ----------------
  const updateMoviesData = (newData) => {
    setMoviesData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  function resetMoviesData() {
    setMoviesData({
      movies: [],
      currentPage: 1,
      totalPages: 0,
      hasMore: true,
    });

    fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=1`
    )
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

  // ---------------- TV SHOW FUNCTIONS ----------------
  const updateTvShowsData = (newData) => {
    setTvShowsData((prev) => ({ ...prev, ...newData }));
  };

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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
              !prev.tvShows.some((existingShow) => existingShow.id === newShow.id)
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

  const loadMoreTVshows = () => {
    if (!tvShowsData.loadingMore && tvShowsData.hasMore) {
      const nextPage = tvShowsData.currentPage + 1;
      fetchTrendingTVshows(nextPage, false);
    }
  };

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

  const getFilteredTVShows = () => {
    let shows = tvShowsData.tvShows
      .filter((show) => show.vote_count > 0)
      .filter((show) => show.poster_path || show.backdrop_path)
      .filter((show) =>
        tvShowFilters.genre
          ? show.genre_ids.includes(Number(tvShowFilters.genre))
          : true
      )
      .filter((show) =>
        tvShowFilters.country
          ? show.origin_country?.includes(tvShowFilters.country)
          : true
      )
      .filter((show) =>
        tvShowFilters.year
          ? show.first_air_date?.startsWith(tvShowFilters.year)
          : true
      );

    if (tvShowFilters.sortBy === "none") return shows;

    return shows.sort((a, b) => {
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
        case "vote_count.asc":
          return (a.vote_count || 0) - (b.vote_count || 0);
        case "vote_count.desc":
          return (b.vote_count || 0) - (a.vote_count || 0);
        case "name.asc":
          return a.name.localeCompare(b.name);
        case "name.desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  // ---------------- PEOPLE FUNCTIONS (NEW) ----------------
  const fetchTrendingPeople = async (page = 1, isInitialLoad = false) => {
    if (isInitialLoad) {
      setPeopleData((prev) => ({ ...prev, loading: true }));
    } else {
      setPeopleData((prev) => ({ ...prev, loadingMore: true }));
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/person/day?language=en-US&api_key=${apiKey}&page=${page}`
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (isInitialLoad) {
        setPeopleData((prev) => ({
          ...prev,
          people: data.results || [],
          totalPages: data.total_pages || 0,
          currentPage: 1,
          hasMore: data.total_pages > 1,
          loading: false,
          loadingMore: false,
          initialized: true,
        }));
      } else {
        setPeopleData((prev) => {
          const newPeople = data.results || [];
          const uniqueNewPeople = newPeople.filter(
            (newPerson) => !prev.people.some((existing) => existing.id === newPerson.id)
          );
          return {
            ...prev,
            people: [...prev.people, ...uniqueNewPeople],
            currentPage: page,
            hasMore: page < (data.total_pages || 0),
            loading: false,
            loadingMore: false,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching people:", error);
      setPeopleData((prev) => ({
        ...prev,
        people: [],
        loading: false,
        loadingMore: false,
        hasMore: false,
        initialized: true,
      }));
    }
  };

  const loadMorePeople = () => {
    if (!peopleData.loadingMore && peopleData.hasMore) {
      const nextPage = peopleData.currentPage + 1;
      fetchTrendingPeople(nextPage, false);
    }
  };

  const getFilteredPeople = () => {
    return peopleData.people.filter(
      (p) => p.popularity > 2 && p.profile_path && !p.adult && p.gender !== 0
    );
  };

  const contextValue = {
    // Movies
    moviesData,
    setMoviesData,
    resetMoviesData,
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

    // People (NEW)
    peopleData,
    fetchTrendingPeople,
    loadMorePeople,
    getFilteredPeople,

    apiKey,
    RecentSearches,
    setRecentSearches,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
