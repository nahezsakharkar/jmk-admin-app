import "./Sidebar.scss";
import { adminAuth } from "../../helpers/AdminInformation";
import OurModal from '../OurModal/OurModal';
import onlyForSuperAdmins from "../../helpers/OnlyForSuperAdmins";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// icons ----------------------------
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MosqueIcon from '@mui/icons-material/Mosque';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function handleLogout() {
        setOpen(false)
        localStorage.removeItem("Admin Credentials")
        navigate('/')
    }

    return (
        <aside>
            <div className="sidebar">
                <ul>
                    <p className="title">MAIN</p>
                    <NavLink exact="true" activeclassname='is-active' to="/Dashboard" style={{ textDecoration: "none" }}>
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Dasboard</span>
                        </li>
                    </NavLink>
                    <p className="title">LIST</p>
                    {onlyForSuperAdmins ? <NavLink id="onlyForSuperAdmins" activeclassname='is-active' to="/Admins" style={{ textDecoration: "none" }}>
                        <li>
                            <AdminPanelSettingsIcon className="icon" />
                            <span>Admins</span>
                        </li>
                    </NavLink> : null}
                    <NavLink activeclassname='is-active' to="/Houses" style={{ textDecoration: "none" }}>
                        <li>
                            <MapsHomeWorkIcon className="icon" />
                            <span>Houses</span>
                        </li>
                    </NavLink>
                    <NavLink activeclassname='is-active' to="/Families" style={{ textDecoration: "none" }}>
                        <li>
                            <FamilyRestroomIcon className="icon" />
                            <span>Families</span>
                        </li>
                    </NavLink>
                    <NavLink activeclassname='is-active' to="/Members" style={{ textDecoration: "none" }}>
                        <li>
                            <SupervisorAccountIcon className="icon" />
                            <span>Members</span>
                        </li>
                    </NavLink>
                    <p className="title">SERVICE</p>
                    <NavLink activeclassname='is-active' to="/JMK" style={{ textDecoration: "none" }}>
                        <li>
                            <MosqueIcon className="icon" />
                            <span>JMK Year</span>
                        </li>
                    </NavLink>
                    <NavLink activeclassname='is-active' to="/Transactions" style={{ textDecoration: "none" }}>
                        <li>
                            <PointOfSaleIcon className="icon" />
                            <span>Transactions</span>
                        </li>
                    </NavLink>
                    <NavLink activeclassname='is-active' to="/Payments" style={{ textDecoration: "none" }}>
                        <li>
                            <PaymentsIcon className="icon" />
                            <span>Payments</span>
                        </li>
                    </NavLink>
                    <p className="title">USER</p>
                    <NavLink activeclassname='is-active' to="/Account" style={{ textDecoration: "none" }}>
                        <li>
                            <AccountCircleIcon className="icon" />
                            <span>Account</span>
                        </li>
                    </NavLink>
                    <li onClick={handleOpen}>
                        <LogoutIcon className="icon" />
                        <span>Logout</span>
                    </li>
                    <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleLogout} title={"Logout from " + adminAuth.name + "?"} description="Do you really wish to leave and log out? All the unsaved changes will be lost. " />
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar