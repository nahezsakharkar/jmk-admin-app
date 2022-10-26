import "./Admins.scss";
import { baseURL } from "../../helpers/URLs";
import { adminAuth } from "../../helpers/AdminInformation";
import { VerifyAccessToken } from "../../helpers/TokenExpired";
import DataTable from "../../components/DataTable/DataTable";
import OurModal from '../../components/OurModal/OurModal';

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import swal from 'sweetalert';

const Admins = () => {

  VerifyAccessToken();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [admins, setAdmins] = useState([])
  const [deleteRow, setDeleteRow] = useState([])
  const token = adminAuth.accessToken;

  useEffect(() => {
    fetch(baseURL + 'api/admin', {
      headers: {
        token: `Bearer ${token}`
      }
    }).then(res => res.json()).then(json => setAdmins(json));

  }, [token])

  function openModal(row) {
    setDeleteRow(row)
    handleOpen()
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 350 },
    { field: 'position', headerName: 'Position', width: 250 },
    { field: 'admin_for', headerName: 'Admin for', width: 200, },
    {
      field: 'action', headerName: "Action", width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/Admins/ViewAdmin" state={{ admin: params.row }} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div className="deleteButton" onClick={() => openModal(params.row)} >
              Remove
            </div>
          </div>
        );
      },
    },
  ];

  const rows = admins;

  function handleDelete() {
    fetch(baseURL + 'api/admin/' + deleteRow.id, {
      method: 'DELETE',
      headers: {
        token: `Bearer ${token}`
      }
    }).then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        swal({
          title: "Success!",
          text: "This Admin was Successfully Deleted!",
          icon: "success",
          button: "Cool!",
        }).then(function () {
          window.location.reload(false)
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose()
  }

  return (
    <>
      <DataTable title="Manage Admins" add="/Admins/AddAdmin" columns={columns} rows={rows} />
      <OurModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} handleYes={handleDelete} title={"Remove " + deleteRow.name + " as Admin?"} description={"Do you really wish to Remove " + deleteRow.name + "'s Admin Privileges? That Person won't be Admin anymore. "} />
    </>
  );
}

export default Admins;