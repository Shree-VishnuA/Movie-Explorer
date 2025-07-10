import Logo from "./Components/Logo";
import { Search } from "lucide-react";
import { useState } from "react";

function Navbar({ onSearch, UserSearch, setUserSearch }) {
  const [RecentSearches, setRecentSearches] = useState([]);
  const [isSearchFocused, setisSearchFocused] = useState(false);

  // Handle search functionality
  function handleSearch(searchQuery = UserSearch) {
    if (searchQuery === "") {
      alert("Please enter a movie name");
      return;
    }

    // Add to recent searches and keep only recent 5
    setRecentSearches(prevSearches => {
      const newSearches = [searchQuery, ...prevSearches.filter(search => search !== searchQuery)];
      return newSearches.slice(0, 5);
    });
    
    setUserSearch(searchQuery);
    setisSearchFocused(false);
    onSearch(searchQuery); // Call parent's search function
  }

  // Handle clicking on a recent search
  function handleRecentSearchClick(searchTerm) {
    setUserSearch(searchTerm);
    handleSearch(searchTerm);
  }

  return (
    <div className="flex justify-evenly items-center border-b-[1px] py-2">
      <div>
        <Logo></Logo>
      </div>
      <div className="flex flex-col relative">
        <div className="flex border p-3 rounded-full gap-2">
          <div>
            <input
              type="text"
              placeholder="Search Movies here"
              className="focus:outline-none"
              value={UserSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onFocus={() => setisSearchFocused(true)}
              onBlur={() => setTimeout(() => setisSearchFocused(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <div onClick={handleSearch} className="cursor-pointer">
            <Search></Search>
          </div>
        </div>
        
        {/* Recent Searches Dropdown  */}
        {isSearchFocused && RecentSearches.length > 0 && (
          <div className="absolute top-full w-full bg-white rounded-lg shadow-lg z-10 ">
            {RecentSearches.map((search, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer text-sm  hover:rounded-lg"
                onClick={() => handleRecentSearchClick(search)}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
              >
                {search}
              </div>
            ))}
          </div>
        )}
        {/* Recent Searches Dropdown  */}
      </div>
    </div>
  );
}

export default Navbar;