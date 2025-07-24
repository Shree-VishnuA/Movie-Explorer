import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "./AppContext";

function LandingPage() {
  const [UserSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(searchQuery) {
    if (!searchQuery.trim()) return;
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white flex flex-col">
      {/* Navbar */}
      <Navbar
        onSearch={handleSearch}
        UserSearch={UserSearch}
        setUserSearch={setUserSearch}
      />

      {/* Main Container */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
        {/* Heading Section */}
        <div className="py-8 sm:py-12 lg:py-16 text-center">
          <h1
            className="font-extrabold text-[#f67c02] mb-4 leading-tight"
            style={{
              fontSize: "clamp(1.875rem, 4vw, 4rem)", // Smooth scaling from ~30px to ~64px
            }}
          >
            Coming Soon
          </h1>
          <p
            className="text-[#B3B3B3] leading-relaxed max-w-4xl mx-auto px-2"
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1.5rem)", // Smooth scaling from ~14px to ~24px
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
            quisquam, amet neque aliquam minus inventore tenetur doloremque
            earum saepe. Aperiam necessitatibus impedit harum ut, deserunt
            doloremque? Eius, cumque, optio provident at in maxime ipsa fugit
            enim a mollitia illo quasi odio expedita voluptate? Porro explicabo,
            eaque voluptate eligendi tempora fuga.
          </p>
        </div>

        {/* Subheading */}
        <div className="pb-8 sm:pb-12 text-center">
          <p
            className="text-[#FFD700]"
            style={{
              fontSize: "clamp(0.75rem, 1.5vw, 1.125rem)", // Smooth scaling
            }}
          >
            Stay tuned for upcoming movies and shows!
          </p>
        </div>

        {/* Responsive Placeholder Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 pb-12 justify-items-center">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] aspect-[2/3] bg-[#1A1A1F] rounded-lg shadow-md flex items-center justify-center text-[#B3B3B3] hover:scale-105 transition-transform"
              style={{
                fontSize: "clamp(0.75rem, 1.5vw, 1rem)", // Smooth text scaling
              }}
            >
              Placeholder {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
