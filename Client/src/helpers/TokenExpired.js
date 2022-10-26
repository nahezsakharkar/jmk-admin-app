import { isExpired } from "react-jwt";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const VerifyAccessToken = () => {
    const navigate = useNavigate()
    const Data = localStorage.getItem('Admin Credentials')
    const existanceOfData = Data !== null

    useEffect(() => {
        if (existanceOfData) {
            if (Data && Data !== 'undefined') {
                const tokenExpired = isExpired(JSON.parse(Data).accessToken);
                if (tokenExpired) {
                    navigate('/')
                }
            } else {
                navigate('/')
            }
        } else {
            navigate('/')
        }
    }, [Data, existanceOfData, navigate]);
}
