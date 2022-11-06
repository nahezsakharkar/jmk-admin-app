import "./Update Modal.scss";
import { baseURL } from "../../../helpers/URLs";
import { adminAuth } from "../../../helpers/AdminInformation";

import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import swal from 'sweetalert';

const UpdateModal = (params) => {
    const initialValues = { active_from: "", inactivity_reason: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [updateValues, setUpdateValues] = useState();
    const [dateValue, setDateValue] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [buttonValue, setButtonValue] = useState("Confirm Changes")
    const modalFunction = params.row.active_status === "Active" ? "Inactive" : "Active"
    const token = adminAuth.accessToken;

    useEffect(() => {
        if ((Object.keys(formErrors).length === 0 && isSubmit) === true) {
            setButtonValue("Mark as " + modalFunction)
        }
    }, [formErrors, isSubmit, modalFunction])

    const dateHandleChange = (newValue) => {
        setIsSubmit(false);
        setDateValue(newValue)
        formValues['active_from'] = newValue.toLocaleString().replace(/,/g, '').split(' ')[0].replace(/\//g, "-")
    };

    const handleChange = (e) => {
        setIsSubmit(false);
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleSubmit = () => {
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        var btn = document.getElementById("markAsActiveInactive");
        if ((Object.keys(formErrors).length === 0 && isSubmit) === false) {
            if (!btn.classList.contains('shake')) {
                btn.className += " shake"
            }
        }
        else {
            handleUpdate()
            if (btn.classList.contains('shake')) {
                btn.classList.remove('shake')
            }
        }
    };

    const validate = (values) => {
        const errors = {};

        if (modalFunction === "Inactive") {
            if (!values.inactivity_reason) {
                errors.inactivity_reason_prop = true
                errors.inactivity_reason = "Inactivity Reason cannot be empty. Reasons could be 'Student', 'Unemployed', 'Deceased', etc...";
            }
        } else if (modalFunction === "Active") {
            if (!values.active_from) {
                errors.active_from_prop = true
                errors.active_from = "Active Date cannot be empty.";
            }
        }

        if (modalFunction === "Inactive") {
            setUpdateValues({ active_status: false, inactivity_reason: values.inactivity_reason, active_from: null })
        } else if (modalFunction === "Active") {
            setUpdateValues({ active_status: true, active_from: values.active_from, inactivity_reason: null })
        }
        return errors;
    };

    function handleUpdate() {
        if (modalFunction === "Active") {
            fetch(baseURL + 'api/member/activate/' + params.row.id, {
                method: 'POST',
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
                        text: "This Member was Successfully Marked as Active!",
                        icon: "success",
                        button: "Cool!",
                    }).then(function () {
                        window.location.reload(false)
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    swal({
                        title: "Error!",
                        text: "Failed to contact the Server! Mark as Active Failed!",
                        icon: "error",
                        button: "OK!",
                    }).then(function () {
                        window.location.reload(false)
                    });
                });
        } else if (modalFunction === "Inactive") {
            fetch(baseURL + 'api/member/' + params.row.id, {
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
                        text: "This Member was Successfully Marked as Inactive!",
                        icon: "success",
                        button: "Cool!",
                    }).then(function () {
                        window.location.reload(false)
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    swal({
                        title: "Error!",
                        text: "Failed to contact the Server! Mark as Inactive Failed!",
                        icon: "error",
                        button: "OK!",
                    }).then(function () {
                        window.location.reload(false)
                    });
                });
        }
        params.handleClose()
    }

    return (
        <Modal open={params.open} onClose={params.handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <div className="updateMemberModal">
                <span className="Close" onClick={params.handleClose}>&times;</span>
                <h1>Mark as {modalFunction}?</h1>
                <h4>{params.row.name} will be Marked as {modalFunction}.</h4>
                <hr />
                <div className="Form">
                    {modalFunction === "Inactive" ? <TextField
                        error={formErrors.inactivity_reason_prop ? true : false}
                        id="inactivity_reason"
                        label="Inactivity Reason"
                        className="capitalize"
                        onChange={handleChange}
                        placeholder="Student / Unemployed / Deceased"
                        helperText={formErrors.inactivity_reason}
                        variant="outlined" /> : null}
                    {modalFunction === "Active" ? <div style={{ marginBottom: formErrors.active_from_prop ? "1.5rem" : "1rem" }}><LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Active Since"
                            inputId="active_from"
                            value={dateValue}
                            onChange={dateHandleChange}
                            renderInput={(params) => <TextField sx={{ height: '3rem', width: '100%' }} {...params}
                                error={formErrors.active_from_prop ? true : false} helperText={formErrors.active_from} />
                            }
                        />
                    </LocalizationProvider></div> : null}
                    <Button onClick={handleSubmit} id="markAsActiveInactive" className="mark-as-active-inactive" color="success" variant="contained">{buttonValue}</Button>
                </div>
            </div>
        </Modal >
    )
}

export default UpdateModal