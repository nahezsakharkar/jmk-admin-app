import "./Header.scss";
import { adminAuth } from "../../helpers/AdminInformation";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="header">
        <Link to="/Dashboard" style={{ textDecoration: "none" }}>
          <div className="logoDiv">
            <img src={require('../../assets/logo purple.png')} alt="Jamatul Muslimeen Kolthare, Ratnagiri" /><span className="logo">Jamatul Muslimeen Kolthare</span>
          </div>
        </Link>
        <div className="nameDiv">
          <span className="name">{adminAuth.name}</span>
          <span className="position">{adminAuth.position}</span>
        </div>

      </div>
    </header>
  )
}

export default Header