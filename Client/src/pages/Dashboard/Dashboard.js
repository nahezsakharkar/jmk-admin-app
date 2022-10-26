import "./Dashboard.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";

// components ---------------------------------
import Widget from "../../components/Dashboard/Widgets/Widget";
import Featured from "../../components/Dashboard/Charts/Featured";
import Chart from "../../components/Dashboard/Charts/Chart";
import Table from "../../components/Dashboard/Table/Table";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {

    VerifyAccessToken();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
    let today = new Date()

    const [dashboard, setDashboard] = useState({
        received: 0, expected: 0, lastSixMonthsRev: [
            { month: 1, MonthName: "January", revenue: 0 },
            { month: 2, MonthName: "Febuary", revenue: 0 },
            { month: 3, MonthName: "March", revenue: 0 },
            { month: 4, MonthName: "April", revenue: 0 },
            { month: 5, MonthName: "May", revenue: 0 },
            { month: 6, MonthName: "June", revenue: 0 },
            { month: 7, MonthName: "July", revenue: 0 },
            { month: 8, MonthName: "August", revenue: 0 },
            { month: 9, MonthName: "September", revenue: 0 },
            { month: 10, MonthName: "October", revenue: 0 },
            { month: 11, MonthName: "November", revenue: 0 },
            { month: 12, MonthName: "December", revenue: 0 }
        ]
    })

    const token = adminAuth.accessToken;
    const month_0 = dashboard.lastSixMonthsRev.find((it) => it.MonthName === months[today.getMonth()]);
    const month_1 = dashboard.lastSixMonthsRev.find((it) => it.MonthName === months[today.getMonth() - 1]);
    const month_2 = dashboard.lastSixMonthsRev.find((it) => it.MonthName === months[today.getMonth() - 2]);
    const month_3 = dashboard.lastSixMonthsRev.find((it) => it.MonthName === months[today.getMonth() - 3]);
    const month_4 = dashboard.lastSixMonthsRev.find((it) => it.MonthName === months[today.getMonth() - 4]);
    const month_5 = dashboard.lastSixMonthsRev.find((it) => it.MonthName === months[today.getMonth() - 5]);

    useEffect(() => {
        fetch(baseURL + 'api/dashboard/', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setDashboard(json));
    }, [token])


    return (
        <div className="dashboard">
            <div className="widgets">
                <Widget type="houses" houses={dashboard.houses} />
                <Widget type="families" families={dashboard.families} />
                <Widget type="members" members={dashboard.members} />
                <Widget type="admins" admins={dashboard.admins} />
            </div>
            <div className="charts">
                <Featured received={dashboard.received} expected={dashboard.expected} lastMonth={month_1.revenue} />
                <Chart title="Last 6 Months (Revenue)" aspect={2 / 1}
                    lastSixMonthsRev={[
                        { MonthName: month_5.MonthName, Revenue: month_5.revenue },
                        { MonthName: month_4.MonthName, Revenue: month_4.revenue },
                        { MonthName: month_3.MonthName, Revenue: month_3.revenue },
                        { MonthName: month_2.MonthName, Revenue: month_2.revenue },
                        { MonthName: month_1.MonthName, Revenue: month_1.revenue },
                        { MonthName: month_0.MonthName, Revenue: month_0.revenue }
                    ]}
                />
            </div>
            <div className="listContainer">
                <div className="listTitle">Latest Transactions
                    <Link to="/Transactions" className="viewAll">
                        View All Transactions
                    </Link>
                </div>
                <Table />
            </div>
        </div>
    );
}

export default Dashboard;