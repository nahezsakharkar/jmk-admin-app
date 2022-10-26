import "./Families.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import OurModal from '../../components/OurModal/OurModal';

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Select from 'react-select'

const AddFamily = () => {

  VerifyAccessToken();

  const initialValues = { family_head: "", family_id: "", house_name: "default" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [createValues, setCreateValues] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [houses, setHouses] = useState([])
  const [families, setFamilies] = useState([])
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate()
  const token = adminAuth.accessToken;

  const capitalize = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

  useEffect(() => {
    fetch(baseURL + 'api/house', {
      headers: {
        token: `Bearer ${token}`
      }
    }).then(res => res.json()).then(json => setHouses(json));
  }, [token])

  const options = houses.map(function (item) {
    return {
      target: JSON.parse(`{"id":"house_name", "value":"${item.id}"}`),
      value: item.id,
      label: item.house_name
    }
  })

  const handleChange = (e) => {
    setIsSubmit(false);
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };
  
  const handleSubmit = () => {
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    if ((Object.keys(formErrors).length === 0 && isSubmit) === false) {
      var span = document.getElementById("createFamily");
      span.className += " shake"
    }
  };

  useEffect(() => {
    fetch(baseURL + 'api/family/', {
      headers: {
        token: `Bearer ${token}`
      }
    }).then(res => res.json()).then(json => setFamilies(json));
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      handleOpen();
    }
  }, [formErrors, isSubmit, token]);

  const validate = (values) => {
    const errors = {};
    if (!values.family_head) {
      errors.family_head = "Name of the Family Head is Required!";
    } else if (families.filter(obj => obj.family_head === values.family_head).length > 0) {
      errors.family_head = "A Family with this Family Head already Exists!";
    }

    if (!values.family_id) {
      errors.family_id = "Family ID is required!";
    }

    if (values.house_name === 'default') {
      errors.house_name = "This field is Required!";
    }

    setCreateValues({ family_head: capitalize(values.family_head), family_id: values.family_id.toUpperCase(), house_no: values.house_name })
    return errors;
  };


  function handleCreate() {
    fetch(baseURL + 'api/family/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${token}`
      },
      body: JSON.stringify(createValues),
    }).then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    navigate('/Families')
    window.location.reload(false)
    handleClose()
  }

  return (
    <div className="addFamily">
      <div className="title">
        Add New Family
        <span id="createFamily" onClick={handleSubmit} className="createFamily" >Create Family</span>
        <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleCreate} title="Create New Family?" description="Creating a Family will add a New Family data inside House Tree into the Database." />
      </div>
      <hr className="title-divider" />
      <form>
        <h6 className="heading">Family information</h6>
        <div className="info">
          <div className="row">
            <div className="col">
              <div className="form-group focused">
                <label htmlFor="family_head">Family Head</label>
                <input style={{ textTransform: 'capitalize' }} type="text" id="family_head" onChange={handleChange} className="form-control" placeholder="Example Name" />
                <span className="error">{formErrors.family_head}</span>
              </div>
            </div>
            <div className="col">
              <div className="form-group focused">
                <label htmlFor="family_id">Family ID</label>
                <input style={{ textTransform: 'uppercase' }} type="text" id="family_id" onChange={handleChange} className="form-control" placeholder="F00145" />
                <span className="error">{formErrors.family_id}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="house_name">House Name</label>
                <Select inputId="house_name" options={options} onChange={handleChange} className="search-options" defaultValue={{ target: JSON.parse('{"id":"house_name", "value":"default"}'), value: 'default', label: 'Example House' }} />
                <span className="error">{formErrors.house_name}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddFamily;