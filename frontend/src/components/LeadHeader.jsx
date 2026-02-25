import React from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeadHeader({ lead }) {
  const navigate = useNavigate();

  if (!lead) return null;

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[#0b2a4a]">
                {lead.company_name}
              </h1>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                lead.type === 'tender' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {lead.type?.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-600 mb-4">
              {lead.title || lead.description?.substring(0, 100) || 'Business Opportunity'}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              {lead.location && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{lead.location || lead.state}</span>
                </div>
              )}
              {lead.industry_sector && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Industry:</span>
                  <span className="font-medium">{lead.industry_sector}</span>
                </div>
              )}
              {lead.source_url && (
                <a
                  href={lead.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  Source <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-sm text-gray-500">Overall Score</div>
              <div className={`text-3xl font-bold ${getScoreColor(lead.overall_score)}`}>
                {lead.overall_score ? `${(lead.overall_score * 100).toFixed(0)}%` : 'N/A'}
              </div>
            </div>
            
            {lead.estimated_value && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Est. Value</div>
                <div className="text-xl font-bold text-[#0b2a4a]">
                  ₹{(lead.estimated_value / 10000000).toFixed(1)} Cr
                </div>
              </div>
            )}

            {lead.deadline && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Deadline</div>
                <div className="text-sm font-medium text-red-600">
                  {new Date(lead.deadline).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
