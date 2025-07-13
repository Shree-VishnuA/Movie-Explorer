import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AppProvider } from "./AppContext";

function Layout() {
  const [UserSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(searchQuery) {
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <Navbar
        onSearch={handleSearch}
        UserSearch={UserSearch}
        setUserSearch={setUserSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full mt-20">
        <AppProvider>
          <Outlet />
        </AppProvider>
      </main>

      {/* Optional Footer Space */}
      <footer className="mt-auto py-4 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-gray-500">
            © 2025 MovieHunt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
