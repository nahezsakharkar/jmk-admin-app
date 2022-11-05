import "./Admins.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from "../../components/OurModal/OurModal";
import DataTable from "../../components/DataTable/DataTable";

import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import swal from 'sweetalert';

const ViewAdmin = () => {

    VerifyAccessToken();

    const navigate = useNavigate()
    const location = useLocation()
    var { admin } = location.state
    const [admins, setAdmins] = useState([])
    const initialValues = { name: admin.name, email: admin.email, position: admin.position, admin_for: admin.admin_for, contact: admin.contact };
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

        if (Object.keys(formErrors).length === 0 && isSubmit) {
            handleOpen();
        }
    }, [formErrors, isSubmit, token]);

    const capitalize = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

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

    const date = new Date(admin.createdAt.slice(0, -1));
    const createdAt = (toOrdinalSuffix(date.getDate()) + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear())

    const handleChangePosition = (position) => {
        setIsSubmit(false);
        formValues['position'] = position.target.value
    };

    const handleChangeAdminFor = (adminFor) => {
        setIsSubmit(false);
        formValues['admin_for'] = adminFor.target.value
    };

    const handleChange = (e) => {
        setIsSubmit(false);
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleEdit = () => {
        setRealOnly(false)
        var span1 = document.getElementById("editValues");
        var span2 = document.getElementById("updateAdmin");

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
        var span2 = document.getElementById("updateAdmin");
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
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.name) {
            errors.name_prop = true
            errors.name = "Your Name is Required!";
        }

        if (!values.email) {
            errors.email_prop = true
            errors.email = "Your Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email_prop = true
            errors.email = "This is not a valid Email format!";
        } else if (admins.filter(obj => obj.email === values.email).length > 0 && ((admins.filter(obj => obj.email === values.email))[0]).email !== admin.email) {
            errors.email_prop = true
            errors.email = "This Email is already Taken!";
        }

        if (values.position === 'default') {
            errors.position_prop = true
            errors.position = "Assigned Position is Required!";
        }

        if (values.admin_for === 'default') {
            errors.admin_for_prop = true
            errors.admin_for = "This field is Required!";
        }

        if (values.contact.length < 10) {
            errors.contact_prop = true
            errors.contact = "Phone Number cannot be less than 10 Digits!";
        }

        setUpdateValues({ name: capitalize(values.name), email: values.email.toLowerCase(), position: values.position, admin_for: values.admin_for, contact: values.contact })

        return errors;
    };

    function handleUpdate() {
        var span1 = document.getElementById("editValues");
        var span2 = document.getElementById("updateAdmin");

        if (!span2.classList.contains('hide')) {
            span2.className += " hide"
        }

        if (span1.classList.contains('hide')) {
            span1.classList.remove('hide')
        }

        fetch(baseURL + 'api/admin/' + admin.id, {
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
        const newAdminState = Object.assign(admin, updateValues);
        navigate("/Admins/ViewAdmin", { state: { admin: newAdminState } })
        setRealOnly(true)
        handleClose()
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'house_no', headerName: 'House Number', width: 250, },
        {
            field: 'house_name', headerName: 'House Name', width: 400,
            valueGetter: (params) => params.row.isDeleted === true ? (`${params.row.house_name || ""} ---- (deleted)`) : params.row.house_name
        },
        { field: 'panchayat_house_no', headerName: 'Panchayat House Number', width: 350 },
    ];

    const rows = admin.Houses;

    return (
        <div className="viewAdmin">
            <div className="title">{admin.name}'s Details
                <span id="editValues" onClick={handleEdit} className="editValues" >Edit Admin Details</span>
                <span id="updateAdmin" onClick={handleSubmit} className="updateAdmin hide" >Save Changes</span>
                <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleUpdate} title="Save Changes?" description="Do you really wish to update to changes made to this Account?" />
            </div>
            <hr className="title-divider" />
            <div className="created">Admin Created On : {createdAt}</div>
            <div className="contentInformation">
                <div className="info-div">
                    <h6 className="heading">User information</h6>
                    <div className="info">
                        <div className="item">
                            <div className="label">Full Name * : </div>
                            <TextField
                                error={formErrors.name_prop ? true : false}
                                id="name"
                                className="capitalize"
                                defaultValue={updateValues.name}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: readOnly,
                                }}
                                helperText={formErrors.name}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Position * : </div>
                            <FormControl variant="standard" error={formErrors.position_prop ? true : false}>
                                <Select
                                    id="position"
                                    defaultValue={updateValues.position ? updateValues.position : ""}
                                    onChange={handleChangePosition}
                                    inputProps={{
                                        readOnly: readOnly,
                                    }}
                                >
                                    <MenuItem id="position" value={"Superadmin"}>Superadmin</MenuItem>
                                    <MenuItem id="position" value={"Admin"}>Admin</MenuItem>
                                </Select>
                                <FormHelperText>{formErrors.position}</FormHelperText>
                            </FormControl>
                        </div>
                        <div className="item">
                            <div className="label">Admin For * : </div>
                            <FormControl variant="standard" error={formErrors.admin_for_prop ? true : false}>
                                <Select
                                    id="admin_for"
                                    defaultValue={updateValues.admin_for ? updateValues.admin_for : ""}
                                    onChange={handleChangeAdminFor}
                                    inputProps={{
                                        readOnly: readOnly,
                                    }}
                                >
                                    <MenuItem value={"JMK"}>JMK</MenuItem>
                                    {/* <MenuItem value={"BAZM"}>BAZM</MenuItem> */}
                                </Select>
                                <FormHelperText>{formErrors.admin_for}</FormHelperText>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className="info-div">
                    <h6 className="heading">Contact information</h6>
                    <div className="info">
                        <div className="item">
                            <div className="label">Email * : </div>
                            <TextField
                                error={formErrors.email_prop ? true : false}
                                id="email"
                                type="email"
                                defaultValue={updateValues.email}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: readOnly,
                                }}
                                helperText={formErrors.email}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Phone Number * : </div>
                            <TextField
                                error={formErrors.contact_prop ? true : false}
                                id="contact"
                                type="number"
                                defaultValue={updateValues.contact}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: readOnly,
                                }}
                                helperText={formErrors.contact}
                                variant="standard" />
                        </div>
                    </div>
                </div>
            </div>
            <hr className="divider" />
            <DataTable title={"Houses Created By " + updateValues.name} add="" columns={columns} rows={rows} />
        </div >
    );
}

export default ViewAdmin;