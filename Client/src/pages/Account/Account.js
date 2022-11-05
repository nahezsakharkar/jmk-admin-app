import "./Account.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from '../../components/OurModal/OurModal';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import swal from 'sweetalert';

const Account = () => {

    VerifyAccessToken();

    const navigate = useNavigate()
    const initialValues = { name: adminAuth.name, email: adminAuth.email, position: adminAuth.position, admin_for: adminAuth.admin_for, contact: adminAuth.contact, new_password: "", confirm_password: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [updateValues, setUpdateValues] = useState();
    const [isSubmit, setIsSubmit] = useState(false);
    const [admins, setAdmins] = useState([])
    const token = adminAuth.accessToken;

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [eyeVisible, setEyeVisible] = useState(false);

    const capitalize = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

    const options = [
        { target: JSON.parse('{"id":"admin_for", "value":"JMK"}'), value: 'JMK', label: 'JMK' },
        // { target: JSON.parse('{"id":"admin_for", "value":"BAZM"}'), value: 'BAZM', label: 'BAZM' }
    ]

    const showPassword = (e) => {
        console.log(e.currentTarget.id)
        setEyeVisible(!eyeVisible);
        console.log(eyeVisible)
    };

    const handleChange = (e) => {
        setIsSubmit(false);
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleSubmit = () => {
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        var span = document.getElementById("saveAccountChanges");
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

    useEffect(() => {
        fetch(baseURL + 'api/admin', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setAdmins(json));
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            handleOpen();
        }
    }, [formErrors, isSubmit, token]);

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.name) {
            errors.name = "Your Name is Required!";
        }

        if (!values.email) {
            errors.email = "Your Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid Email format!";
        } else if (admins.filter(obj => obj.email === values.email).length > 0 && ((admins.filter(obj => obj.email === values.email))[0]).email !== adminAuth.email) {
            errors.email = "This Email is already Taken!";
        }

        if (!values.position) {
            errors.position = "Assigned Position is Required!";
        }

        if (values.admin_for === 'default') {
            errors.admin_for = "This field is Required!";
        }

        if (values.contact.length < 10) {
            errors.contact = "Phone Number cannot be less than 10 Digits!";
        }

        if (values.new_password.length > 0 && values.new_password.length < 4) {
            errors.new_password = "Password must be more than 4 characters";
        } else if (values.new_password.length > 10) {
            errors.new_password = "Password cannot exceed more than 10 characters";
        } else if (values.confirm_password !== values.new_password) {
            errors.confirm_password = "Confirm Password Should be as same as New Password";
        } else {
            values.password = values.new_password;
        }

        if (!values.password) {
            setUpdateValues({ name: capitalize(values.name), email: values.email.toLowerCase(), position: capitalize(values.position), admin_for: values.admin_for, contact: values.contact })
        }
        else {
            setUpdateValues({ name: capitalize(values.name), email: values.email.toLowerCase(), position: capitalize(values.position), admin_for: values.admin_for, contact: values.contact, password: values.password })
        }

        return errors;
    };


    function handleUpdate() {
        fetch(baseURL + 'api/admin/' + adminAuth.id, {
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
                }).then(function () {
                    localStorage.removeItem("Admin Credentials")
                    navigate('/')
                })
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        handleClose()
        // localStorage.removeItem("Admin Credentials")
        // navigate('/')
    }

    return (
        <div className="account">
            <div className="title">
                Your Account
                <span id="saveAccountChanges" onClick={handleSubmit} className="saveChanges" >Save Changes</span>
                <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleUpdate} title="Save Changes?" description="Do you really wish to update to changes made to your Account? You will be Logged out of your Account and will be redirected to Login Page." />
            </div>
            <hr className="title-divider" />
            <form>
                <h6 className="heading">User information</h6>
                <div className="info">
                    <div className="row">
                        <div className="col">
                            <div className="form-group focused">
                                <label htmlFor="name">Name *</label>
                                <input style={{ textTransform: 'capitalize' }} type="text" id="name" className="form-control" placeholder="Name" onChange={handleChange} defaultValue={adminAuth.name} />
                                <span className="error">{formErrors.name}</span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input type="email" id="email" className="form-control" placeholder="admin@example.com" onChange={handleChange} defaultValue={adminAuth.email} />
                                <span className="error">{formErrors.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-group focused">
                                <label htmlFor="position">Position *</label>
                                <input style={{ textTransform: 'capitalize' }} type="text" id="position" className="form-control" placeholder="Supreme" onChange={handleChange} defaultValue={adminAuth.position} />
                                <span className="error">{formErrors.position}</span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group focused">
                                <label htmlFor="admin_for">Admin For *</label>
                                <Select inputId="admin_for" options={options} onChange={handleChange} className="search-options" defaultValue={{ target: JSON.parse('{"id":"admin_for", "value":"default"}'), value: adminAuth.admin_for, label: adminAuth.admin_for }} />
                                <span className="error">{formErrors.admin_for}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="divider" />
                <h6 className="heading">Contact information</h6>
                <div className="info">
                    <div className="row">
                        <div className="col">
                            <div className="form-group focused">
                                <label htmlFor="contact">Phone Number *</label>
                                <input type="number" id="contact" className="form-control" placeholder="0123456789" onChange={handleChange} defaultValue={adminAuth.contact} />
                                <span className="error">{formErrors.contact}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="divider" />
                <div className="createPasswordTitle">
                    <h6 className="heading">Create Password</h6>
                    <span className="showPassword" onClick={showPassword}>
                        <Tooltip title="View Password" placement="right-start" arrow>
                            {eyeVisible ? <VisibilityIcon className="icon" /> : <VisibilityOffIcon className="icon" />}
                        </Tooltip>
                    </span>
                </div>
                <div className="info">
                    <div className="row">
                        <div className="col">
                            <div className="form-group focused">
                                <label htmlFor="new_password">New Password *</label>
                                <input autoComplete="new-password" type={eyeVisible ? "text" : "password"} id="new_password" className="form-control" placeholder="Pass@123" onChange={handleChange} />
                                <span className="error">{formErrors.new_password}</span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="confirm_password">Confirm Password *</label>
                                <input autoComplete="new-password" type={eyeVisible ? "text" : "password"} id="confirm_password" className="form-control" placeholder="Pass@123" onChange={handleChange} />
                                <span className="error">{formErrors.confirm_password}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Account;