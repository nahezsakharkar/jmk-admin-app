import "./Houses.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import onlyForSuperAdmins from "../../helpers/OnlyForSuperAdmins";
import DataTable from "../../components/DataTable/DataTable";
import OurModal from "../../components/OurModal/OurModal";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

const Houses = () => {

    VerifyAccessToken();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [houses, setHouses] = useState([])
    const [deleteRow, setDeleteRow] = useState([])
    const [openError, setOpenError] = useState(false);
    const handleOpenError = () => setOpenError(true);
    const handleCloseError = () => setOpenError(false);
    const navigate = useNavigate()
    const token = adminAuth.accessToken;

    useEffect(() => {
        fetch(baseURL + 'api/house', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setHouses(json));

    }, [token])

    function openModal(row) {
        setDeleteRow(row)
        handleOpen()
    };

    function goToFamilyPage() {
        navigate("/Families")
    }

    function handleDelete() {
        fetch(baseURL + 'api/house/' + deleteRow.id, {
            method: 'DELETE',
            headers: {
                token: `Bearer ${token}`
            }
        }).then((data) => {
            if (data.status === 304) {
                handleOpenError()
            } else {
                swal({
                    title: "Success!",
                    text: "This House was Successfully Deleted!",
                    icon: "success",
                    button: "OK!",
                }).then(function () {
                    window.location.reload(false)
                });
            }
        }).catch((error) => {
            console.error('Error:', error);
            swal({
                title: "Error!",
                text: "Failed to contact the Server! Delete Failed!",
                icon: "error",
                button: "OK!",
            }).then(function () {
                window.location.reload(false)
            });
        });
        handleClose()
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'house_no', headerName: 'House Number', width: 180, },
        { field: 'house_name', headerName: 'House Name', width: 350 },
        { field: 'panchayat_house_no', headerName: 'Panchayat House Number', width: 300 },
        {
            field: 'action',
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to="/Houses/ViewHouse" state={{ house: params.row }} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link>
                        {onlyForSuperAdmins ? <div
                            className="deleteButton" onClick={() => openModal(params.row)} >
                            Remove
                        </div> : null}
                        <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleDelete} title={"Remove " + deleteRow.house_name + "?"} description={"House can only be deleted if there are no Families in it.\nDo you really want to delete " + deleteRow.house_name + "? This action is irreversible. "} />

                        <OurModal open={openError} setOpen={setOpenError} handleOpen={handleOpenError} handleClose={handleCloseError} handleYes={goToFamilyPage} titleType="error" title={"Error Removing " + deleteRow.house_name + "!"} description={deleteRow.house_name + " is not Empty.\nRemove All Families from " + deleteRow.house_name + " First. Go to Families Page?"} />
                    </div>
                );
            },
        },
    ];

    const rows = houses;

    return (
        <DataTable title="Manage Houses" add="/Houses/AddHouse" columns={columns} rows={rows} />
    );
}

export default Houses;