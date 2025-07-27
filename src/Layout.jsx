import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import { AppProvider } from "./AppContext";

function Layout() {
  const [UserSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(searchQuery) {
    if (!searchQuery.trim()) return;
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0D0D0F] flex flex-col overflow-x-hidden text-white">
        {/* Navbar */}
        <Navbar
          onSearch={handleSearch}
          UserSearch={UserSearch}
          setUserSearch={setUserSearch}
        />

        {/* Main Content */}
        <main className="flex-1 w-full mt-16 sm:mt-20 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>

        
      </div>
    </AppProvider>
  );
}

export default Layout;
