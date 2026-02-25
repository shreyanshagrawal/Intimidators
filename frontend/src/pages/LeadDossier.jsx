import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/api";
import Sidebar from "../components/Sidebar1";
import TopBar from "../components/TopBar";
import LeadHeader from "../components/LeadHeader";
import CompanySnapshot from "../components/CompanySnapshot";
import DetectedSignals from "../components/DetectedSignals";
import AIRecommendations from "../components/AIRecommendations";
import ConversionCard from "../components/ConversionCard";
import CompetitorAlert from "../components/CompetitorAlert";
import SmartActions from "../components/SmartActions";
import OfficerNotes from "../components/OfficerNotes";

export default function LeadDossier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLeadById(id);
      
      if (response.success) {
        setLead(response.data);
      } else {
        setError("Lead not found");
      }
    } catch (err) {
      console.error("Error fetching lead:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Lead not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <LeadHeader lead={lead} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            {/* LEFT */}
            <div className="xl:col-span-2 space-y-6">
              <CompanySnapshot lead={lead} />
              <DetectedSignals lead={lead} />
              <AIRecommendations lead={lead} />
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <ConversionCard lead={lead} />
              <CompetitorAlert lead={lead} />
              <SmartActions lead={lead} />
              <OfficerNotes lead={lead} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
