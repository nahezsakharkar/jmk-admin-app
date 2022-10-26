import "./Members.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import DataTable from "../../components/DataTable/DataTable";
import UpdateModal from "../../components/Members/Members Page/Update Modal";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Members = () => {

    VerifyAccessToken();

    const [members, setMembers] = useState([])
    const [updateRow, setUpdateRow] = useState([])
    const [openActiveModal, setOpenActiveModal] = useState(false);
    const handleOpenActiveModal = () => setOpenActiveModal(true);
    const handleCloseActiveModal = () => setOpenActiveModal(false);
    const [openInactiveModal, setOpenInactiveModal] = useState(false);
    const handleOpenInactiveModal = () => setOpenInactiveModal(true);
    const handleCloseInactiveModal = () => setOpenInactiveModal(false);
    const token = adminAuth.accessToken;

    useEffect(() => {
        fetch(baseURL + 'api/member/details', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setMembers(json));

    }, [token])

    function openModal(row) {
        setUpdateRow(row)
        if (row.active_status === "Active") {
            handleOpenActiveModal()
        } else if (row.active_status === "Inactive") {
            handleOpenInactiveModal()
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 350 },
        { field: 'family_id', headerName: 'Family ID', width: 170 },
        { field: 'active_status', headerName: 'Status', width: 150 },
        { field: 'head_of_family', headerName: 'Head of the Family', width: 230, },
        {
            field: 'action',
            headerName: "Action",
            width: 180,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to="/Members/ViewMember" state={{ member: params.row }} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link>
                        <div>
                            {params.row.active_status === "Inactive" ? <div className="activeButton"
                                onClick={() => openModal(params.row)}
                            >Mark Active</div> : null}
                            {params.row.active_status === "Active" ? <div className="inactiveButton"
                                onClick={() => openModal(params.row)}
                            >Mark Inactive</div> : null}
                        </div>
                        <UpdateModal open={openActiveModal} setOpen={setOpenActiveModal} handleOpen={handleOpenActiveModal} handleClose={handleCloseActiveModal} row={updateRow} />
                        <UpdateModal open={openInactiveModal} setOpen={setOpenInactiveModal} handleOpen={handleOpenInactiveModal} handleClose={handleCloseInactiveModal} row={updateRow} />
                    </div>
                );
            },
        },
    ];

    for (var i = 0; i < members.length; i++) {
        if (members[i].active_status === 1) {
            members[i].active_status = 'Active';
        }
        else if (members[i].active_status === 0) {
            members[i].active_status = 'Inactive';
        }

        if (members[i].head_of_family === 1) {
            members[i].head_of_family = 'Yes';
        }
        else if (members[i].head_of_family === 0) {
            members[i].head_of_family = 'No';
        }
    }

    const rows = members;

    return (
        <div className="membersPage">
            <DataTable title="Manage Members" add="/Members/AddMember" columns={columns} rows={rows} />
        </div>
    );
}

export default Members;