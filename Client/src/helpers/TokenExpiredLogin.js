import { isExpired } from "react-jwt";
import { useNavigate } from "react-router-dom";

export const VerifyAccessTokenForLogin = () => {
    const Data = localStorage.getItem('Admin Credentials')
    const existanceOfData = Data !== null
    const navigate = useNavigate()
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
}