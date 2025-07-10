import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout(){

    return(
        <div className="flex flex-col">
            <Navbar></Navbar>
            <div className=""><Outlet></Outlet></div>

        </div>
    )
}
export default Layout