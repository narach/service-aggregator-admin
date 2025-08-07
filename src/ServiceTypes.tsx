import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./ServiceGroupsTable.css"; // reuse the same table styles
import { ServiceCategory, ServiceType } from "./types/service";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ServiceTypes() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext is undefined. Make sure AuthProvider is mounted.");
  }
  const { token } = auth;
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState("");

  // Fetch service categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/service-categories/list`, {
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
  }, [token]);

  // Fetch service types, filtered by category if selected
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        setError("");
        let url = `${API_BASE}/api/admin/service-types`;
        if (selectedCategory !== "all") {
          url += `?categoryId=${selectedCategory}`;
        }
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch service types");
        const data: ServiceType[] = await res.json();
        setServiceTypes(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      }
    };
    fetchServiceTypes();
  }, [token, selectedCategory]);

  return (
    <div>
      <h2>Service Types</h2>
      {/* Filter Dropdown */}
      <div style={{ marginBottom: "1em" }}>
        <label>
          Filter by Service Category:{" "}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map(category => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
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
            <th style={{ width: "20%" }}>Category</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {serviceTypes.map(serviceType => (
            <tr key={serviceType.id}>
              <td>{serviceType.id}</td>
              <td>{serviceType.name}</td>
              <td>{serviceType.category?.name || "—"}</td>
              <td className="description-cell">{serviceType.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
