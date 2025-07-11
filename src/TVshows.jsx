import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ShowCard from "./Components/ShowCard";

function Movies() {
  const [TVshows, setTVshows] = useState([]);
  const [loading, setLoading] = useState(true);
  const apikey = import.meta.env.VITE_TMDB_API_KEY;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingTVshows();
  }, []);

  async function fetchTrendingTVshows() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/tv/day?api_key=${apikey}`
      );
      const data = await response.json();
      setTVshows(data.results || data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TV-shows:", error);
      setLoading(false);
    }
  }

  // Go back to landing page
  function goBackToLanding() {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-amber-100">
      <button
        onClick={goBackToLanding}
        className="flex items-center gap-2 bg-gray-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base order-2 sm:order-1 self-start fixed top-25 left-3 z-50 "
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Home</span>
      </button>

      {loading ? (
        <div className="h-screen justify-center items-center flex flex-col sm:flex-row text-2xl sm:text-3xl lg:text-4xl w-full bg-amber-100 opacity-50 px-4 gap-4">
          <div className="text-center">Loading TV-Shows....</div>
          <div className="flex justify-center items-center animate-spin">
            <LoaderCircle className="h-8 w-8 sm:h-10 sm:w-10"></LoaderCircle>
          </div>
        </div>
      ) : (
        <div className="movie container w-screen px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex justify-center items-center py-2 font-bold text-violet-600">
              Trending TV-Shows
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Discover the most popular TV-Shows right now
            </p>
          </div>

          {TVshows.length === 0 ? (
            <div className="text-center p-6 sm:p-8">
              <p className="text-lg sm:text-xl text-gray-600 mb-4">
                No trending TV-Shows available at the moment.
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
                  {TVshows.filter((show) => show.vote_count > 0).length}{" "}
                  trending TV-Shows
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
               Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga dolorem neque nobis, praesentium voluptas harum eligendi quaerat corporis necessitatibus eveniet facilis voluptatibus, quasi ipsa itaque id nihil consectetur minus explicabo perspiciatis mollitia distinctio nemo vero veniam! Beatae laboriosam repudiandae incidunt veniam pariatur ea et rerum quos perferendis, repellendus voluptate quaerat libero eaque totam atque.xz
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Movies;
