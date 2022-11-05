import "./JMK.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from "../../components/OurModal/OurModal";
import onlyForSuperAdmins from "../../helpers/OnlyForSuperAdmins";

import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

const ViewYear = () => {

    VerifyAccessToken();

    const navigate = useNavigate()
    const location = useLocation()
    var { jmkYear } = location.state
    const [admins, setAdmins] = useState([])
    var arrayYear = [jmkYear].map(items => {
        const adminName = admins.find(it => it.id === items.added_by)?.name;
        return { ...items, added_by_name: adminName }
    })
    jmkYear["added_by_name"] = arrayYear[0].added_by_name
    const initialValues = { amount: parseFloat(jmkYear.amount.replace(/[^0-9-.]/g, '')) };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [updateValues, setUpdateValues] = useState(initialValues);
    const [isSubmit, setIsSubmit] = useState(false);
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

        if (Object.keys(formErrors).length === 0 && isSubmit) {
            handleOpen();
        }
    }, [formErrors, isSubmit, token]);

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

    const date = new Date(jmkYear.createdAt.slice(0, -1));
    const createdAt = (toOrdinalSuffix(date.getDate()) + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear())

    const handleChange = (e) => {
        setIsSubmit(false);
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleSubmit = () => {
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        var span = document.getElementById("updateYear");
        if ((Object.keys(formErrors).length === 0 && isSubmit) === false) {
            if (!span.classList.contains('shake')) {
                span.className += " shake"
            }
        }
        else {
            if (span.classList.contains('shake')) {
                span.classList.remove('shake')
            }
        }
    };

    const validate = (values) => {
        const errors = {};

        if (!values.amount) {
            errors.amount_prop = true;
            errors.amount = "Amount is required!";
        } else if (values.amount.length > 10) {
            errors.amount_prop = true;
            errors.amount = "Amount cannot be more than 10 Digits!";
        }

        setUpdateValues({ amount: values.amount })

        return errors;
    };

    function handleUpdate() {
        fetch(baseURL + 'api/jmkYear/' + jmkYear.id, {
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
        updateValues.amount = commasMoney(updateValues.amount)
        const newYearState = Object.assign(jmkYear, updateValues);
        navigate("/JMK/ViewYear", { state: { jmkYear: newYearState } })
        handleClose()
    }

    return (
        <div className="viewYear">
            <div className="title">{jmkYear.start_year + " - " + jmkYear.end_year}'s Year Details
                {onlyForSuperAdmins ? <span id="updateYear" onClick={handleSubmit} className="updateYear" >Save Changes</span> : null}
                <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleUpdate} title="Save Changes?" description="Do you really wish to update to changes made to this Year?" />
            </div>
            <hr className="title-divider" />
            <div className="created">Year Created On : {createdAt}</div>
            <div className="contentInformation">
                <div className="info-div">
                    <h6 className="heading">Year information</h6>
                    <div className="info">
                        <div className="item">
                            <div className="label">Start Year : </div>
                            <TextField
                                id="start_year"
                                value={jmkYear.start_year || " "}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">End Year : </div>
                            <TextField
                                id="end_year"
                                value={jmkYear.end_year || " "}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Amount * : </div>
                            <TextField
                                error={formErrors.amount_prop ? true : false}
                                id="amount"
                                type="number"
                                defaultValue={updateValues.amount}
                                onChange={handleChange}
                                helperText={formErrors.amount}
                                InputProps={{
                                    readOnly: onlyForSuperAdmins ? false : true,
                                    startAdornment: (<InputAdornment InputAdornment position="start" >₹</InputAdornment>)
                                }}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Created By : </div>
                            <TextField
                                id="added_by_name"
                                value={jmkYear.added_by_name || " "}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ViewYear;