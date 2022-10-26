import DataTable from "../../../components/DataTable/DataTable";

const Transaction = (params) => {

    const commasMoney = num => num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });

    const columns = [
        { field: 'id', headerName: 'Payment ID', width: 120 },
        {
            field: 'amount', headerName: 'Amount', width: 200,
            valueGetter: (params) => commasMoney(params.row.amount)
        },
        {
            field: 'year', headerName: 'JMK Year', width: 230,
            valueGetter: (params) => `${params.row.start_year || ''} - ${params.row.end_year || ''}`
        },
        { field: 'payment_mode', headerName: 'Payment Mode', width: 200 },
        { field: 'receipt_no', headerName: 'Receipt Number', width: 200 },
        { field: 'paid_on', headerName: 'Paid on', width: 180 },
    ];

    const rows = params.memberPayments.filter(obj => obj.payment_status === 'paid');

    return (
        <DataTable height="370.5px" pagesize={5} title={"Transactions of  " + params.memberName} add="" columns={columns} rows={rows} />

    )
}

export default Transaction