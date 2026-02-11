import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  project_name: String,
  project_description: String,
  project_status: String,
  project_city: String,
  project_state: String,
  project_country: String,
  project_location: String,
  project_location_source: String,
  project_location_confidence: String
}, { _id: false });

const projectOpportunitySchema = new mongoose.Schema({
  project_name: String,
  hpcl_role: String,
  estimated_requirement: String,
  procurement_stage: String
}, { _id: false });

const keyLeadSchema = new mongoose.Schema({
  contact_department: String,
  potential_value: String,
  timeline: String,
  decision_makers: String
}, { _id: false });

const hpclPartnershipSchema = new mongoose.Schema({
  overview: String,
  raw_materials_portfolio: [String],
  partnership_opportunities: [String],
  project_specific_opportunities: [projectOpportunitySchema],
  key_leads: [keyLeadSchema],
  competitive_advantages: [String],
  next_steps: [String]
}, { _id: false });

const websiteSchema = new mongoose.Schema({
  company_id: {
    type: String,
    required: true,
    unique: true
  },
  company_name: {
    type: String,
    required: true
  },
  source_type: {
    type: String,
    default: 'company_website'
  },
  source_url: String,
  projects: [projectSchema],
  industry_sector: String,
  location: String,
  facility_type: String,
  signals: [String],
  signal_strength: String,
  keywords_matched: [String],
  urgency_score: Number,
  confidence_score: Number,
  overall_score: Number,
  next_action: String,
  discovery_date: Date,
  extraction_method: String,
  hpcl_partnership_opportunities: hpclPartnershipSchema,
  city: String,
  state: String,
  country: String,
  location_source: String,
  location_confidence: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
websiteSchema.index({ overall_score: -1 });
websiteSchema.index({ state: 1 });
websiteSchema.index({ company_id: 1 });

export default mongoose.model('Website', websiteSchema);
