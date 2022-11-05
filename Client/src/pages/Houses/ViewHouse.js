import "./Houses.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from "../../components/OurModal/OurModal";
import DataTable from "../../components/DataTable/DataTable";

import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

const ViewHouse = () => {

    VerifyAccessToken();

    const navigate = useNavigate()
    const location = useLocation()
    var { house } = location.state
    const [admins, setAdmins] = useState([])
    const [houses, setHouses] = useState([])
    var arrayHouse = [house].map(items => {
        const adminName = admins.find(it => it.id === items.added_by)?.name;
        return { ...items, added_by_name: adminName }
    })
    house["added_by_name"] = arrayHouse[0].added_by_name
    const initialValues = { house_name: house.house_name, house_no: house.house_no, panchayat_house_no: house.panchayat_house_no };
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

        fetch(baseURL + 'api/house', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setHouses(json))

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

    const date = new Date(house.createdAt.slice(0, -1));
    const createdAt = (toOrdinalSuffix(date.getDate()) + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear())

    const handleChange = (e) => {
        setIsSubmit(false);
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleEdit = () => {
        setRealOnly(false)
        var span1 = document.getElementById("editValues");
        var span2 = document.getElementById("updateHouse");

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
        var span2 = document.getElementById("updateHouse");
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
        if (!values.house_name) {
            errors.house_name_prop = true
            errors.house_name = "This field is Required!";
        } else if (houses.filter(obj => obj.house_name === values.house_name).length > 0 && ((houses.filter(obj => obj.house_name === values.house_name))[0]).house_name !== house.house_name) {
            errors.house_name_prop = true
            errors.house_name = "This House already Exists!";
        }

        if (!values.house_no) {
            errors.house_no_prop = true
            errors.house_no = "This field is Required!";
        } else if (houses.filter(obj => obj.house_no === values.house_no).length > 0 && ((houses.filter(obj => obj.house_no === values.house_no))[0]).house_no !== house.house_no) {
            errors.house_no_prop = true
            errors.house_no = "This House Number already Exists!";
        }

        if (!values.panchayat_house_no) {
            errors.name_prop = true
            errors.panchayat_house_no_prop = "This field is Required!";
        } else if (houses.filter(obj => obj.panchayat_house_no === values.panchayat_house_no).length > 0 && ((houses.filter(obj => obj.panchayat_house_no === values.panchayat_house_no))[0]).panchayat_house_no !== house.panchayat_house_no) {
            errors.panchayat_house_no_prop = true
            errors.panchayat_house_no = "This Panchayat House Number already Exists!";
        }

        setUpdateValues({ house_name: capitalize(values.house_name), house_no: values.house_no.toUpperCase(), panchayat_house_no: values.panchayat_house_no.toUpperCase() })

        return errors;
    };

    function handleUpdate() {
        var span1 = document.getElementById("editValues");
        var span2 = document.getElementById("updateHouse");

        if (!span2.classList.contains('hide')) {
            span2.className += " hide"
        }

        if (span1.classList.contains('hide')) {
            span1.classList.remove('hide')
        }

        fetch(baseURL + 'api/house/' + house.id, {
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
        const newHouseState = Object.assign(house, updateValues);
        navigate("/Houses/ViewHouse", { state: { house: newHouseState } })
        setRealOnly(true)
        handleClose()
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'family_id', headerName: 'Family ID', width: 250 },
        { field: 'family_head', headerName: 'Family Head', width: 450 },
        { field: 'added_by_name', headerName: 'Added By', width: 350, },
    ];

    const rows = house.Families.filter((item) => item.isDeleted === false).map(items => {
        const adminName = admins.find(it => it.id === items.added_by)?.name;
        return { ...items, added_by_name: adminName }
    });

    return (
        <div className="viewHouse">
            <div className="title">{house.house_name}'s Details
                <span id="editValues" onClick={handleEdit} className="editValues" >Edit House Details</span>
                <span id="updateHouse" onClick={handleSubmit} className="updateHouse hide" >Save Changes</span>
                <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleUpdate} title="Save Changes?" description="Do you really wish to update to changes made to this House?" />
            </div>
            <hr className="title-divider" />
            <div className="created">House Created On : {createdAt}</div>
            <div className="contentInformation">
                <div className="info-div">
                    <h6 className="heading">House information</h6>
                    <div className="info">
                        <div className="item">
                            <div className="label">House Name * : </div>
                            <TextField
                                error={formErrors.house_name_prop ? true : false}
                                id="house_name"
                                className="capitalize"
                                defaultValue={updateValues.house_name}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: readOnly,
                                }}
                                helperText={formErrors.house_name}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">House Number * : </div>
                            <TextField
                                error={formErrors.house_no_prop ? true : false}
                                id="house_no"
                                className="uppercase"
                                defaultValue={updateValues.house_no}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: readOnly,
                                }}
                                helperText={formErrors.house_no}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Panchayat House Number * : </div>
                            <TextField
                                error={formErrors.panchayat_house_no_prop ? true : false}
                                id="panchayat_house_no"
                                className="uppercase"
                                defaultValue={updateValues.panchayat_house_no}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: readOnly,
                                }}
                                helperText={formErrors.panchayat_house_no}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Created By : </div>
                            <TextField
                                id="added_by_name"
                                value={house.added_by_name || " "}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                    </div>
                </div>
            </div>
            <hr className="divider" />
            <DataTable title={"Families within  " + updateValues.house_name} add="" columns={columns} rows={rows} />
        </div>
    );
}

export default ViewHouse;