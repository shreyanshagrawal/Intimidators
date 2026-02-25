import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Calendar, LogOut, MapPin, User, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Andaman and Nicobar Islands"
];

export default function TopBar({ onStateChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showStateMenu, setShowStateMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleStateChange = (newState) => {
    if (onStateChange) {
      onStateChange(newState);
    }
    setShowStateMenu(false);
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 relative z-10">
      
      {/* Search */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 w-full max-w-[420px]">
        <Search className="w-5 h-5 text-gray-400" />

        {/* Desktop input */}
        <input
          className="bg-transparent outline-none w-full text-sm hidden sm:block"
          placeholder="Search companies, tenders, or products..."
        />

        {/* Mobile placeholder */}
        <span className="text-sm text-gray-400 sm:hidden">
          Search…
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 sm:gap-6 ml-4">
        <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition" />
        <Calendar className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition" />

        {/* State Selector - Only show if user is logged in */}
        {user && (
          <div className="relative hidden md:block">
            <button 
              onClick={() => setShowStateMenu(!showStateMenu)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 transition"
            >
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{user.state}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* State Dropdown */}
            {showStateMenu && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowStateMenu(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto z-20">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                    CHANGE STATE VIEW
                  </div>
                  {INDIAN_STATES.map((state) => (
                    <button
                      key={state}
                      onClick={() => handleStateChange(state)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                        user.state === state ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {state}
                      {user.state === state && (
                        <span className="ml-2 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-[#0b2a4a] text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm hover:bg-[#0d3558] transition"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.name || user.email.split('@')[0]}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{user.state}</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Add profile page navigation when ready
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Profile Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="bg-[#0b2a4a] text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm whitespace-nowrap hover:bg-[#0d3558] transition"
          >
            Login
            <span className="hidden sm:inline"> / Register</span>
          </button>
        )}
      </div>
    </header>
  );
}
