import "./JMK.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from '../../components/OurModal/OurModal';

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import swal from 'sweetalert';

const AddYear = () => {

  VerifyAccessToken();

  const initialValues = { start_year: "", end_year: "", amount: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [createValues, setCreateValues] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [years, setYears] = useState([])
  const navigate = useNavigate()
  const token = adminAuth.accessToken;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setIsSubmit(false);
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleSubmit = () => {
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    var span = document.getElementById("createYear");
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
    fetch(baseURL + 'api/jmkYear/', {
      headers: {
        token: `Bearer ${token}`
      }
    }).then(res => res.json()).then(json => setYears(json));
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      handleOpen();
    }
  }, [formErrors, isSubmit, token]);

  const validate = (values) => {
    const errors = {};
    if (!values.start_year) {
      errors.start_year = "Start Year is required!";
    } else if (values.start_year.length < 4) {
      errors.start_year = "Start Year cannot be less than 4 Digits!";
    } else if (values.start_year.length > 4) {
      errors.start_year = "Start Year cannot be greater than 4 Digits!";
    } else if (years.filter(obj => obj.start_year === Number(values.start_year)).length > 0) {
      errors.start_year = "This Start Year is already Created!";
    }

    if (!values.end_year) {
      errors.end_year = "End Year is required!";
    } else if (values.end_year.length < 4) {
      errors.end_year = "End Year cannot be less than 4 Digits!";
    } else if (values.end_year.length > 4) {
      errors.end_year = "End Year cannot be greater than 4 Digits!";
    } else if (years.filter(obj => obj.end_year === Number(values.end_year)).length > 0) {
      errors.end_year = "This End Year is already Created!";
    }

    if (!values.amount) {
      errors.amount = "Amount is required!";
    } else if (values.amount.length > 10) {
      errors.amount = "Amount cannot be more than 10 Digits!";
    }

    setCreateValues({ start_year: values.start_year, end_year: values.end_year, amount: values.amount })
    return errors;
  };

  function handleCreate() {
    fetch(baseURL + 'api/jmkYear', {
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
          text: "This Year was Successfully Created!",
          icon: "success",
          button: "OK!",
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    navigate('/JMK')
    handleClose()
  }

  return (
    <div className="addYear">
      <div className="title">
        Add New JMK Year
        <span id="createYear" onClick={handleSubmit} className="saveChanges" >Create Year</span>
        <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleCreate} title={"Create Year " + createValues.start_year + " - " + createValues.end_year + "?"} description="Creating a Year will add a New JMK Year data into the Database." />
      </div>
      <hr className="title-divider" />
      <form>
        <h6 className="heading">Year information</h6>
        <div className="info">
          <div className="row">
            <div className="col">
              <div className="form-group focused">
                <label htmlFor="start_year">Start Year *</label>
                <input type="number" id="start_year" className="form-control" placeholder="2022" onChange={handleChange} />
                <span className="error">{formErrors.start_year}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="end_year">End Year *</label>
                <input type="number" id="end_year" className="form-control" placeholder="2023" onChange={handleChange} />
                <span className="error">{formErrors.end_year}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group focused">
                <label htmlFor="amount">Payable Amount *</label>
                <input type="number" id="amount" className="form-control" placeholder="₹500" onChange={handleChange} />
                <span className="error">{formErrors.amount}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddYear;