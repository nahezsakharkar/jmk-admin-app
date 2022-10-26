import "./Table.scss";
import { DataGrid } from '@mui/x-data-grid';
import { baseURL } from "../../../helpers/URLs";
import { adminAuth } from "../../../helpers/AdminInformation";
import { useEffect, useState } from "react";

const List = () => {
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
        { field: 'id', headerName: 'Member ID', width: 130 },
        { field: 'member_name', headerName: 'Name', width: 300 },
        {
            field: 'year', headerName: 'JMK Year', width: 200,
            valueGetter: (params) => `${params.row.JmkYear.start_year || ''} - ${params.row.JmkYear.end_year || ''}`
        },
        { 
            field: 'receipt_no', headerName: 'Receipt Number', width: 200, 
            valueGetter: (params) => params.row.receipt_no.toUpperCase()
        },
        { field: 'payment_mode', headerName: 'Payment Method', width: 200 },
        {
            field: 'amount', headerName: 'Amount', width: 150,
            valueGetter: (params) => commasMoney(params.row.JmkYear.amount)
        },
        { field: 'updatedAt', headerName: 'Date /Time', width: 220, hide: true },
    ];

    const rows = transactions.filter(obj => obj.payment_status === 'paid').map(items => {
        const memberName = members.find(it => it.id === items.member_id)?.name;
        return { ...items, member_name: memberName }
    });

    return (
        <div style={{ height: '317.5px', width: '100%', paddingTop: '6px' }}>
            <DataGrid
                sx={{ fontFamily: 'inherit' }}
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                hideFooter={true}
                disableColumnMenu={true}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'updatedAt', sort: 'desc' }],
                    },
                }}
            />
        </div>
    );
};

export default List;
