import "./DataTable.scss";
import { Link } from "react-router-dom"
import { DataGrid } from "@mui/x-data-grid";

const DataTable = (props) => {
    return (
        <div className="manage">
            <div className="manageTitle">
                {props.title}
                <Link to={props.add} className={props.add ? "add" : "hide"}>
                    Add New
                </Link>
            </div>
            <div style={{ height: props.height ? props.height : 527, width: '100%', paddingTop: '15px' }}>
                <DataGrid
                    sx={{ fontFamily: 'Century Gothic' }}
                    rows={props.rows}
                    columns={props.columns}
                    pageSize={props.pagesize ? props.pagesize : 25}
                    rowsPerPageOptions={[props.pagesize ? props.pagesize : 25]}
                    checkboxSelection
                    initialState={{
                        sorting: {
                            sortModel: [{ field: props.sortField, sort: props.sortOrder }],
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default DataTable
