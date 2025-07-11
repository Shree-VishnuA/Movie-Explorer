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
    <div className="min-h-screen bg-amber-100">
      

      {/* Empty Movies Space - Keep the exact same structure as before */}
      <div className="movie container w-screen px-4 sm:px-6 lg:px-8">
        <div className="py-6 sm:py-8 lg:py-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex justify-center items-center py-2 font-bold text-violet-600">
            Featured Content
          </h1>
          <p className="text-sm sm:text-base text-gray-600 text-center">
            Coming soon - Featured movies and recommendations
          </p>
        </div>

        {/* Empty space where movies used to be */}
        <div className="pb-8 sm:pb-12">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-gray-600 text-center">
              This space is ready for content
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
            {/* Empty - where movie cards used to be */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;