import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./ServiceGroupsTable.css"; // reuse the same table styles
import { ServiceCategory, ServiceGroup } from "./types/service";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ServiceCategories() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext is undefined. Make sure AuthProvider is mounted.");
  }
  const { token } = auth;
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [error, setError] = useState("");

  // Fetch service groups for the dropdown
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/service-groups/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch service groups");
        const data: ServiceGroup[] = await res.json();
        setGroups(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      }
    };
    fetchGroups();
  }, [token]);

  // Fetch categories, filtered by group if selected
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError("");
        let url = `${API_BASE}/api/admin/service-categories/list`;
        if (selectedGroup !== "all") {
          url += `?groupId=${selectedGroup}`;
        }
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch service categories");
        const data: ServiceCategory[] = await res.json();
        setCategories(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      }
    };
    fetchCategories();
  }, [token, selectedGroup]);

  return (
    <div>
      <h2>Service Categories</h2>
      {/* Filter Dropdown */}
      <div style={{ marginBottom: "1em" }}>
        <label>
          Filter by Service Group:{" "}
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
          >
            <option value="all">All</option>
            {groups.map(group => (
              <option key={group.id} value={group.id.toString()}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table className="service-groups-table">
        <thead>
          <tr>
            <th>ID</th>
            <th style={{ width: "15%" }}>Name</th>
            <th style={{ width: "20%" }}>Group</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.group?.name || "—"}</td>
              <td className="description-cell">{cat.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
