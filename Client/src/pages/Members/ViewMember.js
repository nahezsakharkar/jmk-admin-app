import "./Members.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from "../../components/OurModal/OurModal";
import Pending from "../../components/Members/View Member/Pending";
import Transaction from "../../components/Members/View Member/Transaction";

import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import swal from 'sweetalert';

const ViewMember = () => {

    VerifyAccessToken();

    const navigate = useNavigate()
    const location = useLocation()
    var { member } = location.state
    let activeMember = member.active_status === "Active" ? true : false
    let inactiveMember = member.active_status === "Inactive" ? true : false
    const activeFromDate = member.active_from !== null ? new Date(member.active_from.replace(/-/g, "/")) : "";
    const [currentMember, setCurrentMember] = useState([])
    const [members, setMembers] = useState([])
    const [memberPayments, setMemberPayments] = useState([])
    const initialValues = { name: member.name, email: member.email, contact: member.contact, head_of_family: member.head_of_family, active_status: member.active_status, active_from: member.active_from, inactivity_reason: member.inactivity_reason };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [updateValues, setUpdateValues] = useState(initialValues);
    const [isSubmit, setIsSubmit] = useState(false);
    const [readOnly, setRealOnly] = useState(true)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openBranch, setOpenBranch] = useState(false);
    const handleOpenBranch = () => setOpenBranch(true);
    const handleCloseBranch = () => setOpenBranch(false);
    const token = adminAuth.accessToken;

    useEffect(() => {
        fetch(baseURL + 'api/member/details/' + member.id, {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setCurrentMember(json));

        fetch(baseURL + 'api/member/paymentDetails/' + member.id, {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setMemberPayments(json));

        if (Object.keys(formErrors).length === 0 && isSubmit) {
            handleOpen();
        }
    }, [formErrors, isSubmit, member.id, token]);

    const capitalize = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

    const pendingPayments = memberPayments.filter(obj => obj.payment_status === 'due')
    const paidPayments = memberPayments.filter(obj => obj.payment_status === 'paid')

    var i;
    let totalPendingAmount = 0;
    let totalPaidAmount = 0;

    for (i = 0; i <= pendingPayments.length; i++) {
        var pendingAmount = pendingPayments[i] ? pendingPayments[i]["amount"] : 0
        totalPendingAmount += pendingAmount
    }

    for (i = 0; i <= paidPayments.length; i++) {
        var paidAmount = paidPayments[i] ? paidPayments[i]["amount"] : 0
        totalPaidAmount += paidAmount
    }

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

    const date = new Date(member.createdAt.slice(0, -1));
    const createdAt = (toOrdinalSuffix(date.getDate()) + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear())

    const handleEmailFocus = () => {
        fetch(baseURL + 'api/member/', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setMembers(json));
    };

    const handleChange = (e) => {
        setIsSubmit(false);
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleEdit = () => {
        setRealOnly(false)
        var span1 = document.getElementById("editValues");
        var span2 = document.getElementById("updateMember");

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
        var span2 = document.getElementById("updateMember");
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
            errors.name_prop = true;
            errors.name = "Member Name is Required!";
        }

        if (!values.email) {
            errors.email_prop = true;
            errors.email = "Member Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email_prop = true;
            errors.email = "This is not a valid Email format!";
        } else if (members.filter(obj => obj.email === values.email).length > 0 && ((members.filter(obj => obj.email === values.email))[0]).email !== member.email) {
            if (members.filter(obj => obj.email === values.email)[0].isDeleted === true) {
                errors.email_prop = true;
                errors.email = "This Email already Belongs to a Deleted Member, Please use some other Email!";
            } else {
                errors.email_prop = true;
                errors.email = "This Email is already Taken!";
            }
        }

        if (values.contact.length < 10) {
            errors.contact_prop = true
            errors.contact = "Phone Number cannot be less than 10 Digits!";
        }

        if (values.head_of_family === 'default') {
            errors.head_of_family_prop = true
            errors.head_of_family = "Assigned Position is Required!";
        }

        setUpdateValues({ name: capitalize(values.name), email: values.email.toLowerCase(), head_of_family: values.head_of_family, contact: values.contact })

        return errors;
    };

    function handleUpdate() {
        var span1 = document.getElementById("editValues");
        var span2 = document.getElementById("updateMember");

        if (!span2.classList.contains('hide')) {
            span2.className += " hide"
        }

        if (span1.classList.contains('hide')) {
            span1.classList.remove('hide')
        }

        fetch(baseURL + 'api/member/' + member.id, {
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
        const newMemberState = Object.assign(member, updateValues);
        navigate("/Members/ViewMember", { state: { member: newMemberState } })
        handleClose()
    }

    function handleCreateFamily() {
        fetch(baseURL + 'api/family', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: `Bearer ${token}`
            },
            body: JSON.stringify({ family_head: currentMember.name, house_no: currentMember.house_id }),
        }).then((response) => response.json())
            .then((json) => {
                fetch(baseURL + 'api/member/' + member.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        token: `Bearer ${token}`
                    },
                    body: JSON.stringify({ head_of_family: true, family_id: json.id }),
                }).then((response) => response.json())
                    .then((data) => {
                        console.log('Success:', data);
                        swal({
                            title: "Success!",
                            text: "New Information was Successfully Updated!",
                            icon: "success",
                            button: "OK!",
                        }).then(function () {
                            window.location.reload(false)
                        });
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            })
        navigate("/Members")

        handleClose()
    }

    return (
        <div className="viewMember">
            <div className="title">{updateValues.name}'s Details
                <span id="editValues" onClick={handleEdit} className="editValues" >Edit Member Details</span>
                <span id="updateMember" onClick={handleSubmit} className="updateMember hide" >Save Changes</span>
                <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleUpdate} title="Save Changes?" description="Do you really wish to update to changes made to this Member?" />
            </div>
            <hr className="title-divider" />
            <div className="created">Member Created On : {createdAt}</div>
            <div className="contentInformation">
                <div className="info-div">
                    <h6 className="heading">Member information</h6>
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
                            <div className="label">Head of the Family : </div>
                            <TextField
                                id="head_of_family"
                                value={member.head_of_family}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Status : </div>
                            <TextField
                                error={formErrors.active_status_prop ? true : false}
                                id="active_status"
                                className="capitalize"
                                defaultValue={updateValues.active_status}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: true,
                                }}
                                helperText={formErrors.active_status}
                                variant="standard" />
                        </div>
                        {activeMember ? <div id="active-since-div" className="item">
                            <div className="label">Active from : </div>
                            <TextField
                                id="active_from"
                                value={toOrdinalSuffix(activeFromDate.getDate()) + " " + activeFromDate.toLocaleString('default', { month: 'long' }) + " " + activeFromDate.getFullYear()}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div> : null}
                        {inactiveMember ? <div id="inactive-reason-div" className="item">
                            <div className="label">Inactivity Reason : </div>
                            <TextField
                                id="inactivity_reason"
                                value={member.inactivity_reason}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div> : null}
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
                                onFocus={handleEmailFocus}
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
                        <div className="item">
                            <div className="label">Family ID : </div>
                            <TextField
                                id="family_id"
                                value={member.family_id}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Added By : </div>
                            <TextField
                                id="added_by"
                                value={member.added_by}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                    </div>
                </div>
            </div>
            {member.head_of_family === "No" ? <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <Button onClick={handleOpenBranch} variant="contained" style={{ backgroundColor: "#2e115c" }} endIcon={<AltRouteIcon />}>
                    Branch Family
                </Button>
            </div> : null}
            <div className="totalAmounts">
                <div className="totalAmountsPending">
                    Total Pending Amount : {commasMoney(totalPendingAmount)}
                </div>
                <div className="totalAmountsPaid">
                    Total Paid Amount : {commasMoney(totalPaidAmount)}
                </div>
            </div>
            <OurModal open={openBranch} setOpen={setOpenBranch} handleOpen={handleOpenBranch} handleClose={handleCloseBranch} handleYes={handleCreateFamily} title="Branch as New Family?" description="This Member will become Head of the New Family?" />
            <hr className="divider" />
            <Transaction memberName={updateValues.name} memberPayments={memberPayments} />
            <Pending memberName={updateValues.name} memberPayments={memberPayments} />
        </div>
    );
}

export default ViewMember;