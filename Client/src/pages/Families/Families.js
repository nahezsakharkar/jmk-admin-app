import "./Families.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import onlyForSuperAdmins from "../../helpers/OnlyForSuperAdmins";
import DataTable from "../../components/DataTable/DataTable";
import OurModal from "../../components/OurModal/OurModal";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import swal from 'sweetalert';

const Families = () => {

    VerifyAccessToken();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [families, setFamilies] = useState([])
    const [houses, setHouses] = useState([])
    const [deleteRow, setDeleteRow] = useState([])
    const token = adminAuth.accessToken;

    useEffect(() => {
        fetch(baseURL + 'api/house', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setHouses(json));

        fetch(baseURL + 'api/family', {
            headers: {
                token: `Bearer ${token}`
            }
        }).then(res => res.json()).then(json => setFamilies(json));

    }, [token])

    function openModal(row) {
        setDeleteRow(row)
        handleOpen()
    };

    function handleDelete() {
        fetch(baseURL + 'api/family/' + deleteRow.id, {
            method: 'DELETE',
            headers: {
                token: `Bearer ${token}`
            }
        }).then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          swal({
            title: "Success!",
            text: "This Family was Successfully Deleted!",
            icon: "success",
            button: "OK!",
          }).then(function () {
            window.location.reload(false)
          });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      handleClose()
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'family_id', headerName: 'Family ID', width: 180 },
        { field: 'family_head', headerName: 'Family Head', width: 360 },
        { field: 'house_name', headerName: 'House Name', width: 300, },
        {
            field: 'action',
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to="/Families/ViewFamily" state={{ family: params.row }} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link>
                        {onlyForSuperAdmins ? <div
                            className="deleteButton" onClick={() => openModal(params.row)} >
                            Remove
                        </div> : null}
                        <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleDelete} title={"Remove " + deleteRow.family_head + "'s Family?"} description={"Deleting a Family will result in inactivity of Members belonging to this Family. This action is irreversible. "} />
                    </div>
                );
            },
        },
    ];

    const rows = families.map(items => {
        const houseName = houses.find(it => it.id === items.house_no)?.house_name;
        return { ...items, house_name: houseName }
    });

    return (
        <DataTable title="Manage Families" add="" columns={columns} rows={rows} />
    );
}

export default Families;