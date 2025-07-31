import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import Login from "./Login";
import ServiceGroupsTable from "./ServiceGroupsTable";

function AdminDashboard() {
  return <div>Welcome, Admin!</div>;
}

export default function App() {
  const { token } = useContext(AuthContext);

  return (
    <div>
      {token ? <ServiceGroupsTable /> : <Login />}
    </div>
  );
}
