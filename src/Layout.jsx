import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import { AppProvider } from "./AppContext";

function Layout() {
  const [UserSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(searchQuery) {
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-amber-50 flex flex-col overflow-x-hidden">
        {/* Navbar */}
        <Navbar
          onSearch={handleSearch}
          UserSearch={UserSearch}
          setUserSearch={setUserSearch}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full mt-16 sm:mt-20 px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-3 sm:py-4 px-3 sm:px-4 md:px-6 lg:px-8 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs sm:text-sm text-gray-500">
              © 2025 MovieHunt. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default Layout;
