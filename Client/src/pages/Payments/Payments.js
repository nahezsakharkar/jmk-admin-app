import "./Payments.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from '../../components/OurModal/OurModal';
import DataTable from "../../components/DataTable/DataTable";

import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import swal from 'sweetalert';

const Payments = () => {

    VerifyAccessToken();

    const initialValues = { payment_mode: "", receipt_no: "", details: "", payment_status: "due" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [updateValues, setUpdateValues] = useState();
    const [dateValue, setDateValue] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [buttonValue, setButtonValue] = useState("Confirm Payment")
    const [payments, setPayments] = useState([])
    const [members, setMembers] = useState([])
    const [updateRow, setUpdateRow] = useState([])
    const [deleteRow, setDeleteRow] = useState([])
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);
    const token = adminAuth.accessToken;

    const capitalize = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

    useEffect(() => {
        fetch(baseURL + 'api/jmkPayments', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setPayments(json));

        fetch(baseURL + 'api/member', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setMembers(json));

        if ((Object.keys(formErrors).length === 0 && isSubmit) === true) {
            setButtonValue("Mark Paid!")
        }

    }, [formErrors, isSubmit, token])

    const dateHandleChange = (newValue) => {
        setIsSubmit(false);
        setDateValue(newValue)
        formValues['paid_on'] = newValue.toLocaleString().replace(/,/g, '').split(' ')[0].replace(/\//g, "-")
    };

    function openUpdateModal(row) {
        setUpdateRow(row)
        handleOpen()
    };

    function openDeleteModal(row) {
        setDeleteRow(row)
        handleOpenDelete()
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
                swal({
                    title: "Success!",
                    text: "This Pending Payment was Successfully Marked as Paid!",
                    icon: "success",
                    button: "OK!",
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        handleClose()
    }

    function handleDelete() {
        fetch(baseURL + 'api/jmkPayments/' + deleteRow.id, {
            method: 'DELETE',
            headers: {
                token: `Bearer ${token}`
            }
        }).then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                handleCloseDelete()
                swal({
                    title: "Success!",
                    text: "This Pending Payment was Successfully Deleted!",
                    icon: "success",
                    button: "OK!",
                }).then(function () {
                    window.location.reload(false)
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                swal({
                    title: "Error!",
                    text: "Failed to contact the Server! Delete Failed!",
                    icon: "error",
                    button: "OK!",
                }).then(function () {
                    window.location.reload(false)
                });
            });
    }

    const commasMoney = num => num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });

    const columns = [
        { field: 'id', headerName: 'Payment ID', width: 170 },
        { field: 'member_name', headerName: 'Name', width: 280 },
        {
            field: 'year', headerName: 'JMK Year', width: 210,
            valueGetter: (params) => `${params.row.JmkYear.start_year || ''} - ${params.row.JmkYear.end_year || ''}`
        },
        {
            field: 'pending', headerName: 'Pending Amount', width: 230,
            valueGetter: (params) => commasMoney(params.row.JmkYear.amount)
        },
        {
            field: 'action',
            headerName: "Action",
            width: 250,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <div className="add" onClick={() => openUpdateModal(params.row)}>Mark as Paid</div>
                        <div className="deleteButton" onClick={() => openDeleteModal(params.row)}>Remove</div>
                    </div>
                );
            },
        },
    ];

    const rows = payments.filter(obj => obj.payment_status === 'due').map(items => {
        const memberName = members.find(it => it.id === items.member_id)?.name;
        return { ...items, member_name: memberName }
    });

    return (
        <div id="paymentsDiv">
            <DataTable title="Pending Payments" add="" columns={columns} rows={rows} />
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <div className="updateForm">
                    <span className="Close" onClick={handleClose}>&times;</span>
                    <h1>Mark as Paid?</h1>
                    <h4>{updateRow.member_name}'s Pending Payment will be marked as Paid.</h4>
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
            <OurModal open={openDelete} setOpen={setOpenDelete} handleOpen={handleOpenDelete} handleClose={handleCloseDelete} handleYes={handleDelete} title={deleteRow.member_name + "'s Pending Payment will be Removed."} description={"Do you really wish to Remove " + deleteRow.member_name + "'s Pending Payment? This Payment will no longer exist. "} />
        </div>
    );
}

export default Payments;