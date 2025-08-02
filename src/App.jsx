import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import Login from "./Login";
import ServiceGroupsTable from "./ServiceGroupsTable";
import ServiceCategories from "./ServiceCategories";
import ServiceTypes from "./ServiceTypes";

export default function App() {
  const { token } = useContext(AuthContext);
  const [selectedPage, setSelectedPage] = useState("groups");

  if (!token) return <Login />;

  return (
    <div>
      {/* Menu */}
      <nav style={{ marginBottom: "2em" }}>
        <button 
          onClick={() => setSelectedPage("groups")}
          style={{ marginRight: 8, fontWeight: selectedPage === "groups" ? "bold" : "normal" }}
        >
          Service Groups
        </button>
        <button 
          onClick={() => setSelectedPage("categories")}
          style={{ marginRight: 8, fontWeight: selectedPage === "categories" ? "bold" : "normal" }}
        >
          Service Categories
        </button>
        <button 
          onClick={() => setSelectedPage("types")}
          style={{ marginRight: 8, fontWeight: selectedPage === "types" ? "bold" : "normal" }}
        >
          Service Types
        </button>
      </nav>

      {/* Page Content */}
      {selectedPage === "groups" && <ServiceGroupsTable />}
      {selectedPage === "categories" && <ServiceCategories />}
      {selectedPage === "types" && <ServiceTypes />}
    </div>
  );
}
