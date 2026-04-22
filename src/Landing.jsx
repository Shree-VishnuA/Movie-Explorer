import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "./AppContext";
import MovieCard from "./Components/MovieCard";
import ShowCard from "./Components/ShowCard";
import Person from "./Components/Person";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Search,
} from "lucide-react";

// --- Reusable Button ---
const Button = ({ children, className, onClick, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const PlayIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// --- Full-Screen Loader (Responsive) ---
const FullScreenLoader = ({ loading }) => (
  <AnimatePresence>
    {loading && (
      <motion.div
        initial={{ opacity: 0, scale: 0, borderRadius: 9999 }}
        animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-lg"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        <div className="relative w-16 h-16 sm:w-24 sm:h-24">
          <div
            className="absolute inset-0 rounded-full border-4 sm:border-6 border-l-transparent border-r-transparent animate-spin-slow"
            style={{
              borderTopColor: "var(--primary)",
              borderBottomColor: "var(--secondary)",
            }}
          ></div>
          <div
            className="absolute inset-4 sm:inset-6 rounded-full animate-pulse-glow"
            style={{ backgroundColor: "var(--primary)" }}
          ></div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Modal Wrapper (Responsive) ---
const ModalWrapper = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4 sm:px-6"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    onClick={onClose}
  >
    <div
      className="relative rounded-xl shadow-xl w-full max-w-4xl sm:max-h-[90vh] max-h-[85vh] overflow-y-auto hide-scrollbar animate-fadeInScale p-4 sm:p-6"
      style={{
        backgroundColor: "var(--bg)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      <div className="flex justify-center mt-4 text-xs text-theme">
        Click to know more
      </div>
    </div>
  </div>
);

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);

  const { apiKey } = useAppContext();

  async function fetchTv() {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await res.json();
    setTvShows(
      data.results
        .filter((s) => s.poster_path)
        .slice(0, 5)
        .map((s) => ({
          id: s.id,
          title: s.name,
          poster: `https://image.tmdb.org/t/p/w500${s.poster_path}`,
          rating: s.vote_average.toFixed(1),
          year: s.first_air_date?.split("-")[0] || "N/A",
        }))
    );
  }

  async function fetchMovies() {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await res.json();
    setMovies(
      data.results
        .filter((m) => m.poster_path)
        .slice(0, 5)
        .map((m) => ({
          id: m.id,
          title: m.title,
          poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          rating: m.vote_average.toFixed(1),
          year: m.release_date?.split("-")[0] || "N/A",
        }))
    );
  }

  async function fetchPeople() {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await res.json();
    setPeople(
      data.results
        .filter((p) => p.profile_path)
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          name: p.name,
          profile: `https://image.tmdb.org/t/p/w500${p.profile_path}`,
          knownFor:
            p.known_for
              ?.map((k) => k.title || k.name)
              .slice(0, 2)
              .join(", ") || "Actor",
        }))
    );
  }

  // Fetch Movies
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      await Promise.all([fetchMovies(), fetchPeople(), fetchTv()]);
      setLoading(false);
    }
    fetchAll();
  }, [apiKey]);

  useEffect(() => {
    if (selectedItem) {
      // Disable background scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll when modal is closed
      document.body.style.overflow = "";
    }

    // Cleanup in case component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  // Fetch Item Details (Loader enabled)
  const fetchItemDetails = async (id, type) => {
    setLoading(true);
    try {
      let url = "";
      if (type === "movie") {
        url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
      } else if (type === "tv") {
        url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`;
      } else if (type === "person") {
        url = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=en-US`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setSelectedItem(data);
      setSelectedType(type);
    } catch (error) {
      console.error("Failed to fetch details:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  return (
    <div className="min-h-screen bg-theme text-theme flex flex-col">
      <FullScreenLoader loading={loading} />

      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
        {/* Hero Section */}
        <div className="py-10 text-center">
          <div className="font-bold mb-4 text-[clamp(2rem,3vw,3.5rem)]">
            Discover <span className="text-primary">Movies</span>,{" "}
            <span className="text-secondary">TV Shows</span> &{" "}
            <span className="text-highlight">Famous People</span> Instantly
          </div>
          <p
            className="max-w-4xl mx-auto mb-8 text-[clamp(0.9rem,2vw,1.2rem)]"
            style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.7)" }}
          >
            Browse trending titles, explore cast details, and stay updated — all
            powered by <span style={{ color: "var(--secondary)" }}>TMDB</span>.
          </p>
          <Button
            className="text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: "var(--primary)",
              border: "1px solid var(--primary)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "var(--primary)";
              e.target.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "var(--primary)";
              e.target.style.opacity = "1";
            }}
            onClick={() => window.scrollTo({ top: 280, behavior: "smooth" })}
          >
            Explore Now
          </Button>
        </div>

        {/* Sections */}
        <Section
          title="Featured Movies"
          items={movies}
          type="movie"
          hint="Click on a movie to know more"
          onSelect={(item) => fetchItemDetails(item.id, "movie")}
        />
        <Section
          title="Trending TV Shows"
          items={tvShows}
          type="tv"
          hint="Click on a TV show to know more"
          onSelect={(item) => fetchItemDetails(item.id, "tv")}
        />
        <Section
          title="Famous People"
          items={people}
          type="person"
          hint="Click on a person to know more"
          onSelect={(item) => fetchItemDetails(item.id, "person")}
          isPerson
        />
      </div>

      {/* Modals */}
      {selectedItem && selectedType === "movie" && (
        <ModalWrapper onClose={clearSelection}>
          <MovieCard movie={selectedItem} apiKey={apiKey} />
        </ModalWrapper>
      )}
      {selectedItem && selectedType === "tv" && (
        <ModalWrapper onClose={clearSelection}>
          <ShowCard show={selectedItem} apiKey={apiKey} />
        </ModalWrapper>
      )}
      {selectedItem && selectedType === "person" && (
        <ModalWrapper onClose={clearSelection}>
          <Person person={selectedItem} apiKey={apiKey} />
        </ModalWrapper>
      )}

      <Footer />
    </div>
  );
}

// --- Section (Responsive with hint text) ---
const Section = ({ title, items, type, onSelect, isPerson, hint }) => {
  const getLink = () => {
    if (type === "movie") return "/movies";
    if (type === "tv") return "/tvshows";
    if (type === "person") return "/people";
    return "/";
  };

  return (
    <div className="pb-10">
      {/* Heading + View More */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h2 className="font-bold text-[clamp(1.5rem,3vw,2rem)] text-center sm:text-left text-theme">
          {title}
        </h2>
        <Link
          to={getLink()}
          className="text-sm text-primary hover:text-highlight mt-2 sm:mt-0 text-center sm:text-right transition-colors duration-200"
        >
          View More →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer group hover:scale-105 transition-transform"
            onClick={() => onSelect(item)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={isPerson ? item.profile : item.poster}
                alt={item.name || item.title}
                className="w-full aspect-[2/3] object-cover group-hover:brightness-110"
              />
              {/* Always show info on mobile, hover-only on larger screens */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent 
    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold line-clamp-2">
                    {item.title || item.name}
                  </h3>
                  {!isPerson && (
                    <div className="flex justify-between items-center text-sm text-gray-300">
                      <span>{item.year}</span>
                      <span className="flex items-center gap-1">
                        <StarIcon className="w-3 h-3 text-highlight" />
                        {item.rating}
                      </span>
                    </div>
                  )}
                  {isPerson && (
                    <p className="text-gray-300 text-xs sm:text-sm">
                      {item.knownFor}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p
        className="text-xs italic mt-3 text-center"
        style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.6)" }}
      >
        {hint}
      </p>
    </div>
  );
};

// --- Footer ---
const Footer = () => (
  <footer
    className="py-12 px-4 sm:px-6 lg:px-8"
    style={{
      backgroundColor: "var(--bg)",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    }}
  >
    <div className="max-w-7xl mx-auto flex flex-wrap justify-evenly gap-8 text-center sm:text-left">
      {/* Logo and About */}
      <div className="flex-1 min-w-[250px]">
        <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
          <div className="relative">
            {/* Main Logo Icon */}
            <Film
              className="w-7 h-7 sm:w-8 sm:h-8 text-primary"
              style={{ filter: "drop-shadow(0 0 6px var(--primary))" }}
            />
            {/* Search Icon Overlay */}
            <Search
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary absolute -bottom-1 -right-1 rounded-full p-0.5"
              style={{
                backgroundColor: "var(--bg)",
                filter: "drop-shadow(0 0 4px var(--secondary))",
              }}
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-theme">
            Movie<span className="text-primary">Hunt</span>
          </span>
        </div>
        <p
          className="text-sm sm:text-base mb-4 max-w-sm mx-auto sm:mx-0"
          style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.7)" }}
        >
          Your ultimate destination for discovering Movies, TV shows and People.
          Powered by TMDB.
        </p>
        <div className="flex justify-center sm:justify-start space-x-4">
          <Facebook
            className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer transition-colors duration-200"
            style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.7)" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
            onMouseLeave={(e) =>
              (e.target.style.color =
                "rgba(var(--text-rgb, 255, 255, 255), 0.7)")
            }
          />
          <Twitter
            className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer transition-colors duration-200"
            style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.7)" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
            onMouseLeave={(e) =>
              (e.target.style.color =
                "rgba(var(--text-rgb, 255, 255, 255), 0.7)")
            }
          />
          <Instagram
            className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer transition-colors duration-200"
            style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.7)" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
            onMouseLeave={(e) =>
              (e.target.style.color =
                "rgba(var(--text-rgb, 255, 255, 255), 0.7)")
            }
          />
          <Youtube
            className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer transition-colors duration-200"
            style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.7)" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
            onMouseLeave={(e) =>
              (e.target.style.color =
                "rgba(var(--text-rgb, 255, 255, 255), 0.7)")
            }
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex-1 min-w-[150px] text-center sm:text-left">
        <h3 className="text-theme font-semibold mb-4 text-base sm:text-lg">
          Quick Links
        </h3>
        <ul className="space-y-2 text-sm sm:text-base">
          <li>
            <Link
              to="/movies"
              className="transition-colors duration-200"
              style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.7)" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
              onMouseLeave={(e) =>
                (e.target.style.color =
                  "rgba(var(--text-rgb, 255, 255, 255), 0.7)")
              }
            >
              Movies
            </Link>
          </li>
          <li>
            <Link
              to="/tvshows"
              className="transition-colors duration-200"
              style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.7)" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
              onMouseLeave={(e) =>
                (e.target.style.color =
                  "rgba(var(--text-rgb, 255, 255, 255), 0.7)")
              }
            >
              TV Shows
            </Link>
          </li>
          <li>
            <Link
              to="/people"
              className="transition-colors duration-200"
              style={{ color: "rgba(var(--text-rgb, 255, 255, 255), 0.7)" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--primary)")}
              onMouseLeave={(e) =>
                (e.target.style.color =
                  "rgba(var(--text-rgb, 255, 255, 255), 0.7)")
              }
            >
              People
            </Link>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div
      className="mt-8 pt-4 text-center text-xs sm:text-sm"
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        color: "rgba(var(--text-rgb, 255, 255, 255), 0.5)",
      }}
    >
      © {new Date().getFullYear()} MovieHunt. All rights reserved. Powered by
      TMDB API.
    </div>
  </footer>
);

export default LandingPage;
