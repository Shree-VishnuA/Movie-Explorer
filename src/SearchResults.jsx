import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LoaderCircle,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import MovieCard from "./Components/MovieCard";
import ShowCard from "./Components/ShowCard";
import Person from "./Components/Person";
import { useAppContext } from "./AppContext";

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const { apiKey } = useAppContext();

  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [people, setPeople] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToDown, setShowScrollToDown] = useState(false);

  useEffect(() => {
    if (query?.trim()) {
      setMovies([]);
      setTvShows([]);
      setPeople([]);
      setPage(1);
      fetchAll(query.trim(), 1, true);
    } else {
      navigate("/");
    }
  }, [query]);

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

  async function fetchAll(searchQuery, page = 1, isNewSearch = false) {
    if (!searchQuery) return;
    if (isNewSearch) setLoading(true);
    else setLoadingMore(true);

    async function fetchCategory(type) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(
            searchQuery
          )}&include_adult=false&language=en-US&page=${page}`
        );
        if (!res.ok) throw new Error(`Failed to fetch ${type}`);
        return await res.json();
      } catch (err) {
        console.warn(`Error fetching ${type}:`, err.message);
        return { results: [], total_pages: 0 };
      }
    }

    try {
      const [movieRes, tvRes, personRes] = await Promise.all([
        fetchCategory("movie"),
        fetchCategory("tv"),
        fetchCategory("person"),
      ]);

      // Filter to only items with images
      const filteredMovies = (movieRes.results || []).filter((m) => m.poster_path);
      const filteredTv = (tvRes.results || []).filter((t) => t.poster_path);
      const filteredPeople = (personRes.results || []).filter((p) => p.profile_path);

      if (isNewSearch) {
        setMovies(filteredMovies);
        setTvShows(filteredTv);
        setPeople(filteredPeople);
      } else {
        setMovies((prev) => [...prev, ...filteredMovies]);
        setTvShows((prev) => [...prev, ...filteredTv]);
        setPeople((prev) => [...prev, ...filteredPeople]);
      }

      const morePagesExist =
        page < (movieRes.total_pages || 0) ||
        page < (tvRes.total_pages || 0) ||
        page < (personRes.total_pages || 0);

      setHasMore(morePagesExist);
      setPage(page);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function loadMore() {
    if (!loadingMore && hasMore && query) {
      fetchAll(query, page + 1, false);
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  }

  const noResults = !movies.length && !tvShows.length && !people.length;

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white relative">
      {/* Scroll Buttons */}
      {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-3 right-3 bg-[#1A1A1F] text-[#FFD700] p-3 rounded-full shadow-md hover:bg-[#E50914] hover:text-white transition-all transform hover:scale-110 z-50 cursor-pointer"
        >
          <ChevronUp className="h-5 w-5" />
        </div>
      )}
      {showScrollToDown && (
        <div
          onClick={scrollToBottom}
          className="fixed top-20 right-3 bg-[#1A1A1F] text-[#FFD700] p-3 rounded-full shadow-md hover:bg-[#E50914] hover:text-white transition-all transform hover:scale-110 z-50 cursor-pointer"
        >
          <ChevronDown className="h-5 w-5" />
        </div>
      )}

      {loading ? (
        <div className="h-screen flex flex-col justify-center items-center gap-4">
          <p className="text-[#FFD700]" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
            Loading Search Results...
          </p>
          <LoaderCircle className="h-10 w-10 animate-spin text-[#E50914]" />
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-[#1A1A1F] text-[#FFD700] px-4 py-2 rounded-lg hover:bg-[#444] hover:text-white cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </div>
            <h2
              className="font-bold text-center sm:text-right text-[#f67c02] drop-shadow-[0_0_3px_#E50914]"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
            >
              Results for <span className="text-[cyan] drop-shadow-[0_0_2px_#00FFFF]">{query}</span>
            </h2>
          </div>

          {noResults ? (
            <div className="text-center py-10">
              <p className="text-gray-400" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
                No results found.
              </p>
              <div
                onClick={() => navigate("/")}
                className="mt-4 bg-[#333] text-white px-6 py-3 rounded-lg hover:bg-[#444] cursor-pointer"
              >
                Browse Trending
              </div>
            </div>
          ) : (
            <>
              {/* Movies */}
              {movies.length > 0 && (
                <section className="mb-10">
                  <h3 className="text-[#FFD700] mb-4" style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
                    Movies
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} apiKey={apiKey} />
                    ))}
                  </div>
                </section>
              )}

              {/* TV Shows */}
              {tvShows.length > 0 && (
                <section className="mb-10">
                  <h3 className="text-[#FFD700] mb-4" style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
                    TV Shows
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {tvShows.map((show) => (
                      <ShowCard key={show.id} show={show} apiKey={apiKey} />
                    ))}
                  </div>
                </section>
              )}

              {/* People */}
              {people.length > 0 && (
                <section className="mb-4">
                  <h3 className="text-[#FFD700] mb-4" style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
                    People
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {people.map((person) => (
                      <Person key={person.id} person={person} />
                    ))}
                  </div>
                </section>
              )}

              
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
