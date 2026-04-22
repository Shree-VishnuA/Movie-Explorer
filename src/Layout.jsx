import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import { AppProvider } from "./AppContext";
import ScrollToTop from "./Components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeSelector from "./Components/ThemeSelector";

function Layout() {
  const [UserSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(searchQuery) {
    if (!searchQuery.trim()) return;
    navigate(`/search/${encodeURIComponent(searchQuery)}`);
  }

  return (
    <ThemeProvider>
      <AppProvider>
        <div className="min-h-screen bg-theme flex flex-col overflow-x-hidden text-theme">
          <ScrollToTop />
          <Navbar
            onSearch={handleSearch}
            UserSearch={UserSearch}
            setUserSearch={setUserSearch}
          />
          <div className="p-4">
            <ThemeSelector />
          </div>
          <main className="flex-1 w-full mt-16 sm:mt-20 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
            <div className="max-w-[1400px] mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}

export default Layout;
