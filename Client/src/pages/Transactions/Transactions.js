import "./Transactions.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import DataTable from "../../components/DataTable/DataTable";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Transactions = () => {

    VerifyAccessToken();

    const [transactions, setTransactions] = useState([])
    const [members, setMembers] = useState([])
    const token = adminAuth.accessToken;

    useEffect(() => {
        fetch(baseURL + 'api/jmkPayments', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setTransactions(json));

        fetch(baseURL + 'api/member', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setMembers(json));

    }, [token])

    const commasMoney = num => num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });


    const columns = [
        { field: 'id', headerName: 'Payment ID', width: 180 },
        { field: 'member_name', headerName: 'Name', width: 300 },
        {
            field: 'year', headerName: 'JMK Year', width: 250,
            valueGetter: (params) => `${params.row.JmkYear.start_year || ''} - ${params.row.JmkYear.end_year || ''}`
        },
        {
            field: 'amount', headerName: 'Amount', width: 220,
            valueGetter: (params) => commasMoney(params.row.JmkYear.amount)
        },
        { field: 'updatedAt', headerName: 'Date / Time', width: 220, hide: true },
        {
            field: 'action',
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to="/Transactions/ViewTransaction" state={{ transaction: params.row }} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View Payment Details</div>
                        </Link>
                    </div>
                );
            },
        },
    ];

    const rows = transactions.filter(obj => obj.payment_status === 'paid').map(items => {
        const memberName = members.find(it => it.id === items.member_id)?.name;
        return { ...items, member_name: memberName }
    });

    return (
        <div id="paymentsDiv">
            <DataTable
                title="All Transactions"
                add=""
                columns={columns}
                rows={rows}
                sortField="updatedAt"
                sortOrder="desc"
            />
        </div>
    );
}

export default Transactions;