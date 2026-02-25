import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Tender Schema (matching the model)
const tenderSchema = new mongoose.Schema({
  lead_id: { type: String, required: true, unique: true },
  company_name: { type: String, required: true },
  source_type: { type: String, default: 'tender' },
  source_url: String,
  products_recommended: [String],
  product_confidence: { type: Map, of: Number },
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
  createdAt: { type: Date, default: Date.now }
});

const Tender = mongoose.model('Tender', tenderSchema);

async function uploadTenders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');

    // Read the JSON file
    const jsonPath = path.join(__dirname, '../webscraper/tendors.json');
    console.log(`Reading data from: ${jsonPath}`);
    
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const tenders = JSON.parse(rawData);
    
    console.log(`Found ${tenders.length} tenders to upload`);

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing tender data...');
    await Tender.deleteMany({});
    
    // Insert tenders in batches
    const batchSize = 100;
    let uploaded = 0;
    
    for (let i = 0; i < tenders.length; i += batchSize) {
      const batch = tenders.slice(i, i + batchSize);
      
      try {
        await Tender.insertMany(batch, { ordered: false });
        uploaded += batch.length;
        console.log(`Uploaded ${uploaded}/${tenders.length} tenders...`);
      } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
          console.log(`Skipped ${error.writeErrors?.length || 0} duplicate tenders in batch`);
          uploaded += batch.length - (error.writeErrors?.length || 0);
        } else {
          throw error;
        }
      }
    }

    console.log(`\n✓ Successfully uploaded ${uploaded} tenders!`);
    console.log(`\nSample tender:`, await Tender.findOne().lean());

  } catch (error) {
    console.error('Error uploading tenders:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the upload
uploadTenders();
