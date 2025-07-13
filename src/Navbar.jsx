import Logo from "./Components/Logo";
import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Navbar({ onSearch, UserSearch, setUserSearch }) {
  const [RecentSearches, setRecentSearches] = useState([]);
  const [isSearchFocused, setisSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // for clicks outside the search bar
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setisSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // searching movie entered by user
  function fetchSearchedMovies(searchQuery = UserSearch) {
    if (!searchQuery || searchQuery.trim() === "") {
      alert("Please enter a movie name");
      return;
    }

    // Add to recent searches before fetching
    setRecentSearches((prevSearches) => {
      const newSearches = [
        searchQuery,
        ...prevSearches.filter((search) => search !== searchQuery),
      ];
      return newSearches.slice(0, 5);
    });

    setisSearchFocused(false);
    onSearch(searchQuery); 
  }

  // Handle clicking on a recent search
  function handleRecentSearchClick(searchTerm) {
    setUserSearch(searchTerm);
    fetchSearchedMovies(searchTerm);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:justify-between items-center border-b-[1px] py-1 px-4 sm:px-6 lg:px-8 gap-4 sm:gap-2 bg-amber-100 fixed z-100 w-screen">
      {/* Logo  */}
      <div className="flex gap-10 justify-center items-center">
        <div className="flex-shrink-0">
          <Logo />
        </div>
        <NavLink to={"/"}>
          {({isActive}) => (
            <div
              className={` p-2 rounded-lg hover:cursor-pointer hover:scale-102 hover:opacity-90 ${isActive?"text-stone-800" :""}`}
            >
              Home
            </div>
          )}
        </NavLink>
        <NavLink to={"Movies"}>
          {({isActive}) => (
            <div
              className={`p-2 rounded-lg hover:cursor-pointer hover:scale-102 hover:opacity-90 ${isActive?"text-stone-800" :""}`}
            >
              Movies
            </div>
          )}
        </NavLink>
        <NavLink to={"TVshows"}>
          {({isActive}) => (
            <div
              className={`p-2 rounded-lg hover:cursor-pointer hover:scale-102 hover:opacity-90 ${isActive?"text-stone-800" :""}`}
            >
              TV Shows
            </div>
          )}
        </NavLink>
        <NavLink to={"People"}>
          {({isActive}) => (
            <div
              className={`p-2 rounded-lg hover:cursor-pointer hover:scale-102 hover:opacity-90 ${isActive?"text-stone-800 " :""}`}
            >
             People
            </div>
          )}
        </NavLink>
      </div>

      {/* Search bar */}
      <div
        className="flex flex-col relative sm:w-80 max-w-md sm:max-w-lg lg:max-w-xl"
        ref={searchContainerRef}
      >
        <div className="flex border p-2 sm:p-3 rounded-full gap-2 justify-center items-center w-full">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search Movies and TV-Shows here"
              className="focus:outline-none w-full text-sm sm:text-base px-2 sm:px-0"
              value={UserSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onFocus={() => setisSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchSearchedMovies();
                }
                if (e.key === "Escape") {
                  setisSearchFocused(false);
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
