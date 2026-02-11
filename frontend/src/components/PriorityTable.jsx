import React from "react";
import { useNavigate } from "react-router-dom";

export default function PriorityTable({ leads = [] }) {
  const navigate = useNavigate();

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-4">
          Priority Action Items (Hot Leads)
        </h2>
        <p className="text-gray-500 text-center py-8">
          No leads found for your state. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">
        Priority Action Items (Hot Leads) - {leads.length} Found
      </h2>

      <table className="min-w-full text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="text-left py-2">Company</th>
            <th className="text-left">Industry</th>
            <th className="text-left">Signal</th>
            <th className="text-left">Products</th>
            <th className="text-left">Score</th>
            <th className="text-left">Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.slice(0, 20).map((lead) => (
            <Row 
              key={lead.id} 
              lead={lead} 
              onClick={() => navigate(`/lead/${lead.id}`)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ lead, onClick }) {
  const getSignalColor = (strength) => {
    switch (strength) {
      case 'high':
        return 'bg-red-100 text-red-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-600 font-semibold';
    if (score >= 0.6) return 'text-yellow-600 font-semibold';
    return 'text-gray-600';
  };

  return (
    <tr className="border-t border-slate-200 hover:bg-gray-50 cursor-pointer" onClick={onClick}>
      <td className="py-3 font-medium">{lead.company_name}</td>
      <td className="text-gray-600">{lead.industry_sector || 'N/A'}</td>
      <td>
        <span className={`px-2 py-1 rounded text-xs ${getSignalColor(lead.signal_strength)}`}>
          {lead.signal_strength || 'N/A'}
        </span>
      </td>
      <td className="text-gray-600">
        {lead.products_recommended?.slice(0, 2).join(', ') || 'Various'}
      </td>
      <td className={getScoreColor(lead.overall_score)}>
        {lead.overall_score ? `${(lead.overall_score * 100).toFixed(0)}%` : 'N/A'}
      </td>
      <td>
        <span className={`px-2 py-1 rounded text-xs ${lead.type === 'tender' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
          {lead.type}
        </span>
      </td>
      <td>
        <button className="border px-3 py-1 rounded text-sm hover:bg-gray-100 transition">
          Review
        </button>
      </td>
    </tr>
  );
}
