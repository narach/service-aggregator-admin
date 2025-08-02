/// <reference types="vite/client" />
import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

const API_BASE: string = import.meta.env.VITE_API_BASE_URL as string;

interface LoginResponse {
  token: string;
}

export default function Login() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext is undefined. Make sure AuthProvider is mounted.");
  }
  const { login } = auth;

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const requestCode = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/users/request-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      if (!res.ok) {
        throw new Error("Failed to request code");
      }
      setStep(2);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    }
  };

  const submitCode = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code })
      });
      if (!res.ok) {
        throw new Error("Invalid code or phone");
      }
      const data: LoginResponse = await res.json();
      login(data.token);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
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
