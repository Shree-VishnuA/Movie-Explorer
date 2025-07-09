import Logo from "./Components/Logo";
import { Search } from "lucide-react";
import MovieCard from "./MovieCard";
import { useState, useEffect } from "react";

function Landing() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch("YOUR_API_ENDPOINT");
      const data = await response.json();
      setMovies(data.results || data); // adjust based on your API response structure
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading movies...</div>;
  }

  return (
    <div className=" ">
      {/* navbar */}
      <div className="flex justify-evenly items-center border-b-[1px] py-2">
        <div>
          <Logo></Logo>
        </div>
        <div className="flex border p-3 rounded-full gap-2">
          <div>
            <input
              type="text"
              placeholder="Search Movies here"
              className="focus:outline-none"
            />
          </div>
          <div>
            <Search></Search>
          </div>
        </div>
      </div>
      {/* navbar */}
      {/* Trending Movies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
        />
      ))}
    </div>
    </div>
  );
}

export default Landing;
