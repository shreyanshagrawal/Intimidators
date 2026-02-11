import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import Tender from '../backend/models/Tender.js';
import Website from '../backend/models/Website.js';

async function uploadAllData() {
  try {
    console.log('====================================');
    console.log('  HPCL Leads Data Upload Script');
    console.log('====================================\n');

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected successfully!\n');

    // Upload Tenders
    console.log('--- Uploading Tenders ---');
    const tendersPath = path.join(__dirname, '../webscraper/tendors.json');
    const tendersData = JSON.parse(fs.readFileSync(tendersPath, 'utf8'));
    console.log(`Found ${tendersData.length} tenders`);
    
    await Tender.deleteMany({});
    console.log('Cleared existing tender data');
    
    let tendersUploaded = 0;
    const tenderBatchSize = 100;
    
    for (let i = 0; i < tendersData.length; i += tenderBatchSize) {
      const batch = tendersData.slice(i, i + tenderBatchSize);
      try {
        await Tender.insertMany(batch, { ordered: false });
        tendersUploaded += batch.length;
      } catch (error) {
        if (error.code === 11000) {
          tendersUploaded += batch.length - (error.writeErrors?.length || 0);
        }
      }
      console.log(`Progress: ${tendersUploaded}/${tendersData.length}`);
    }
    
    console.log(`✓ Uploaded ${tendersUploaded} tenders\n`);

    // Upload Websites
    console.log('--- Uploading Companies ---');
    const websitesPath = path.join(__dirname, '../webscraper/websites.json');
    const websitesData = JSON.parse(fs.readFileSync(websitesPath, 'utf8'));
    console.log(`Found ${websitesData.length} companies`);
    
    await Website.deleteMany({});
    console.log('Cleared existing company data');
    
    let websitesUploaded = 0;
    const websiteBatchSize = 100;
    
    for (let i = 0; i < websitesData.length; i += websiteBatchSize) {
      const batch = websitesData.slice(i, i + websiteBatchSize);
      try {
        await Website.insertMany(batch, { ordered: false });
        websitesUploaded += batch.length;
      } catch (error) {
        if (error.code === 11000) {
          websitesUploaded += batch.length - (error.writeErrors?.length || 0);
        }
      }
      console.log(`Progress: ${websitesUploaded}/${websitesData.length}`);
    }
    
    console.log(`✓ Uploaded ${websitesUploaded} companies\n`);

    // Summary
    console.log('====================================');
    console.log('  Upload Summary');
    console.log('====================================');
    console.log(`Tenders:   ${tendersUploaded}`);
    console.log(`Companies: ${websitesUploaded}`);
    console.log(`Total:     ${tendersUploaded + websitesUploaded}`);
    console.log('====================================\n');

    console.log('✓ All data uploaded successfully!');

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the upload
uploadAllData();
