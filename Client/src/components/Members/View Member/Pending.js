import { baseURL } from "../../../helpers/URLs";
import { adminAuth } from "../../../helpers/AdminInformation";
import DataTable from "../../../components/DataTable/DataTable";

import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';

const Pending = (params) => {
    const initialValues = { payment_mode: "", receipt_no: "", details: "", payment_status: "due" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [updateValues, setUpdateValues] = useState();
    const [payments, setPayments] = useState([])
    const [dateValue, setDateValue] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [buttonValue, setButtonValue] = useState("Confirm Payment")
    const [updateRow, setUpdateRow] = useState([])
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const token = adminAuth.accessToken;

    useEffect(() => {
        if ((Object.keys(formErrors).length === 0 && isSubmit) === true) {
            setButtonValue("Mark Paid!")
        }

    }, [formErrors, isSubmit, token])

    const dateHandleChange = (newValue) => {
        setIsSubmit(false);
        setDateValue(newValue)
        formValues['paid_on'] = newValue.toLocaleString().replace(/,/g, '').split(' ')[0].replace(/\//g, "-")
    };

    function openModal(row) {
        setUpdateRow(row)
        handleOpen()
    };

    const handleFocus = () => {
        fetch(baseURL + 'api/jmkPayments', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setPayments(json));
    };

    const handleChange = (e) => {
        setIsSubmit(false);
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleSubmit = () => {
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        var span = document.getElementById("submitButtom");
        if ((Object.keys(formErrors).length === 0 && isSubmit) === false) {
            if (!span.classList.contains('shake')) {
                span.className += " shake"
            }
        }
        else {
            handleUpdate()
            if (span.classList.contains('shake')) {
                span.classList.remove('shake')
            }
        }
    };

    const validate = (values) => {
        const errors = {};
        if (!values.payment_mode) {
            errors.payment_mode_prop = true
            errors.payment_mode = "Payment Mode cannot be empty.";
        }

        if (!values.receipt_no) {
            errors.receipt_no_prop = true
            errors.receipt_no = "Receipt Number cannot be empty.";
        } else if (payments.filter(obj => obj.receipt_no === values.receipt_no.toLowerCase()).length > 0) {
            errors.receipt_no_prop = true
            errors.receipt_no = "This Receipt Number is already used.";
        }

        if (!values.details) {
            errors.details_prop = true
            errors.details = "Transaction Details cannot be empty.";
        }

        if (!values.paid_on) {
            errors.paid_on_prop = true
            errors.paid_on = "Payment Date cannot be empty.";
        }

        setUpdateValues({ payment_mode: capitalize(values.payment_mode), receipt_no: values.receipt_no.toLowerCase(), details: values.details, paid_on: values.paid_on, payment_status: "paid" })

        return errors;
    };

    function handleUpdate() {
        fetch(baseURL + 'api/jmkPayments/' + updateRow.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                token: `Bearer ${token}`
            },
            body: JSON.stringify(updateValues),
        }).then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        window.location.reload(false)
        handleClose()
    }

    const commasMoney = num => num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });

    const capitalize = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

    const columns = [
        { field: 'id', headerName: 'Payment ID', width: 200 },
        {
            field: 'amount', headerName: 'Amount', width: 350,
            valueGetter: (params) => commasMoney(params.row.amount)
        },
        {
            field: 'year', headerName: 'JMK Year', width: 350,
            valueGetter: (params) => `${params.row.start_year || ''} - ${params.row.end_year || ''}`
        },
        {
            field: 'action',
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <div className="add" onClick={() => openModal(params.row)}>Mark as Paid</div>
                    </div>
                );
            },
        },
    ];

    const rows = params.memberPayments.filter(obj => obj.payment_status === 'due');

    return (
        <div className="pendingPayments">
            <DataTable height="370.5px" pagesize={5} title={"Pending Payments of " + params.memberName} add="" columns={columns} rows={rows} />
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <div className="updateForm">
                    <span className="Close" onClick={handleClose}>&times;</span>
                    <h1>Mark as Paid?</h1>
                    <h4>{params.memberName}'s Pending Payment will be marked as Paid.</h4>
                    <hr />
                    <div className="Form">
                        <TextField
                            error={formErrors.payment_mode_prop ? true : false}
                            id="payment_mode"
                            label="Payment Mode"
                            className="capitalize"
                            onChange={handleChange}
                            helperText={formErrors.payment_mode}
                            variant="outlined" />
                        <TextField
                            error={formErrors.receipt_no_prop ? true : false}
                            id="receipt_no"
                            label="Receipt Number"
                            className="uppercase"
                            onFocus={handleFocus}
                            onChange={handleChange}
                            helperText={formErrors.receipt_no}
                            variant="outlined" />
                        <TextField
                            error={formErrors.details_prop ? true : false}
                            id="details"
                            label="Transaction Details"
                            onChange={handleChange}
                            helperText={formErrors.details}
                            variant="outlined" />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Payment Date"
                                inputId="paid_on"
                                value={dateValue}
                                onChange={dateHandleChange}
                                renderInput={(params) => <TextField sx={{ height: '3rem', width: '100%' }} {...params}
                                    error={formErrors.paid_on_prop ? true : false} helperText={formErrors.paid_on} />
                                }
                            />
                        </LocalizationProvider>
                        <Button onClick={handleSubmit} id="submitButtom" className="mark-as-paid" color="success" variant="contained">{buttonValue}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Pending