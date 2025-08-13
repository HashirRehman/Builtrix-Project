import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import pool from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    console.log("🔄 Initializing database...");

    // Read and execute schema
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schema);
    console.log("✅ Database schema created successfully");

    // Create indexes
    const indexesPath = path.join(__dirname, "indexes.sql");
    if (fs.existsSync(indexesPath)) {
      const indexes = fs.readFileSync(indexesPath, "utf8");
      await pool.query(indexes);
      console.log("✅ Database indexes created successfully");
    }

    // Check if users table is empty and seed default user
    const userCount = await pool.query("SELECT COUNT(*) FROM users");
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log("🔄 Seeding default user...");

      const defaultPassword = "admin123";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await pool.query(
        `
        INSERT INTO users (first_name, last_name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
      `,
        ["John", "Doe", "admin@builtrix.tech", hashedPassword, "admin"]
      );

      console.log("✅ Default user created:");
      console.log("   📧 Email: admin@builtrix.tech");
      console.log("   🔐 Password: admin123");
    } else {
      console.log("ℹ️  Users table already contains data, skipping seed");
    }

    console.log("✅ Database initialization completed");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

export default initializeDatabase;
