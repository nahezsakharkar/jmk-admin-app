import "./Members.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from '../../components/OurModal/OurModal';

//date picker
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import swal from 'sweetalert';

const AddMember = () => {

  VerifyAccessToken();

  const initialValues = { house_name: "", name: "", email: "", head_of_family: "", family_head: "", active_status: "", active_from: "", inactivity_reason: "", contact: "", new_password: "", confirm_password: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [createValues, setCreateValues] = useState({});
  const [dateValue, setDateValue] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [houses, setHouses] = useState([])
  const [families, setFamilies] = useState([])
  const [members, setMembers] = useState([])
  const [memberName, setMemberName] = useState('')
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [eyeVisible, setEyeVisible] = useState(false);
  const navigate = useNavigate()
  const token = adminAuth.accessToken;

  const capitalize = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

  // for fetching houses,families & members
  useEffect(() => {
    fetch(baseURL + 'api/house', {
      headers: {
        token: `Bearer ${token}`
      }
    }).then(res => res.json()).then(json => setHouses(json));

  }, [token])

  // options for houses
  const optionsForHouses = houses.filter((item) => item.isDeleted === false).map(function (item) {
    return {
      value: item.id,
      label: item.house_name
    }
  })

  // Options For Head of the Family Yes or No 
  const optionsHOTF = [
    { target: JSON.parse('{"id":"head_of_family", "value":true}'), value: true, label: 'Yes' },
    { target: JSON.parse('{"id":"head_of_family", "value":false}'), value: false, label: 'No' }
  ]

  // function to handle house change
  const houseHandleChange = (house) => {
    setIsSubmit(false);
    formValues['house_name'] = house.value
    setFamilies(houses.filter(obj => obj.id === house.value)[0].Families)
  };

  // Options for Who is Head of the Family?
  const optionsFamilyHeads = families.filter((item) => item.isDeleted === false).map(function (item) {
    return {
      target: JSON.parse(`{"id":"family_head", "value":"${item.id}"}`),
      value: item.id,
      label: item.family_head
    }
  })

  // Options for isActive?
  const optionsActive = [
    { target: JSON.parse('{"id":"active_status", "value":true}'), value: true, label: 'Yes' },
    { target: JSON.parse('{"id":"active_status", "value":false}'), value: false, label: 'No' }
  ]

  // Options for inActive
  const optionsInActive = [
    { value: 'Student', label: 'Student' },
    { value: 'Unemployed', label: 'Unemployed' },
    { value: 'Deceased', label: 'Deceased' }
  ]

  const showPassword = (e) => {
    console.log(e.currentTarget.id)
    setEyeVisible(!eyeVisible);
    console.log(eyeVisible)
  };

  const dateHandleChange = (newValue) => {
    setIsSubmit(false);
    setDateValue(newValue)
    if (newValue) {
      formValues['active_from'] = newValue.toLocaleString().replace(/,/g, '').split(' ')[0].replace(/\//g, "-")
    }
  };

  const handleChangeInactive = (reason) => {
    setIsSubmit(false);
    formValues['inactivity_reason'] = reason.value
  };

  const headhandleChange = (e) => {
    setIsSubmit(false);
    handleChange(e);
    var familyHeadDiv = document.getElementById("family-head-div");
    if (e.value === true) {
      familyHeadDiv.classList.add("hide")
    } else if (e.value === false) {
      familyHeadDiv.classList.remove("hide")
    }
  }

  const activehandleChange = (e) => {
    setIsSubmit(false);
    handleChange(e);
    var activeScinceDiv = document.getElementById("active-since-div");
    var inactiveReasonDiv = document.getElementById("inactive-reason-div");
    if (e.value === true) {
      inactiveReasonDiv.classList.add("hide")
      activeScinceDiv.classList.remove("hide")
    } else if (e.value === false) {
      activeScinceDiv.classList.add("hide")
      inactiveReasonDiv.classList.remove("hide")
    }
  }

  const nameHandleChange = (e) => {
    handleChange(e);
    setMemberName(e.target.value)
  };

  const handleEmailFocus = () => {
    fetch(baseURL + 'api/member', {
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

  const handleSubmit = () => {
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    var span = document.getElementById("createMember");
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
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      handleOpen();
    }
  }, [formErrors, isSubmit]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.house_name) {
      errors.house_name = "This field is Required!";
    } else if (houses.filter(obj => obj.house_name === values.house_name).length > 0) {
      errors.house_name = "This House already Exists!";
    }

    if (!values.name) {
      errors.name = "Member Name is Required!";
    }

    if (!values.email) {
      errors.email = "Member Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid Email format!";
    } else if (members.filter(obj => obj.email === values.email).length > 0) {
      if (members.filter(obj => obj.email === values.email)[0].isDeleted === true) {
        errors.email = "This Email already Belongs to a Deleted Member, Please use some other Email!";
      } else {
        errors.email = "This Email is already Taken!";
      }
    }

    if (values.head_of_family === "") {
      errors.head_of_family = "This field is Required!";
    } else if (values.head_of_family === false) {
      if (!values.family_head) {
        errors.family_head = "Family Head is Required!";
      }
    }

    if (values.active_status === "") {
      errors.active_status = "This field is Required!";
    } else if (values.active_status === true) {
      if (!values.active_from) {
        errors.active_from = "This field is Required!";
      }
    } else if (values.active_status === false) {
      if (!values.inactivity_reason) {
        errors.inactivity_reason = "Inactivity Reason is Required!";
      }
    }

    if (values.contact.length < 10) {
      errors.contact = "Phone Number cannot be less than 10 Digits!";
    }

    if (!values.new_password) {
      errors.new_password = "Password cannot be empty!";
    } else if (values.new_password.length > 0 && values.new_password.length < 4) {
      errors.new_password = "Password must be more than 4 characters";
    } else if (values.new_password.length > 10) {
      errors.new_password = "Password cannot exceed more than 10 characters";
    } else if (values.confirm_password !== values.new_password) {
      errors.confirm_password = "Confirm Password Should be as same as New Password";
    } else {
      values.password = values.new_password;
    }


    if (values.head_of_family === true) {
      if (values.active_status === true) {
        setCreateValues({ name: capitalize(values.name), email: values.email.toLowerCase(), head_of_family: values.head_of_family, active_status: values.active_status, active_from: values.active_from, contact: values.contact, password: values.password, family: { family_head: capitalize(values.name), house_no: values.house_name } })
      }
      else {
        setCreateValues({ name: capitalize(values.name), email: values.email.toLowerCase(), head_of_family: values.head_of_family, active_status: values.active_status, inactivity_reason: values.inactivity_reason, contact: values.contact, password: values.password, family: { family_head: capitalize(values.name), house_no: values.house_name } })
      }
    } else {
      if (values.active_status === true) {
        setCreateValues({ name: capitalize(values.name), email: values.email.toLowerCase(), head_of_family: values.head_of_family, family_id: values.family_head, active_status: values.active_status, active_from: values.active_from, contact: values.contact, password: values.password })
      } else {
        setCreateValues({ name: capitalize(values.name), email: values.email.toLowerCase(), head_of_family: values.head_of_family, family_id: values.family_head, active_status: values.active_status, inactivity_reason: values.inactivity_reason, contact: values.contact, password: values.password })
      }
    }

    // setCreateValues({ name: capitalize(values.name), email: values.email.toLowerCase(), head_of_family: values.head_of_family, active_status: values.active_status, active_from: values.active_from, inactivity_reason: values.inactivity_reason, contact: values.contact, password: values.password, family: { family_head: values.family_head, house_no: values.house_name } })

    return errors;
  };


  function handleCreate() {
    fetch(baseURL + 'api/member/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${token}`
      },
      body: JSON.stringify(createValues),
    }).then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        swal({
          title: "Success!",
          text: "New Member was Successfully Created!",
          icon: "success",
          button: "OK!",
        }).then(navigate('/Members'));
      })
      .catch((error) => {
        console.error('Error:', error);
        swal({
          title: "Error!",
          text: "Failed to contact the Server! Create Member Failed!",
          icon: "error",
          button: "OK!",
        });
      });

    handleClose()
  }

  return (
    <div className="addMember">
      <div className="title">
        Add New Member
        <span id="createMember" onClick={handleSubmit} className="createMember" >Add Member</span>
        <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleCreate} title={"Add " + capitalize(memberName) + "?"} description="Adding a Member will add a New Member data inside the Family Tree into the Database." />
      </div>
      <hr className="title-divider" />
      <form>
        <h6 className="heading">House information</h6>
        <div className="info">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="house_name">House Name *</label>
                <Select inputId="house_name" options={optionsForHouses} onChange={houseHandleChange} className="search-options" defaultValue={{ target: JSON.parse('{"id":"house_name", "value":"default"}'), value: 'default', label: 'Example House' }} />
                <span className="error">{formErrors.house_name}</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="divider" />
        <h6 className="heading">Member information</h6>
        <div className="info">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input style={{ textTransform: 'capitalize' }} type="text" id="name" onChange={nameHandleChange} className="form-control" placeholder="Name" />
                <span className="error">{formErrors.name}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" onFocus={handleEmailFocus} onChange={handleChange} className="form-control" placeholder="member@example.com" />
                <span className="error">{formErrors.email}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-grp-3">
              <div className="form-group">
                <label htmlFor="head_of_family">is Head of the Family? *</label>
                <Select inputId="head_of_family" options={optionsHOTF} onChange={headhandleChange} className="search-options" defaultValue={{ target: JSON.parse('{"id":"head_of_family", "value":"default"}'), value: 'default', label: 'Yes or No' }} />
                <span className="error">{formErrors.head_of_family}</span>
              </div>
            </div>
            <div id="family-head-div" className="col col-grp-3 hide">
              <div className="form-group">
                <label htmlFor="family_head">Who is the Head of the Family? *</label>
                <Select inputId="family_head" options={optionsFamilyHeads} onChange={handleChange} className="search-options" defaultValue={{ target: JSON.parse('{"id":"family_head", "value":"default"}'), value: 'default', label: 'Search Your Family Head' }} />
                <span className="error">{formErrors.family_head}</span>
              </div>
            </div>
            <div className="col col-grp-3">
              <div className="form-group">
                <label htmlFor="active_status">is Active? *</label>
                <Select inputId="active_status" options={optionsActive} onChange={activehandleChange} className="search-options" defaultValue={{ target: JSON.parse('{"id":"active_status", "value":"default"}'), value: 'default', label: 'Yes or No' }} />
                <span className="error">{formErrors.active_status}</span>
              </div>
            </div>
            <div id="active-since-div" className="col col-grp-3 hide">
              <div className="form-group">
                <label htmlFor="active_from">Active Since? *</label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    inputId="active_status"
                    className="date-picker"
                    value={dateValue}
                    onChange={dateHandleChange}
                    renderInput={(params) => <TextField sx={{ height: '3rem', width: '100%' }} {...params} />}
                  />
                </LocalizationProvider>
                <span className="error">{formErrors.active_from}</span>
              </div>
            </div>
            <div id="inactive-reason-div" className="col col-grp-3 hide">
              <div className="form-group">
                <label htmlFor="inactivity_reason">Reason for being Inactive *</label>
                <CreatableSelect
                  isClearable
                  inputId="inactivity_reason"
                  options={optionsInActive}
                  onChange={handleChangeInactive}
                  className="search-options"
                  defaultValue={{ target: JSON.parse('{"id":"inactivity_reason", "value":"default"}'), value: 'default', label: 'Select or Create New' }}
                />
                <span className="error">{formErrors.inactivity_reason}</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="divider" />
        <h6 className="heading">Contact information</h6>
        <div className="info">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="contact">Phone Number *</label>
                <input type="number" id="contact" onChange={handleChange} className="form-control" placeholder="0123456789" />
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
              <div className="form-group">
                <label htmlFor="new_password">New Password *</label>
                <input type={eyeVisible ? "text" : "password"} id="new_password" onChange={handleChange} autoComplete="new-password" className="form-control" placeholder="Pass@123" />
                <span className="error">{formErrors.new_password}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="confirm_password">Confirm Password *</label>
                <input type={eyeVisible ? "text" : "password"} id="confirm_password" onChange={handleChange} autoComplete="new-password" className="form-control" placeholder="Pass@123" />
                <span className="error">{formErrors.confirm_password}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddMember;