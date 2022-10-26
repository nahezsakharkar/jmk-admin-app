import "./Login.scss";
import { baseURL } from "../../helpers/URLs";
import { VerifyAccessTokenForLogin } from "../../helpers/TokenExpiredLogin";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import PersonIcon from '@mui/icons-material/Person';
import HttpsIcon from '@mui/icons-material/Https';

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState("")
    const [error1, setError1] = useState(false)
    const [error2, setError2] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(baseURL + 'api/auth/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data)
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [email, password]);


    function handleSubmit() {
        if (user === 'No User Found') {
            setError2(false)
            setError1(true)
        }
        else if (user === 'Wrong Credentials') {
            setError1(false)
            setError2(true)
        }
        else if (user === 'No User Found' || user === 'Wrong Credentials') {
            setError2(false)
            setError1(true)
        }
        else {
            setError1(false)
            setError2(false)
            localStorage.setItem("Admin Credentials", JSON.stringify(user))
            navigate('/Dashboard')
            window.location.reload(false)
        }
    }

    VerifyAccessTokenForLogin();

    return (
        <div className='login'>
            <div className='loginBlock'>
                <div className="logo">
                    <img src={require('../../assets/logo.png')} alt="Jamatul Muslimeen Kolthare, Ratnagiri" />
                </div>
                <div className="field">
                    <label htmlFor="login_email"><PersonIcon className="icon" /></label>
                    <input id="login_email" autoComplete="new-password" onChange={(e) => setEmail(e.target.value)} type="email" name="email" className="form_input" placeholder="Email" required />
                </div>
                <div className="field">
                    <label htmlFor="login_password"><HttpsIcon className="icon" /></label>
                    <input id="login_password" autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} type="password" name="password" className="form_input" placeholder="Password" required />
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