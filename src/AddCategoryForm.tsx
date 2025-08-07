import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ServiceGroup } from "./types/service";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface AddCategoryFormProps {
  groups: ServiceGroup[];
  onCategoryAdded: () => void;
  onError: (error: string) => void;
}

export default function AddCategoryForm({ groups, onCategoryAdded, onError }: AddCategoryFormProps) {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext is undefined. Make sure AuthProvider is mounted.");
  }
  const { token } = auth;

  const [creating, setCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    groupId: ""
  });

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const maxLength = 'maxLength' in e.target ? e.target.maxLength : undefined;
    setNewCategory(prev => ({
      ...prev,
      [name]: value.slice(0, maxLength || undefined)
    }));
  };

  const addNewCategory = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    onError(""); // Clear previous errors
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/service-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          groupId: parseInt(newCategory.groupId)
        }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to create service category");
      }
      setNewCategory({ name: "", description: "", groupId: "" });
      onCategoryAdded(); // Notify parent to refresh the list
    } catch (err) {
      if (err instanceof Error) onError(err.message);
      else onError("Unknown error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ marginTop: "2em", padding: "1em", border: "1px solid #ccc", borderRadius: "4px" }}>
      <h3>Add New Category</h3>
      <form onSubmit={addNewCategory}>
        <div style={{ marginBottom: "1em" }}>
          <label>
            Category Name:
            <br />
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleNewCategoryChange}
              maxLength={60}
              required
              style={{ width: "100%", padding: "0.5em", marginTop: "0.25em" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            Category Description:
            <br />
            <textarea
              name="description"
              value={newCategory.description}
              onChange={handleNewCategoryChange}
              maxLength={300}
              rows={5}
              required
              style={{ width: "100%", padding: "0.5em", marginTop: "0.25em", resize: "vertical" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>
            Service Group:
            <br />
            <select
              name="groupId"
              value={newCategory.groupId}
              onChange={handleNewCategoryChange}
              required
              style={{ width: "100%", padding: "0.5em", marginTop: "0.25em" }}
            >
              <option value="">Select a group...</option>
              {groups.map(group => (
                <option key={group.id} value={group.id.toString()}>
                  {group.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={creating}
          style={{
            padding: "0.75em 1.5em",
            backgroundColor: creating ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: creating ? "not-allowed" : "pointer"
          }}
        >
          {creating ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
} 
