import mongoose from 'mongoose';

const tenderSchema = new mongoose.Schema({
  lead_id: {
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
    default: 'tender'
  },
  source_url: String,
  products_recommended: [String],
  product_confidence: {
    type: Map,
    of: Number
  },
  industry_sector: String,
  location: String,
  facility_type: String,
  signals: [String],
  signal_strength: String,
  keywords_matched: [String],
  urgency_score: Number,
  confidence_score: Number,
  overall_score: Number,
  title: String,
  description: String,
  deadline: Date,
  estimated_value: Number,
  tender_id: String,
  next_action: String,
  discovery_date: Date,
  extraction_method: String,
  raw_context: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
tenderSchema.index({ overall_score: -1 });
tenderSchema.index({ location: 1 });
tenderSchema.index({ lead_id: 1 });

export default mongoose.model('Tender', tenderSchema);
