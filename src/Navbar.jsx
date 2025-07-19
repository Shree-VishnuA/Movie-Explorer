import Logo from "./Components/Logo";
import { Search, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Navbar({ onSearch, UserSearch, setUserSearch = () => {} }) {
  const [RecentSearches, setRecentSearches] = useState([]);
  const [isSearchFocused, setisSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu when window is resized to larger screen
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    setIsMobileMenuOpen(false); // Close mobile menu after search
    onSearch(searchQuery); 
  }

  // Handle clicking on a recent search
  function handleRecentSearchClick(searchTerm) {
    setUserSearch(searchTerm);
    fetchSearchedMovies(searchTerm);
  }

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/Movies", label: "Movies" },
    { to: "/TVshows", label: "TV Shows" },
    { to: "/People", label: "People" },
  ];

  return (
    <nav className="bg-amber-100 border-b-[1px] fixed top-0 left-0 right-0 z-50 w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8">
        {/* Logo and Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {({isActive}) => (
                  <div
                    className={`p-2 hover:cursor-pointer hover:scale-102 hover:opacity-90 transition-all duration-200 text-sm lg:text-base ${
                      isActive ? "text-stone-800 font-semibold border-b-2" : "text-gray-700 "
                    }`}
                  >
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex flex-col relative w-64 lg:w-90 max-w-md "
          ref={searchContainerRef}
        >
          <div className="flex border border-gray-300 p-2 sm:p-3 rounded-full gap-2 justify-center items-center w-full bg-white">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search Movies,TV-Shows and People"
                className="focus:outline-none w-full text-sm sm:text-base px-2 bg-transparent"
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
              className="cursor-pointer hover:bg-gray-100 p-1 rounded-full flex-shrink-0 transition-colors duration-200"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
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
                  className="p-3 hover:bg-gray-100 cursor-pointer text-sm hover:rounded-lg break-words transition-colors duration-200"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  {search}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex justify-between items-center py-3 px-4">
          <div className="">
            <Logo />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-amber-200 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-amber-50">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200">
              <div
                className="flex flex-col relative"
                ref={searchContainerRef}
              >
                <div className="flex border border-gray-300 p-3 rounded-full gap-2 justify-center items-center w-full bg-white">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search Movies and TV-Shows"
                      className="focus:outline-none w-full text-base px-2 bg-transparent"
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
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-full flex-shrink-0 transition-colors duration-200"
                  >
                    <Search className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                {/* Mobile Recent Searches */}
                {isSearchFocused && RecentSearches.length > 0 && (
                  <div className="absolute top-full w-full bg-white rounded-lg shadow-lg z-10 border mt-1">
                    <div className="p-2 text-xs text-gray-500 border-b">
                      Recent Searches
                    </div>
                    {RecentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-gray-100 cursor-pointer text-sm hover:rounded-lg break-words transition-colors duration-200"
                        onClick={() => handleRecentSearchClick(search)}
                      >
                        {search}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="py-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {({isActive}) => (
                    <div
                      className={`block px-4 py-3 text-base hover:bg-amber-200 transition-colors duration-200 ${
                        isActive ? "text-stone-800 font-semibold bg-amber-200" : "text-gray-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;