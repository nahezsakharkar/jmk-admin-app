import "./Transactions.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from "../../components/OurModal/OurModal";

import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

const ViewTransaction = () => {

    VerifyAccessToken();

    const navigate = useNavigate()
    const location = useLocation()
    var { transaction } = location.state
    const [admins, setAdmins] = useState([])
    const [payments, setPayments] = useState([])
    var arrayTransaction = [transaction].map(items => {
        const adminName = admins.find(it => it.id === items.added_by)?.name;
        return { ...items, added_by_name: adminName }
    })
    transaction["added_by_name"] = arrayTransaction[0].added_by_name
    const initialValues = { payment_mode: transaction.payment_mode, receipt_no: transaction.receipt_no, details: transaction.details };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [updateValues, setUpdateValues] = useState(initialValues);
    const [isSubmit, setIsSubmit] = useState(false);
    const [readOnly, setRealOnly] = useState(true)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const token = adminAuth.accessToken;

    useEffect(() => {
        fetch(baseURL + 'api/admin', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setAdmins(json))

        fetch(baseURL + 'api/jmkPayments', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setPayments(json));

        if (Object.keys(formErrors).length === 0 && isSubmit) {
            handleOpen();
        }
    }, [formErrors, isSubmit, token]);

    const capitalize = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

    const commasMoney = num => num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });

    const toOrdinalSuffix = num => {
        const int = parseInt(num),
            digits = [int % 10, int % 100],
            ordinals = ['st', 'nd', 'rd', 'th'],
            oPattern = [1, 2, 3, 4],
            tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
        return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
            ? int + ordinals[digits[0] - 1]
            : int + ordinals[3];
    };

    const date = new Date(transaction.paid_on);
    const createdAt = (toOrdinalSuffix(date.getDate()) + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear())

    const handleChange = (e) => {
        setIsSubmit(false);
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleEdit = () => {
        setRealOnly(false)
        var span1 = document.getElementById("editValues");
        var span2 = document.getElementById("updateTransaction");

        if (!span1.classList.contains('hide')) {
            span1.className += " hide"
        }

        if (span2.classList.contains('hide')) {
            span2.classList.remove('hide')
        }

    };

    const handleSubmit = () => {
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        var span2 = document.getElementById("updateTransaction");
        if ((Object.keys(formErrors).length === 0 && isSubmit) === false) {
            if (!span2.classList.contains('shake')) {
                span2.className += " shake"
            }
        }
        else {
            if (span2.classList.contains('shake')) {
                span2.classList.remove('shake')
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
        } else if (payments.filter(obj => obj.receipt_no === values.receipt_no).length > 0 && ((payments.filter(obj => obj.receipt_no === values.receipt_no))[0]).receipt_no !== transaction.receipt_no) {
            errors.receipt_no_prop = true
            errors.receipt_no = "This Receipt Number is already used.";
        }

        if (!values.details) {
            errors.details_prop = true
            errors.details = "Transaction Details cannot be empty.";
        }

        setUpdateValues({ payment_mode: capitalize(values.payment_mode), receipt_no: values.receipt_no.toLowerCase(), details: values.details })

        return errors;
    };

    function handleUpdate() {
        var span1 = document.getElementById("editValues");
        var span2 = document.getElementById("updateTransaction");

        if (!span2.classList.contains('hide')) {
            span2.className += " hide"
        }

        if (span1.classList.contains('hide')) {
            span1.classList.remove('hide')
        }

        fetch(baseURL + 'api/jmkPayments/' + transaction.id, {
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
                    text: "New Information was Successfully Updated!",
                    icon: "success",
                    button: "OK!",
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        const newTransactionState = Object.assign(transaction, updateValues);
        navigate("/Transactions/ViewTransaction", { state: { transaction: newTransactionState } })
        setRealOnly(true)
        handleClose()
    }

    return (
        <div className="viewTransaction">
            <div className="title">{transaction.member_name}'s Transaction Details
                <span id="editValues" onClick={handleEdit} className="editValues" >Edit Transaction Details</span>
                <span id="updateTransaction" onClick={handleSubmit} className="updateTransaction hide" >Save Changes</span>
                <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleUpdate} title="Save Changes?" description="Do you really wish to update to changes made to this Transaction?" />
            </div>
            <hr className="title-divider" />
            <div className="created">Payment Paid On : {createdAt}</div>
            <div className="contentInformation">
                <div className="info-div">
                    <h6 className="heading">Transaction information</h6>
                    <div className="info">
                        <div className="item">
                            <div className="label">Payment Mode * : </div>
                            <TextField
                                error={formErrors.payment_mode_prop ? true : false}
                                id="payment_mode"
                                className="capitalize"
                                defaultValue={updateValues.payment_mode}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: readOnly,
                                }}
                                helperText={formErrors.payment_mode}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Receipt Number * : </div>
                            <TextField
                                error={formErrors.receipt_no_prop ? true : false}
                                id="receipt_no"
                                className="uppercase"
                                defaultValue={updateValues.receipt_no}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: readOnly,
                                }}
                                helperText={formErrors.receipt_no}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Transaction Details * : </div>
                            <TextField
                                error={formErrors.details_prop ? true : false}
                                id="details"
                                defaultValue={updateValues.details}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: readOnly,
                                }}
                                helperText={formErrors.details}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Transaction Amount : </div>
                            <TextField
                                id="amount"
                                value={commasMoney(transaction.JmkYear.amount) || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">JMK Year : </div>
                            <TextField
                                id="year"
                                value={transaction.JmkYear.start_year + " to " + transaction.JmkYear.end_year || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">JMK Year Added By : </div>
                            <TextField
                                id="added_by"
                                value={transaction.added_by_name || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewTransaction;