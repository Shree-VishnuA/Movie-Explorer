import Navbar from "./Navbar";
import MovieCard from "./Components/MovieCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

function Landing() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [UserSearch, setUserSearch] = useState("");
  const navigate = useNavigate();
  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  async function fetchTrendingMovies() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${apikey}`
      );
      const data = await response.json();
      setMovies(data.results || data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  }

  function handleSearch(searchQuery) {
    if (!searchQuery || searchQuery.trim() === "") {
      alert("Please enter a movie name");
      return;
    }

    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  }

  return (
    <div className="min-h-screen bg-amber-100">
      <Navbar
        onSearch={handleSearch}
        UserSearch={UserSearch}
        setUserSearch={setUserSearch}
        setMovies={setMovies}
      />

      {loading ? (
        <div className="h-[calc(100vh-90px)] justify-center items-center flex flex-col sm:flex-row text-2xl sm:text-3xl lg:text-4xl w-full bg-amber-100 opacity-50 px-4 gap-4">
          <div className="text-center">Loading Info....</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10"></LoaderCircle>
          </div>
        </div>
      ) : (
        <div className="movie container w-screen sm:w-screen px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Trending Movies
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Discover the most popular movies right now
            </p>
          </div>

          {movies.length === 0 ? (
            <div className="text-center p-6 sm:p-8">
              <p className="text-lg sm:text-xl text-gray-600 mb-4">
                No trending movies available at the moment.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Refresh Page
              </button>
            </div>
          ) : (
            <div className="pb-8 sm:pb-12">
              <div className="mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  {movies.filter((movie) => movie.vote_count > 0).length}{" "}
                  trending movies
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
                {movies
                  .filter((movie) => movie.vote_count > 0)
                  .map((movie) => (
                    <div key={movie.id} className="flex-shrink-0 w-full max-w-sm sm:w-auto">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default Landing;