import { adminAuth } from "./AdminInformation";

const onlyForSuperAdmins = adminAuth.position === "Superadmin" ? true : false

export default onlyForSuperAdmins;
