import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { ServiceGroup } from "./types/service";
import "./ServiceGroupsTable.css"; 

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ServiceGroupsTable() {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("AuthContext is undefined. Make sure AuthProvider is mounted.");
    }
    const { token } = auth;
    const [groups, setGroups] = useState<ServiceGroup[]>([]);
    const [error, setError] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState({ name: "", description: "" });
    const [newGroup, setNewGroup] = useState({ name: "", description: "" });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/admin/service-groups/list`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch service groups");
                }
                const data = await res.json();
                setGroups(data);
            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError("Unknown error");
            }
        };
        fetchGroups();
    }, [token]);

    const handleEdit = (group: ServiceGroup): void => {
        setEditId(group.id);
        setEditValues({ name: group.name, description: group.description });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value, maxLength } = e.target;
        setEditValues((prev) => ({
          ...prev,
          [name]: value.slice(0, maxLength ? maxLength : undefined),
        }));
    };

    const handleSave = async (id: number): Promise<void> => {
        setError(""); // Clear previous errors
        try {
            const res = await fetch(`${API_BASE}/api/admin/service-groups/${id}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                name: editValues.name,
                description: editValues.description,
                }),
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || "Failed to update service group");
            }

            setGroups((prev) =>
            prev.map((g) =>
                g.id === id ? { ...g, name: editValues.name, description: editValues.description } : g
            )
            );
            setEditId(null);
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("Unknown error"); 
        }
    };

    const handleDiscard = () => {
        setEditId(null);
    };

    const handleDelete = async (id: number): Promise<void> => {
        setError(""); // Clear previous errors
        if (!window.confirm("Are you sure you want to delete this service group?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/service-groups/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || "Failed to delete service group");
            }
            setGroups((prev) => prev.filter((g) => g.id !== id));
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("Unknown error");
        }
    }

    const addNewGroup = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError("");
        setCreating(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/service-groups`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newGroup),
            });
            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || "Failed to create service group");
            }
            // Optionally, you can fetch the updated list from the server:
            const updatedRes = await fetch(`${API_BASE}/api/admin/service-groups/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedGroups = await updatedRes.json();
            setGroups(updatedGroups);
            setNewGroup({ name: "", description: "" });
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError("Unknown error");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <h2>Service Groups</h2>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <table className="service-groups-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th style={{ width: "15%" }}>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group) => (
                        <tr key={group.id}>
                            <td>{group.id}</td>
                            <td>
                                {editId === group.id ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={editValues.name}
                                    maxLength={50}
                                    onChange={handleChange}
                                    style={{ width: "95%" }}
                                />
                                ) : (
                                    group.name
                                )}
                            </td>
                            <td className="description-cell">
                                {editId === group.id ? (
                                <textarea
                                    name="description"
                                    value={editValues.description}
                                    maxLength={300}
                                    onChange={handleChange}
                                    style={{ width: "98%", minHeight: "2.5em", resize: "vertical" }}
                                />
                                ) : (
                                    group.description
                                )}
                            </td>
                            <td>
                                {editId === group.id ? (
                                <>
                                    <span
                                        style={{ cursor: "pointer", marginRight: 8 }}
                                        title="Save"
                                        onClick={() => handleSave(group.id)}
                                    >
                                        💾
                                    </span>
                                    <span
                                        style={{ cursor: "pointer" }}
                                        title="Discard"
                                        onClick={handleDiscard}
                                    >
                                        ❌
                                    </span>
                                </>
                                ) : (
                                <>
                                    <span
                                        style={{ cursor: "pointer", marginRight: 8 }}
                                        title="Edit"
                                        onClick={() => handleEdit(group)}
                                    >
                                        ✏️
                                    </span>
                                    <span
                                        style={{ cursor: "pointer" }}
                                        title="Delete"
                                        onClick={() => handleDelete(group.id)}
                                    >
                                        🗑️
                                    </span>
                                </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: "2em", borderTop: "1px solid #ccc", paddingTop: "1em" }}>
                <h3>Create new group</h3>
                <form
                    onSubmit={addNewGroup}
                    style={{ display: "flex", flexDirection: "column", gap: "1em", maxWidth: 600 }}
                >
                    <div>
                        <label>
                            Name:{" "}
                            <input
                                type="text"
                                maxLength={50}
                                value={newGroup.name}
                                onChange={(e) =>
                                    setNewGroup((prev) => ({ ...prev, name: e.target.value }))
                                }
                                required
                                style={{ width: "60%" }}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Description:{" "}
                            <textarea
                                maxLength={300}
                                rows={6}
                                value={newGroup.description}
                                onChange={(e) =>
                                    setNewGroup((prev) => ({ ...prev, description: e.target.value }))
                                }
                                required
                                style={{ width: "90%", resize: "vertical" }}
                            />
                        </label>
                        <div style={{ fontSize: "0.9em", color: "#888" }}>
                            {newGroup.description.length}/300 characters
                        </div>
                    </div>
                    <button type="submit" disabled={creating}>
                        {creating ? "Saving..." : "Save"}
                    </button>
                </form>
            </div>
        </div>
    );
}