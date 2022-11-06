import "./Houses.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from '../../components/OurModal/OurModal';

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import swal from 'sweetalert';

const AddHouse = () => {

  VerifyAccessToken();

  const initialValues = { house_name: "", house_no: "", panchayat_house_no: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [createValues, setCreateValues] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [houses, setHouses] = useState([])
  const [houseName, setHouseName] = useState('')
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate()
  const token = adminAuth.accessToken;

  const capitalize = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

  const nameHandleChange = (e) => {
    handleChange(e);
    setHouseName(e.target.value)
  };

  const handleChange = (e) => {
    setIsSubmit(false);
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleSubmit = () => {
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    var span = document.getElementById("createHouse");
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
    fetch(baseURL + 'api/house', {
      headers: {
        token: `Bearer ${token}`
      }
    }).then(res => res.json()).then(json => setHouses(json));

    if (Object.keys(formErrors).length === 0 && isSubmit) {
      handleOpen();
    }
  }, [formErrors, isSubmit, token]);

  const validate = (values) => {
    const errors = {};
    if (!values.house_name) {
      errors.house_name = "This field is Required!";
    } else if (houses.filter(obj => obj.house_name === values.house_name).length > 0) {
      errors.house_name = "This House already Exists!";
    }

    if (!values.house_no) {
      errors.house_no = "This field is Required!";
    } else if (houses.filter(obj => obj.house_no === values.house_no).length > 0) {
      errors.house_no = "This House Number already Exists!";
    }

    if (!values.panchayat_house_no) {
      errors.panchayat_house_no = "This field is Required!";
    } else if (houses.filter(obj => obj.panchayat_house_no === values.panchayat_house_no).length > 0) {
      errors.panchayat_house_no = "This Panchayat House Number already Exists!";
    }

    setCreateValues({ house_name: capitalize(values.house_name), house_no: values.house_no.toUpperCase(), panchayat_house_no: values.panchayat_house_no.toUpperCase() })
    return errors;
  };


  function handleCreate() {
    fetch(baseURL + 'api/house/', {
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
          text: "New House was Successfully Created!",
          icon: "success",
          button: "OK!",
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        swal({
          title: "Error!",
          text: "Failed to contact the Server! Create House Failed!",
          icon: "error",
          button: "OK!",
        });
      });
    navigate('/Houses')
    handleClose()
  }

  return (
    <div className="addHouse">
      <div className="title">
        Add New House
        <span id="createHouse" onClick={handleSubmit} className="createHouse" >Create House</span>
        <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleCreate} title={"Create " + houseName + "?"} description="Creating a House will add a New House data into the Database." />
      </div>
      <hr className="title-divider" />
      <form>
        <h6 className="heading">House information</h6>
        <div className="info">
          <div className="row">
            <div className="col">
              <div className="form-group focused">
                <label htmlFor="house_name">House Name *</label>
                <input style={{ textTransform: 'capitalize' }} type="text" id="house_name" onChange={nameHandleChange} className="form-control" placeholder="Example House" />
                <span className="error">{formErrors.house_name}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="house_no">House Number *</label>
                <input style={{ textTransform: 'uppercase' }} type="text" id="house_no" onChange={handleChange} className="form-control" placeholder="HN0001" />
                <span className="error">{formErrors.house_no}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group focused">
                <label htmlFor="panchayat_house_no">Panchayat House Number *</label>
                <input style={{ textTransform: 'uppercase' }} type="text" id="panchayat_house_no" onChange={handleChange} className="form-control" placeholder="PHN001" />
                <span className="error">{formErrors.panchayat_house_no}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddHouse;