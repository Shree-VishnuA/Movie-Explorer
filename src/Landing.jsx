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
      

      {/* Same structure */}
      <div className="movie container w-screen px-4 sm:px-6 lg:px-8">
        <div className="py-6 sm:py-8 lg:py-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex justify-center items-center py-2 font-bold text-violet-600">
            Coming soon
          </h1>
          <p className="text-sm sm:text-base text-gray-600 text-center">
           Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo quisquam, amet neque aliquam minus inventore tenetur doloremque earum saepe. Aperiam necessitatibus impedit harum ut, deserunt doloremque? Eius, cumque, optio provident at in maxime ipsa fugit enim a mollitia illo quasi odio expedita voluptate? Porro explicabo, eaque voluptate eligendi tempora fuga.
          </p>
        </div>

        <div className="pb-8 sm:pb-12">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Ready for content
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
            {/* Movie Cards */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;