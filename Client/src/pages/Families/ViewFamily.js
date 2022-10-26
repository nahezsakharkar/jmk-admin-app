import "./Families.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";

import DataTable from "../../components/DataTable/DataTable";

import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';

const ViewFamily = () => {

    VerifyAccessToken();

    const location = useLocation()
    var { family } = location.state
    const [admins, setAdmins] = useState([])
    const token = adminAuth.accessToken;
    var arrayfamily = [family].map(items => {
        const adminName = admins.find(it => it.id === items.added_by)?.name;
        return { ...items, added_by_name: adminName }
    })
    family["added_by_name"] = arrayfamily[0].added_by_name

    useEffect(() => {
        fetch(baseURL + 'api/admin', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setAdmins(json))

    }, [token]);

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

    const date = new Date(family.createdAt.slice(0, -1));
    const createdAt = (toOrdinalSuffix(date.getDate()) + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear())

    const columns = [
        // { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Member Name', width: 270 },
        { field: 'email', headerName: 'Email Address', width: 280 },
        { field: 'contact', headerName: 'Phone Number', width: 180 },
        { field: 'active_status', headerName: 'Active Status', width: 150 },
        { field: 'added_by_name', headerName: 'Added By', width: 240 },
    ];

    const rows = family.Members.map(items => {
        const adminName = admins.find(it => it.id === items.added_by)?.name;
        return { ...items, added_by_name: adminName }
    });

    for (var i = 0; i < family.Members.length; i++) {
        if (family.Members[i].active_status === true) {
            family.Members[i].active_status = 'Active';
        }
        else if (family.Members[i].active_status === false) {
            family.Members[i].active_status = 'Inactive';
        }

        if (family.Members[i].head_of_family === true) {
            family.Members[i].head_of_family = 'Yes';
        }
        else if (family.Members[i].head_of_family === false) {
            family.Members[i].head_of_family = 'No';
        }
    }

    return (
        <div className="viewFamily">
            <div className="title">{family.family_head}'s Family Details
            </div>
            <hr className="title-divider" />
            <div className="created">Family Created On : {createdAt}</div>
            <div className="contentInformation">
                <div className="info-div">
                    <h6 className="heading">Family information</h6>
                    <div className="info">
                        <div className="item">
                            <div className="label">Family Identification : </div>
                            <TextField
                                id="standard-basic"
                                value={family.family_id || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Family Head : </div>
                            <TextField
                                id="standard-basic"
                                value={family.family_head || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                        <div className="item">
                            <div className="label">Created By : </div>
                            <TextField
                                id="standard-basic"
                                value={family.added_by_name || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                        </div>
                    </div>
                </div>
            </div>
            <hr className="divider" />
            <DataTable title={"Members within Family Of " + family.family_head} add="" columns={columns} rows={rows} />
        </div>
    );
}

export default ViewFamily;