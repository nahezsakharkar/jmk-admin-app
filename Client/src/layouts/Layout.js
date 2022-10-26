import { Fragment } from "react";
import { Outlet } from "react-router-dom";

// components ------------------------------------
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';

const Layout = () => {
    return (
        <Fragment>
            <div className="home">
                <Header />
                <div className="homeContent">
                    <Sidebar />
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </Fragment>
    )
}

export default Layout;