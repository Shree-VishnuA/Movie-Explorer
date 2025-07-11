import Logo from "./Components/Logo";
import { Search } from "lucide-react";
import { useState } from "react";

function Navbar({ onSearch, UserSearch, setUserSearch }) {
  const [RecentSearches, setRecentSearches] = useState([]);
  const [isSearchFocused, setisSearchFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const apikey = import.meta.env.VITE_TMDB_API_KEY; // Changed to match your env format

  // searching movie when user uses search bar
  async function fetchSearchedMovies(searchQuery = UserSearch) {
    if (!searchQuery || searchQuery.trim() === "") {
      alert("Please enter a movie name");
      return;
    }

    setLoading(true);

    try {
      // Add to recent searches before navigation
      setRecentSearches((prevSearches) => {
        const newSearches = [
          searchQuery,
          ...prevSearches.filter((search) => search !== searchQuery),
        ];
        return newSearches.slice(0, 5);
      });

      setisSearchFocused(false);
      onSearch(searchQuery); // This will now navigate to search page
    } catch (error) {
      console.log("Error finding this movie", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle clicking on a recent search
  function handleRecentSearchClick(searchTerm) {
    setUserSearch(searchTerm);
    fetchSearchedMovies(searchTerm);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:justify-evenly items-center border-b-[1px] py-2 px-4 sm:px-6 lg:px-8 gap-4 sm:gap-2 bg-amber-100">
      {/* Logo Section */}
      <div className="flex-shrink-0 order-1 sm:order-1">
        <Logo />
      </div>

      {/* Search Section */}
      <div className="flex flex-col relative w-full sm:w-auto max-w-md sm:max-w-lg lg:max-w-xl order-2 sm:order-2">
        <div className="flex border p-2 sm:p-3 rounded-full gap-2 justify-center items-center w-full">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search Movies here"
              className="focus:outline-none w-full text-sm sm:text-base px-2 sm:px-0"
              value={UserSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onFocus={() => setisSearchFocused(true)}
              onBlur={() => setTimeout(() => setisSearchFocused(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchSearchedMovies();
                }
              }}
            />
          </div>
          <div
            onClick={() => fetchSearchedMovies()}
            className="cursor-pointer hover:bg-gray-100 p-1 rounded flex-shrink-0"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Recent Searches Dropdown */}
        {isSearchFocused && RecentSearches.length > 0 && (
          <div className="absolute top-full w-full bg-white rounded-lg shadow-lg z-10 border mt-1">
            <div className="p-2 text-xs text-gray-500 border-b">
              Recent Searches
            </div>
            {RecentSearches.map((search, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer text-sm hover:rounded-lg break-words"
                onClick={() => handleRecentSearchClick(search)}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
              >
                {search}
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Navbar;
