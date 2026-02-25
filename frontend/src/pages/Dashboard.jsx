import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import DashboardOverview from "../components/DashboardOverview";
import PriorityTable from "../components/PriorityTable";

export default function Dashboard() {
  const { user, login } = useAuth();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentState, setCurrentState] = useState(user?.state || "");

  useEffect(() => {
    if (user) {
      setCurrentState(user.state);
    }
  }, [user]);

  useEffect(() => {
    if (currentState) {
      fetchData();
    }
  }, [currentState]);

  const fetchData = async () => {
    if (!currentState) return;

    try {
      setLoading(true);
      
      // Fetch leads and stats based on current state
      const [leadsResponse, statsResponse] = await Promise.all([
        apiService.getAllLeads(currentState),
        apiService.getDashboardStats(currentState)
      ]);

      if (leadsResponse.success) {
        setLeads(leadsResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (newState) => {
    console.log("Changing state view to:", newState);
    setCurrentState(newState);
    
    // Update user's state in context and localStorage
    if (user) {
      const updatedUser = { ...user, state: newState };
      login(updatedUser); // This updates localStorage
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar (handles its own responsiveness) */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TopBar with state change handler */}
        <TopBar onStateChange={handleStateChange} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
              <p className="font-medium">Error loading dashboard</p>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={fetchData}
                className="mt-3 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <DashboardOverview stats={stats} state={currentState} />
              <PriorityTable leads={leads} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
