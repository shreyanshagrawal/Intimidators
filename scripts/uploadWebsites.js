import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Website Schema (matching the model)
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
  company_id: { type: String, required: true, unique: true },
  company_name: { type: String, required: true },
  source_type: { type: String, default: 'company_website' },
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
  createdAt: { type: Date, default: Date.now }
});

const Website = mongoose.model('Website', websiteSchema);

async function uploadWebsites() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');

    // Read the JSON file
    const jsonPath = path.join(__dirname, '../webscraper/websites.json');
    console.log(`Reading data from: ${jsonPath}`);
    
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const websites = JSON.parse(rawData);
    
    console.log(`Found ${websites.length} companies to upload`);

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing website data...');
    await Website.deleteMany({});
    
    // Insert websites in batches
    const batchSize = 100;
    let uploaded = 0;
    
    for (let i = 0; i < websites.length; i += batchSize) {
      const batch = websites.slice(i, i + batchSize);
      
      try {
        await Website.insertMany(batch, { ordered: false });
        uploaded += batch.length;
        console.log(`Uploaded ${uploaded}/${websites.length} companies...`);
      } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
          console.log(`Skipped ${error.writeErrors?.length || 0} duplicate companies in batch`);
          uploaded += batch.length - (error.writeErrors?.length || 0);
        } else {
          throw error;
        }
      }
    }

    console.log(`\n✓ Successfully uploaded ${uploaded} companies!`);
    console.log(`\nSample company:`, await Website.findOne().lean());

  } catch (error) {
    console.error('Error uploading companies:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the upload
uploadWebsites();
