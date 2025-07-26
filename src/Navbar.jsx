import Logo from "./Components/Logo";
import { Search, Menu, X as CloseIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "./AppContext";

function Navbar({ onSearch, UserSearch, setUserSearch = () => {} }) {
  const { RecentSearches, setRecentSearches } = useAppContext();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const searchContainerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsSearchFocused(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Auto-close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function fetchSearchedMovies(searchQuery = UserSearch) {
    if (!searchQuery.trim()) return;
    setRecentSearches((prev) => {
      const updated = [searchQuery, ...prev.filter((s) => s !== searchQuery)];
      return updated.slice(0, 5);
    });
    setIsSearchFocused(false);
    setHighlightIndex(-1);
    onSearch(searchQuery);
  }

  function handleRecentSearchClick(searchTerm) {
    setUserSearch(searchTerm);
    fetchSearchedMovies(searchTerm);
  }

  // Keyboard navigation for search dropdown
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && RecentSearches[highlightIndex]) {
        handleRecentSearchClick(RecentSearches[highlightIndex]);
      } else {
        fetchSearchedMovies();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (RecentSearches.length > 0) {
        setHighlightIndex((prev) => (prev + 1) % RecentSearches.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (RecentSearches.length > 0) {
        setHighlightIndex(
          (prev) => (prev - 1 + RecentSearches.length) % RecentSearches.length
        );
      }
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      setHighlightIndex(-1);
    }
  }

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/Movies", label: "Movies" },
    { to: "/TVshows", label: "TV Shows" },
    { to: "/People", label: "People" },
  ];

  return (
    <nav className="bg-[#0D0D0F] border-b border-[#1A1A1F] fixed top-0 left-0 right-0 z-[9999] w-full text-white shadow-lg">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-8">
          <Logo />
          <div className="flex items-center gap-3 lg:gap-5">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <div
                    className="px-2 py-1 cursor-pointer transition-all duration-200"
                    style={{
                      fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                      color: isActive ? "#00FFFF" : "#B3B3B3",
                      fontWeight: isActive ? "600" : "400",
                      borderBottom: isActive ? "2px solid #f67c02" : "none",
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Desktop Search */}
        <div
          className="flex flex-col relative w-60 sm:w-72 lg:w-90"
          ref={searchContainerRef}
        >
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#1A1A1F] border border-[#333]">
            <input
              type="text"
              placeholder="Search Movies, TV-Shows and People"
              className="flex-1 bg-transparent text-white placeholder-[#777] focus:outline-none"
              style={{
                fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
              }}
              value={UserSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
            />

            {/* Clear Button */}
            {UserSearch && (
              <div
                onClick={() => {
                  setUserSearch("");
                  setHighlightIndex(-1);
                }}
                className="p-1 cursor-pointer hover:bg-[#333] rounded-full transition-colors duration-200"
                aria-label="Clear search"
              >
                <CloseIcon className="w-4 h-4 text-gray-400 hover:text-white" />
              </div>
            )}

            {/* Search Button */}
            <div
              onClick={() => fetchSearchedMovies()}
              className="cursor-pointer hover:bg-[#333] p-1 rounded-full transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#00FFFF]" />
            </div>
          </div>

          {/* Recent Searches Dropdown */}
          {isSearchFocused && RecentSearches.length > 0 && (
            <div className="absolute top-full w-full bg-[#1A1A1F] rounded-lg shadow-lg z-50 border border-[#333] mt-1">
              <div className="p-2 text-xs text-[#B3B3B3] border-b border-[#333]">
                Recent Searches
              </div>
              {RecentSearches.map((search, index) => (
                <div
                  key={index}
                  className={`p-3 text-sm cursor-pointer text-white transition-colors duration-200 ${
                    index === highlightIndex ? "bg-[#333]" : "hover:bg-[#333]"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent dropdown close before click
                    handleRecentSearchClick(search);
                  }}
                >
                  {search}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        <div className="flex justify-between items-center py-3 px-4">
          <Logo />
          <div
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-[#1A1A1F] transition-colors duration-200 border-[1px] border-white/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="w-6 h-6 text-[#00FFFF]" />
            ) : (
              <Menu className="w-6 h-6 text-[#00FFFF]" />
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-[#1A1A1F] bg-[#0D0D0F] text-white">
            {/* Mobile Search */}
            <div
              className="p-4 border-b border-[#1A1A1F]"
              ref={searchContainerRef}
            >
              <div className="flex items-center gap-2 p-2 border border-[#333] rounded-xl bg-[#1A1A1F]">
                <input
                  type="text"
                  placeholder="Search Movies and TV-Shows"
                  className="flex-1 bg-transparent text-white placeholder-[#777] focus:outline-none"
                  style={{
                    fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                  }}
                  value={UserSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleKeyDown}
                />

                {/* Clear Button */}
                {UserSearch && (
                  <div
                    onClick={() => {
                      setUserSearch("");
                      setHighlightIndex(-1);
                    }}
                    className="p-1 cursor-pointer hover:bg-[#333] rounded-full transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <CloseIcon className="w-4 h-4 text-gray-400 hover:text-white" />
                  </div>
                )}

                {/* Search Button */}
                <div
                  onClick={() => fetchSearchedMovies()}
                  className="cursor-pointer hover:bg-[#333] p-2 rounded-full transition-colors duration-200"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-[#00FFFF]" />
                </div>
              </div>

              {/* Mobile Recent Searches */}
              {isSearchFocused && RecentSearches.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#1A1A1F] rounded-lg shadow-lg z-50 border border-[#333] mt-1">
                  <div className="p-2 text-xs text-[#B3B3B3] border-b border-[#333]">
                    Recent Searches
                  </div>
                  {RecentSearches.map((search, index) => (
                    <div
                      key={index}
                      className={`p-3 text-sm cursor-pointer text-white transition-colors duration-200 ${
                        index === highlightIndex
                          ? "bg-[#333]"
                          : "hover:bg-[#333]"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecentSearchClick(search);
                        setIsMobileMenuOpen(false); // Close menu after selection
                      }}
                    >
                      {search}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Nav Links */}
            <div className="py-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {({ isActive }) => (
                    <div
                      className="block px-4 py-3 transition-colors duration-200"
                      style={{
                        fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                        color: isActive ? "#00FFFF" : "#B3B3B3",
                        fontWeight: isActive ? "600" : "400",
                        backgroundColor: isActive ? "#1A1A1F" : "transparent",
                      }}
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
