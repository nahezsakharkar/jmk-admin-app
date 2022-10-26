import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from './layouts/Layout';

// pages -----------------------------------------
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import Admins from "./pages/Admins/Admins"
import Houses from "./pages/Houses/Houses"
import Families from "./pages/Families/Families"
import Members from "./pages/Members/Members"
import JMK from "./pages/JMK/JMK"
import Transactions from "./pages/Transactions/Transactions"
import Payments from "./pages/Payments/Payments"
import Account from "./pages/Account/Account"

// add pages---------------------------------------
import AddAdmin from "./pages/Admins/AddAdmin"
import AddHouse from "./pages/Houses/AddHouse"
// import AddFamily from "./pages/Families/AddFamily"
import AddMember from "./pages/Members/AddMember"
import AddYear from "./pages/JMK/AddYear"

// view pages
import ViewAdmin from "./pages/Admins/ViewAdmin"
import ViewHouse from "./pages/Houses/ViewHouse"
import ViewFamily from "./pages/Families/ViewFamily"
import ViewMember from "./pages/Members/ViewMember"
import ViewYear from "./pages/JMK/ViewYear"
import ViewTransaction from "./pages/Transactions/ViewTransaction"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route index path="Dashboard" element={<Dashboard />} />
          <Route path="Admins" element={<Admins />} />
          <Route path="Houses" element={<Houses />} />
          <Route path="Families" element={<Families />} />
          <Route path="Members" element={<Members />} />
          <Route path="JMK" element={<JMK />} />
          <Route path="Transactions" element={<Transactions />} />
          <Route path="Payments" element={<Payments />} />
          <Route path="Account" element={<Account />} />

          {/* add pages--------------------------------------- */}
          <Route path="/Admins/AddAdmin" element={<AddAdmin />} />
          <Route path="/Houses/AddHouse" element={<AddHouse />} />
          {/* <Route path="/Families/AddFamily" element={<AddFamily />} /> */}
          <Route path="/Members/AddMember" element={<AddMember />} />
          <Route path="/JMK/AddYear" element={<AddYear />} />

          {/* view pages--------------------------------------- */}
          <Route path="/Admins/ViewAdmin" element={<ViewAdmin />} />
          <Route path="/Houses/ViewHouse" element={<ViewHouse />} />
          <Route path="/Families/ViewFamily" element={<ViewFamily />} />
          <Route path="/Members/ViewMember" element={<ViewMember />} />
          <Route path="/JMK/ViewYear" element={<ViewYear />} />
          <Route path="/Transactions/ViewTransaction" element={<ViewTransaction />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
