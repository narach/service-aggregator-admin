import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);

    const requestCode = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(`${API_BASE}/api/users/request-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone }),
            });
            if (!res.ok) {
                throw new Error("Failed to request code");
            }
            setStep(2);
        } catch (err) {
            setError(err.message);
        }
    };

    const submitCode = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(`${API_BASE}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone, code }),
            });
            if (!res.ok) {
                throw new Error("Invalid code or phone");
            }
            const data = await res.json();
            login(data.token);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            {step === 1 && (
                <form onSubmit={requestCode}>
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required
                    />
                    <button type="submit">Request Code</button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={submitCode}>
                    <input 
                        type="text" 
                        placeholder="6-digit code" 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            )}
            {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    );
}