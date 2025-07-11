import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col">
            {/* Main Content Area */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            
            {/* Optional Footer Space */}
            <footer className="mt-auto py-4 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <p className="text-center text-sm text-gray-500">
                        © 2025 Movie App. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Layout;