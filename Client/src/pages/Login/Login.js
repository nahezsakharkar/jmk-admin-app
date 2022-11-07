import "./Login.scss";
import { baseURL } from "../../helpers/URLs";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isExpired } from "react-jwt";
import PersonIcon from '@mui/icons-material/Person';
import HttpsIcon from '@mui/icons-material/Https';
import swal from 'sweetalert';

const Login = () => {
    const [formValues, setFormValues] = useState({ email: "", password: "" });
    const [error1, setError1] = useState(false)
    const [error2, setError2] = useState(false)
    const Data = localStorage.getItem('Admin Credentials')
    const existanceOfData = Data !== null
    const navigate = useNavigate()

    useEffect(() => {
        if (existanceOfData) {
            if (Data && Data !== 'undefined') {
                const tokenExpired = isExpired(JSON.parse(Data).accessToken);
                if (!tokenExpired) {
                    navigate("/Dashboard")
                } else {
                    localStorage.removeItem("Admin Credentials");
                }
            } else {
                localStorage.removeItem("Admin Credentials");
            }
        }
    }, [Data, existanceOfData, navigate])

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
    };

    function handleSubmit() {
        fetch(baseURL + 'api/auth/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                if (data === 'No User Found') {
                    setError2(false)
                    setError1(true)
                }
                else if (data === 'Wrong Credentials') {
                    setError1(false)
                    setError2(true)
                }
                else if (data === 'No User Found' || data === 'Wrong Credentials') {
                    setError2(false)
                    setError1(true)
                }
                else {
                    setError1(false)
                    setError2(false)
                    localStorage.setItem("Admin Credentials", JSON.stringify(data))
                    navigate('/Dashboard')
                    window.location.reload(false)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                swal({
                    title: "Error!",
                    text: "Failed to contact the Server! Login Failed!",
                    icon: "error",
                    button: "OK!",
                })
            });
    }

    return (
        <div className='login'>
            <div className='loginBlock'>
                <div className="logo">
                    <img src={require('../../assets/logo.png')} alt="Jamatul Muslimeen Kolthare, Ratnagiri" />
                </div>
                <div className="field">
                    <label htmlFor="email"><PersonIcon className="icon" /></label>
                    <input id="email" autoComplete="new-password" onChange={handleChange} type="email" name="email" className="form_input" placeholder="Email" required />
                </div>
                <div className="field">
                    <label htmlFor="password"><HttpsIcon className="icon" /></label>
                    <input id="password" autoComplete="new-password" onChange={handleChange} type="password" name="password" className="form_input" placeholder="Password" required />
                </div>
                <div className="field">
                    {error1 ? <span className="error">No User Found</span> : null}
                    {error2 ? <span className="error">Wrong Credentials</span> : null}
                </div>
                <div className="field">
                    <input onClick={handleSubmit} type="submit" value="Sign In" />
                </div>
            </div>
        </div>
    );
}

export default Login;