import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import Divider from "../common/Divider";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Andaman and Nicobar Islands"
];

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !state) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.login(email, password, state);

      if (response.success) {
        const userData = {
          ...response.user,
          phone: phone || ""
        };
        login(userData);
        
        // Send WhatsApp notification if phone number provided
        if (phone) {
          try {
            await apiService.sendNotification(phone, state);
          } catch (err) {
            console.error("WhatsApp notification failed:", err);
          }
        }

        navigate("/");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-2">
        Sign in to Sales Dashboard
      </h2>
      <p className="text-sm text-gray-500 text-center mb-8">
        Please enter your official credentials
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Official Email ID"
          placeholder="e.g. rajesh.kumar@hpcl.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select your state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Phone Number (Optional - for WhatsApp notifications)"
          placeholder="e.g. +919876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Button 
          text={loading ? "Logging in..." : "🔒 Login Securely"} 
          disabled={loading}
          type="submit"
        />
      </form>

      <div className="text-center text-sm mt-4 text-gray-500">
        <button type="button" className="hover:underline">Forgot Password?</button>
      </div>

      <Divider text="OR SIGN IN WITH" />

      <button 
        type="button"
        className="w-full border rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
      >
        <span className="bg-[#0A2A5A] text-white text-xs px-2 py-1 rounded">
          HP
        </span>
        Login using HPCL SSO
      </button>

      <div className="mt-8 text-xs text-gray-400 text-center space-y-2">
        <p>Internal HPCL System – Authorized Personnel Only</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <span>🔐 256-bit Encryption</span>
          <span>📄 Full Audit Logging</span>
          <span>🧠 Explainable AI</span>
        </div>
      </div>
    </div>
  );
}
