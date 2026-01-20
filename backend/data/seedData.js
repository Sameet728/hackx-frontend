import mongoose from 'mongoose';
import dotenv from 'dotenv';
import csvtojson from 'csvtojson';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import HealthIncident from '../models/HealthIncident.js';
import SanitationComplaint from '../models/SanitationComplaint.js';
import EnvironmentalData from '../models/EnvironmentalData.js';

// Load environment variables
dotenv.config();

// Get current directory path (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Seed Data Script
 * Reads CSV files and populates MongoDB with geospatial data
 * Usage: node data/seedData.js
 */

/**
 * Transform CSV row to HealthIncident document with GeoJSON
 */
const transformHealthIncident = (row) => {
  return {
    diseaseType: row.diseaseType,
    area: row.area,
    location: {
      type: 'Point',
      coordinates: [parseFloat(row.lng), parseFloat(row.lat)] // [longitude, latitude]
    },
    severity: row.severity,
    reportedDate: new Date(row.reportedDate)
  };
};

/**
 * Transform CSV row to SanitationComplaint document with GeoJSON
 */
const transformSanitationComplaint = (row) => {
  return {
    category: row.category,
    area: row.area,
    location: {
      type: 'Point',
      coordinates: [parseFloat(row.lng), parseFloat(row.lat)]
    },
    status: row.status,
    reportedDate: new Date(row.reportedDate)
  };
};

/**
 * Transform CSV row to EnvironmentalData document with GeoJSON
 */
const transformEnvironmentalData = (row) => {
  const doc = {
    type: row.type,
    area: row.area,
    location: {
      type: 'Point',
      coordinates: [parseFloat(row.lng), parseFloat(row.lat)]
    },
    recordedDate: new Date(row.recordedDate)
  };

  // Add type-specific fields
  if (row.type === 'air') {
    doc.pm25 = parseFloat(row.pm25);
    doc.pm10 = parseFloat(row.pm10);
  } else if (row.type === 'water') {
    doc.waterQualityIndex = parseFloat(row.waterQualityIndex);
  }

  return doc;
};

/**
 * Read CSV file and transform to array of documents
 */
const readCSV = async (filename, transformFunc) => {
  const filePath = join(__dirname, filename);
  console.log(`📄 Reading ${filename}...`);
  
  const jsonArray = await csvtojson().fromFile(filePath);
  const transformed = jsonArray.map(transformFunc);
  
  console.log(`✓ Loaded ${transformed.length} records from ${filename}`);
  return transformed;
};

/**
 * Create 2dsphere index for geospatial queries
 */
const createGeospatialIndexes = async () => {
  console.log('\n🗺️  Creating 2dsphere indexes...');
  
  await HealthIncident.collection.createIndex({ location: '2dsphere' });
  console.log('✓ Created 2dsphere index on HealthIncident.location');
  
  await SanitationComplaint.collection.createIndex({ location: '2dsphere' });
  console.log('✓ Created 2dsphere index on SanitationComplaint.location');
  
  await EnvironmentalData.collection.createIndex({ location: '2dsphere' });
  console.log('✓ Created 2dsphere index on EnvironmentalData.location');
};

// Placeholder for data arrays (will be loaded from CSV)

/**
 * Main seed function
 */
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    console.log('\n�️  Clearing existing data...');
    await HealthIncident.deleteMany({});
    await SanitationComplaint.deleteMany({});
    await EnvironmentalData.deleteMany({});
    console.log('✓ Existing data cleared');

    // Read CSV files
    console.log('\n📊 Reading CSV files...');
    const [healthIncidents, sanitationComplaints, environmentalData] = await Promise.all([
      readCSV('health_incidents_pune_300_rows.csv', transformHealthIncident),
      readCSV('sanitation_complaints_pune_300_rows.csv', transformSanitationComplaint),
      readCSV('environmental_data_pune_300_rows.csv', transformEnvironmentalData)
    ]);

    // Insert data
    console.log('\n💾 Inserting data into MongoDB...');
    
    const insertedHealthIncidents = await HealthIncident.insertMany(healthIncidents);
    console.log(`✓ Inserted ${insertedHealthIncidents.length} health incidents`);

    const insertedComplaints = await SanitationComplaint.insertMany(sanitationComplaints);
    console.log(`✓ Inserted ${insertedComplaints.length} sanitation complaints`);

    const insertedEnvData = await EnvironmentalData.insertMany(environmentalData);
    console.log(`✓ Inserted ${insertedEnvData.length} environmental data records`);

    // Create geospatial indexes
    await createGeospatialIndexes();

    // Summary
    const totalRecords = insertedHealthIncidents.length + 
                        insertedComplaints.length + 
                        insertedEnvData.length;

    console.log('\n' + '='.repeat(60));
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log(`\n📈 Summary:`);
    console.log(`  - Health Incidents: ${insertedHealthIncidents.length}`);
    console.log(`  - Sanitation Complaints: ${insertedComplaints.length}`);
    console.log(`  - Environmental Data: ${insertedEnvData.length}`);
    console.log(`  - TOTAL RECORDS: ${totalRecords}`);
    console.log(`\n🗺️  GeoJSON Format: All records stored with location.type = "Point"`);
    console.log(`📍 Coordinates: [longitude, latitude] format for Leaflet compatibility`);
    console.log(`📅 Dates: Converted to JavaScript Date objects for time-series analysis`);
    console.log(`🔍 Indexes: 2dsphere indexes created for efficient geospatial queries\n`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
