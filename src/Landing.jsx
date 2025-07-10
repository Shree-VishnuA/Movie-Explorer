import Navbar from "./Navbar";
import MovieCard from "./Components/MovieCard";
import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

function Landing() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [UserSearch, setUserSearch] = useState("");
  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  // fetching trending movies
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

  // searching movie when user uses search bar
  async function fetchSearchedMovies(searchQuery) {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=${apikey}&query=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      console.log(data);
      setMovies(data.results || []);
      setLoading(false);
    } catch (error) {
      console.log("Error finding this movie", error);
      setLoading(false);
    }
  }

  return (
    <div className=" ">
      

      {/* Trending Movies */}
      {loading ? (
        <div className="h-[calc(100vh-90px)] justify-center items-center flex text-4xl w-full bg-amber-100 opacity-50">
          <div> Loading Info....</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-10 w-10"></LoaderCircle>
          </div>
        </div>
      ) : (
        <div className="movie container">
          <p className="text-4xl text-center font-">Trending Movies</p>
          <div className="flex flex-wrap gap-y-4 p-4 justify-evenly">
            {movies
              .filter((movie) => movie.vote_count > 0)
              .map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
          </div>
        </div>
      )}
      {/* Trending Movies */}
    </div>
  );
}

export default Landing;
