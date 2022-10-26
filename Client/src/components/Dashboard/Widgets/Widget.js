import "./Widget.scss";

import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { NavLink } from "react-router-dom";

const Widget = ({ type, houses, families, members, admins }) => {
    let data;

    switch (type) {
        case "houses":
            data = {
                title: "TOTAL HOUSES",
                count: houses,
                link: "See All Houses",
                linkTo: "/Houses",
                icon: (
                    <MapsHomeWorkOutlinedIcon
                        className="icon"
                        style={{
                            color: "crimson",
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                        }}
                    />
                ),
            };
            break;
        case "families":
            data = {
                title: "TOTAL FAMILIES",
                count: families,
                link: "View All Families",
                linkTo: "/Families",
                icon: (
                    <FamilyRestroomOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(218, 165, 32, 0.2)",
                            color: "goldenrod",
                        }}
                    />
                ),
            };
            break;
        case "members":
            data = {
                title: "TOTAL MEMBERS",
                count: members,
                link: "View All Members",
                linkTo: "/Members",
                icon: (
                    <SupervisorAccountOutlinedIcon
                        className="icon"
                        style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
                    />
                ),
            };
            break;
        case "admins":
            data = {
                title: "TOTAL ADMINS",
                count: admins,
                link: "Manage Admins",
                linkTo: "/Admins",
                icon: (
                    <AdminPanelSettingsOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: "rgba(128, 0, 128, 0.2)",
                            color: "purple",
                        }}
                    />
                ),
            };
            break;
        default:
            break;
    }

    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{data.count}</span>
                <NavLink to={data.linkTo} style={{ textDecoration: "none" }}><span className="link">{data.link}</span></NavLink>
            </div>
            <div className="right">
                <div className="percentage positive">

                </div>
                {data.icon}
            </div>
        </div>
    );
};

export default Widget;
