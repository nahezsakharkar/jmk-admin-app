import "./JMK.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import onlyForSuperAdmins from "../../helpers/OnlyForSuperAdmins";
import DataTable from "../../components/DataTable/DataTable";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const JMK = () => {

    VerifyAccessToken();

    const [admins, setAdmins] = useState([])
    const [years, setYears] = useState([])
    const token = adminAuth.accessToken;

    useEffect(() => {
        fetch(baseURL + 'api/admin', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setAdmins(json));

        fetch(baseURL + 'api/jmkYear', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setYears(json));
    }, [token])

    const commasMoney = num => num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'start_year', headerName: 'Start Year', width: 180 },
        { field: 'end_year', headerName: 'End Year', width: 180 },
        { field: 'amount', headerName: 'Amount', width: 200, },
        { field: 'added_by_name', headerName: 'Added By', width: 300, },
        {
            field: 'action',
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to="/JMK/ViewYear" state={{ jmkYear: params.row }} style={{ textDecoration: "none" }}>
                            <div className="viewButton">{onlyForSuperAdmins ? "Update" : "View"}</div>
                        </Link>
                    </div>
                );
            },
        },
    ];

    years.forEach((item) => item.amount = commasMoney(item.amount));

    const rows = years.map(items => {
        const adminName = admins.find(it => it.id === items.added_by)?.name;
        return { ...items, added_by_name: adminName }
    });

    return (
        <DataTable
            title="Manage JMK Years"
            add={onlyForSuperAdmins ? "/JMK/AddYear" : ""}
            columns={columns}
            rows={rows}
            sortField="id"
            sortOrder="desc"
        />
    );
}

export default JMK;