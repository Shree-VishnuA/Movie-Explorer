import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [UserSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(searchQuery) {
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  }

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col">
      {/* Optional Navbar (kept for future use) */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="py-10 sm:py-12 lg:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-violet-600 mb-4">
            Coming Soon
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto px-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
            quisquam, amet neque aliquam minus inventore tenetur doloremque
            earum saepe. Aperiam necessitatibus impedit harum ut, deserunt
            doloremque? Eius, cumque, optio provident at in maxime ipsa fugit
            enim a mollitia illo quasi odio expedita voluptate? Porro explicabo,
            eaque voluptate eligendi tempora fuga.
          </p>
        </div>

        {/* Subheading */}
        <div className="pb-10 sm:pb-12 text-center">
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Stay tuned for upcoming movies and shows!
          </p>
        </div>

        {/* Placeholder for Future Content */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 pb-12">
          {/* Movie Cards will be added here later */}
          <div className="w-40 h-56 sm:w-48 sm:h-64 bg-gray-300 rounded-lg shadow-md flex items-center justify-center text-gray-500 text-sm sm:text-base">
            Placeholder 1
          </div>
          <div className="w-40 h-56 sm:w-48 sm:h-64 bg-gray-300 rounded-lg shadow-md flex items-center justify-center text-gray-500 text-sm sm:text-base">
            Placeholder 2
          </div>
          <div className="w-40 h-56 sm:w-48 sm:h-64 bg-gray-300 rounded-lg shadow-md flex items-center justify-center text-gray-500 text-sm sm:text-base">
            Placeholder 3
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
