import Logo from "./Components/Logo";
import { Search, Menu, X as CloseIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "./AppContext";
import ThemeSelector from "./Components/ThemeSelector";

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
    setIsMobileMenuOpen(false);
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

  // Nav items with theme colors
  const navItems = [
    { to: "/", label: "Home", activeColor: "var(--text)" },
    { to: "/Movies", label: "Movies", activeColor: "var(--primary)" },
    { to: "/TVshows", label: "TV Shows", activeColor: "var(--secondary)" },
    { to: "/People", label: "People", activeColor: "var(--highlight)" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[9999] w-full text-theme shadow-lg"
      style={{
        backgroundColor: "var(--bg)",
        borderBottom: "1px solid rgba(var(--text-rgb), 0.2)",
      }}
    >
      {/* Desktop Navbar */}
      <div className="hidden md:flex  justify-between items-center py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-8">
          <Logo />
          <div className="flex items-center gap-3 lg:gap-5">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <div
                    className="px-2 py-1 cursor-pointer transition-all duration-300"
                    style={{
                      fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                      color: isActive
                        ? item.activeColor
                        : "rgba(var(--text-rgb), 0.7)",
                      fontWeight: isActive ? "600" : "400",
                      borderBottom: isActive
                        ? `2px solid ${item.activeColor}`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.color = item.activeColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.color =
                          "rgba(var(--text-rgb), 0.7)";
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <ThemeSelector />

        {/* Desktop Search */}
        <div
          className="flex flex-col border border-rgba(var(--text-rgb),0.5) rounded-lg relative w-60 sm:w-72 lg:w-90"
          ref={searchContainerRef}
        >
          <div
            className="flex items-center justify-between gap-2 p-2 rounded-xl"
            style={{
              backgroundColor: "var(--bg)",
              border: "1px solid rgba(var(--text-rgb), 0.3)",
            }}
          >
            <input
              type="text"
              placeholder="Search Movies, TV-Shows and People"
              className="flex-1 bg-transparent text-theme focus:outline-none"
              style={{
                fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
                "::placeholder": {
                  color: "rgba(var(--text-rgb), 0.5)",
                },
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
                className="p-1 cursor-pointer rounded-full transition-all duration-200"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    "rgba(var(--text-rgb), 0.2)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                aria-label="Clear search"
              >
                <CloseIcon
                  className="w-4 h-4 transition-colors duration-200"
                  style={{ color: "rgba(var(--text-rgb), 0.6)" }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(var(--text-rgb), 0.6)")
                  }
                />
              </div>
            )}

            {/* Search Button */}
            <div
              onClick={() => fetchSearchedMovies()}
              className="cursor-pointer p-1 rounded-full transition-all duration-200"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor =
                  "rgba(var(--secondary-rgb), 0.2)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            </div>
          </div>

          {/* Recent Searches Dropdown */}
          {isSearchFocused && RecentSearches.length > 0 && (
            <div
              className="absolute top-full w-full rounded-lg shadow-lg z-50 mt-1"
              style={{
                backgroundColor: "var(--bg)",
                border: "1px solid rgba(var(--text-rgb), 0.3)",
              }}
            >
              <div
                className="p-2 text-xs"
                style={{
                  color: "rgba(var(--text-rgb), 0.7)",
                  borderBottom: "1px solid rgba(var(--text-rgb), 0.2)",
                }}
              >
                Recent Searches
              </div>
              {RecentSearches.map((search, index) => (
                <div
                  key={index}
                  className={`p-3 text-sm cursor-pointer text-theme transition-all duration-200`}
                  style={{
                    backgroundColor:
                      index === highlightIndex
                        ? "rgba(var(--primary-rgb), 0.2)"
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (index !== highlightIndex) {
                      e.target.style.backgroundColor =
                        "rgba(var(--secondary-rgb), 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== highlightIndex) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
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
            className="p-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(var(--text-rgb), 0.2)",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(var(--text-rgb), 0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="w-6 h-6 text-secondary" />
            ) : (
              <Menu className="w-6 h-6 text-secondary" />
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="text-theme"
            style={{
              borderTop: "1px solid rgba(var(--text-rgb), 0.2)",
              backgroundColor: "var(--bg)",
            }}
          >
            {/* ✅ Mobile Theme Selector */}
            <div className="p-4 flex justify-center border-b border-[rgba(var(--text-rgb),0.2)]">
              <ThemeSelector />
            </div>
            
            {/* Mobile Search */}
            <div
              className="p-4"
              style={{ borderBottom: "1px solid rgba(var(--text-rgb), 0.2)" }}
              ref={searchContainerRef}
            >
              <div
                className="flex items-center gap-2 p-2 rounded-xl"
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid rgba(var(--text-rgb), 0.3)",
                }}
              >
                <input
                  type="text"
                  placeholder="Search Movies and TV-Shows"
                  className="flex-1 bg-transparent text-theme focus:outline-none"
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
                    className="p-1 cursor-pointer rounded-full transition-all duration-200"
                    style={{ backgroundColor: "transparent" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor =
                        "rgba(var(--text-rgb), 0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                    aria-label="Clear search"
                  >
                    <CloseIcon
                      className="w-4 h-4 transition-colors duration-200"
                      style={{ color: "rgba(var(--text-rgb), 0.6)" }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = "var(--text)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = "rgba(var(--text-rgb), 0.6)")
                      }
                    />
                  </div>
                )}

                {/* Search Button */}
                <div
                  onClick={() => fetchSearchedMovies()}
                  className="cursor-pointer p-2 rounded-full transition-all duration-200"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor =
                      "rgba(var(--secondary-rgb), 0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-secondary" />
                </div>
              </div>

              {/* Mobile Recent Searches */}
              {isSearchFocused && RecentSearches.length > 0 && (
                <div
                  className="absolute top-full left-0 w-full rounded-lg shadow-lg z-50 mt-1"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid rgba(var(--text-rgb), 0.3)",
                  }}
                >
                  <div
                    className="p-2 text-xs"
                    style={{
                      color: "rgba(var(--text-rgb), 0.7)",
                      borderBottom: "1px solid rgba(var(--text-rgb), 0.2)",
                    }}
                  >
                    Recent Searches
                  </div>
                  {RecentSearches.map((search, index) => (
                    <div
                      key={index}
                      className={`p-3 text-sm cursor-pointer text-theme transition-all duration-200`}
                      style={{
                        backgroundColor:
                          index === highlightIndex
                            ? "rgba(var(--primary-rgb), 0.2)"
                            : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (index !== highlightIndex) {
                          e.target.style.backgroundColor =
                            "rgba(var(--secondary-rgb), 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index !== highlightIndex) {
                          e.target.style.backgroundColor = "transparent";
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecentSearchClick(search);
                        setIsMobileMenuOpen(false);
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
                      className="block px-4 py-3 transition-all duration-300"
                      style={{
                        fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                        color: isActive
                          ? item.activeColor
                          : "rgba(var(--text-rgb), 0.7)",
                        fontWeight: isActive ? "600" : "400",
                        backgroundColor: isActive
                          ? "rgba(var(--text-rgb), 0.1)"
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = item.activeColor;
                          e.currentTarget.style.backgroundColor =
                            "rgba(var(--text-rgb), 0.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color =
                            "rgba(var(--text-rgb), 0.7)";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
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
