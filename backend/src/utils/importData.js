import fs from "fs";
import path from "path";
import csv from "csv-parser";
import pool from "../db/index.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

const __dirname = path.resolve();

const importMetadata = async () => {
  const filePath = path.join(__dirname, "data/metadata.csv");
  const rows = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath, { encoding: 'utf8' })
      .pipe(csv({ 
        skipEmptyLines: true,
        stripBOM: true  // This removes the BOM
      }))
      .on("data", (data) => {
        // Clean up the keys to remove any BOM or special characters
        const cleanData = {};
        Object.keys(data).forEach(key => {
          const cleanKey = key.replace(/^\ufeff/, '').trim(); // Remove BOM if present
          cleanData[cleanKey] = data[key];
        });
        
        if (!cleanData.cpe || cleanData.cpe.trim() === "") {
          console.warn(`Skipping row due to missing CPE: ${JSON.stringify(cleanData)}`);
          return;
        }
        rows.push(cleanData);
      })
      .on("end", async () => {
        try {
          console.log(`Processing ${rows.length} metadata records...`);
          
          for (const row of rows) {
            const query = `
              INSERT INTO metadata (cpe, lat, lon, totalarea, name, fulladdress) 
              VALUES ($1, $2, $3, $4, $5, $6)
              ON CONFLICT (cpe) DO NOTHING
            `;
            const values = [
              row.cpe,
              parseFloat(row.lat) || null,
              parseFloat(row.lon) || null,
              parseFloat(row.totalarea) || null,
              row.name,
              row.fulladdress
            ];
            
            await pool.query(query, values);
          }
          
          console.log(`✅ Imported ${rows.length} metadata records`);
          resolve();
        } catch (err) {
          console.error("Error importing metadata:", err.message);
          reject(err);
        }
      })
      .on("error", reject);
  });
};

const importSmartMeter = async () => {
  const filePath = path.join(__dirname, "data/smart_meter.csv");
  const rows = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath, { encoding: 'utf8' })
      .pipe(csv({ 
        skipEmptyLines: true,
        stripBOM: true
      }))
      .on("data", (data) => {
        // Clean up the keys
        const cleanData = {};
        Object.keys(data).forEach(key => {
          const cleanKey = key.replace(/^\ufeff/, '').trim();
          cleanData[cleanKey] = data[key];
        });
        
        if (!cleanData.cpe || !cleanData.timestamp) {
          console.warn(`Skipping row due to missing data: ${JSON.stringify(cleanData)}`);
          return;
        }
        
        // Parse the timestamp format DD-MM-YYYY HH:mm
        const parsed = dayjs(cleanData.timestamp, "DD-MM-YYYY HH:mm", true);
        if (!parsed.isValid()) {
          console.warn(`Skipping row due to invalid timestamp: ${cleanData.timestamp}`);
          return;
        }
        
        rows.push({
          cpe: cleanData.cpe,
          timestamp: parsed.format("YYYY-MM-DD HH:mm:ss"),
          active_energy: parseFloat(cleanData.active_energy) || 0
        });
      })
      .on("end", async () => {
        try {
          console.log(`Processing ${rows.length} smart meter records...`);
          
          // Insert in batches for better performance
          const batchSize = 1000;
          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            
            for (const row of batch) {
              const query = `
                INSERT INTO smart_meter (cpe, timestamp, active_energy) 
                VALUES ($1, $2, $3)
              `;
              await pool.query(query, [row.cpe, row.timestamp, row.active_energy]);
            }
            
            console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(rows.length / batchSize)}`);
          }
          
          console.log(`✅ Imported ${rows.length} smart meter records`);
          resolve();
        } catch (err) {
          console.error("Error importing smart meter data:", err.message);
          reject(err);
        }
      })
      .on("error", reject);
  });
};

const importEnergySourceBreakdown = async () => {
  const filePath = path.join(__dirname, "data/energy_source_breakdown.csv");
  const rows = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath, { encoding: 'utf8' })
      .pipe(csv({ 
        skipEmptyLines: true,
        stripBOM: true
      }))
      .on("data", (data) => {
        // Clean up the keys
        const cleanData = {};
        Object.keys(data).forEach(key => {
          const cleanKey = key.replace(/^\ufeff/, '').trim();
          cleanData[cleanKey] = data[key];
        });
        
        if (!cleanData.timestamp) {
          console.warn(`Skipping row due to missing timestamp: ${JSON.stringify(cleanData)}`);
          return;
        }
        
        // Parse the timestamp format DD-MM-YYYY HH:mm
        const parsed = dayjs(cleanData.timestamp, "DD-MM-YYYY HH:mm", true);
        if (!parsed.isValid()) {
          console.warn(`Skipping row due to invalid timestamp: ${cleanData.timestamp}`);
          return;
        }
        
        rows.push({
          timestamp: parsed.format("YYYY-MM-DD HH:mm:ss"),
          renewable: parseFloat(cleanData.renewable) || 0,
          renewable_biomass: parseFloat(cleanData.renewable_biomass) || 0,
          renewable_hydro: parseFloat(cleanData.renewable_hydro) || 0,
          renewable_solar: parseFloat(cleanData.renewable_solar) || 0,
          renewable_wind: parseFloat(cleanData.renewable_wind) || 0,
          renewable_geothermal: parseFloat(cleanData.renewable_geothermal) || 0,
          renewable_otherrenewable: parseFloat(cleanData.renewable_otherrenewable) || 0,
          nonrenewable: parseFloat(cleanData.nonrenewable) || 0,
          nonrenewable_coal: parseFloat(cleanData.nonrenewable_coal) || 0,
          nonrenewable_gas: parseFloat(cleanData.nonrenewable_gas) || 0,
          nonrenewable_nuclear: parseFloat(cleanData.nonrenewable_nuclear) || 0,
          nonrenewable_oil: parseFloat(cleanData.nonrenewable_oil) || 0,
          hydropumpedstorage: parseFloat(cleanData.hydropumpedstorage) || 0,
          unknown: parseFloat(cleanData.unknown) || 0
        });
      })
      .on("end", async () => {
        try {
          console.log(`Processing ${rows.length} energy source breakdown records...`);
          
          for (const row of rows) {
            const query = `
              INSERT INTO energy_source_breakdown (
                timestamp, renewable, renewable_biomass, renewable_hydro, 
                renewable_solar, renewable_wind, renewable_geothermal, 
                renewable_otherrenewable, nonrenewable, nonrenewable_coal, 
                nonrenewable_gas, nonrenewable_nuclear, nonrenewable_oil, 
                hydropumpedstorage, unknown
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            `;
            
            const values = [
              row.timestamp, row.renewable, row.renewable_biomass, row.renewable_hydro,
              row.renewable_solar, row.renewable_wind, row.renewable_geothermal,
              row.renewable_otherrenewable, row.nonrenewable, row.nonrenewable_coal,
              row.nonrenewable_gas, row.nonrenewable_nuclear, row.nonrenewable_oil,
              row.hydropumpedstorage, row.unknown
            ];
            
            await pool.query(query, values);
          }
          
          console.log(`✅ Imported ${rows.length} energy source breakdown records`);
          resolve();
        } catch (err) {
          console.error("Error importing energy source breakdown:", err.message);
          reject(err);
        }
      })
      .on("error", reject);
  });
};

const runImport = async () => {
  try {
    console.log("🚀 Starting data import...");
    
    console.log("\n📊 Importing metadata...");
    await importMetadata();
    
    console.log("\n⚡ Importing smart meter data...");
    await importSmartMeter();
    
    console.log("\n🔋 Importing energy source breakdown...");
    await importEnergySourceBreakdown();
    
    console.log("\n✅ All data imported successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Import failed:", err.message);
    process.exit(1);
  }
};

runImport();
