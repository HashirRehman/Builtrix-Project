import pool from "../db/index.js";

// Get building metadata with geolocation
export const getMetadata = async (req, res) => {
  try {
    const query = `
      SELECT
        cpe,
        lat,
        lon,
        totalarea,
        name,
        fulladdress,
        (SELECT SUM(active_energy) FROM smart_meter WHERE smart_meter.cpe = metadata.cpe) as total_consumption
      FROM metadata
      ORDER BY name
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows,
      message: "Building metadata retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get monthly aggregated energy consumption
export const getMonthlyConsumption = async (req, res) => {
  try {
    const { year, building } = req.query;

    let query = `
      SELECT
        sm.cpe,
        md.name,
        EXTRACT(YEAR FROM sm.timestamp) as year,
        EXTRACT(MONTH FROM sm.timestamp) as month,
        SUM(sm.active_energy) as total_consumption
      FROM smart_meter sm
      JOIN metadata md ON sm.cpe = md.cpe
    `;

    const queryParams = [];
    const conditions = [];

    if (year) {
      conditions.push(
        `EXTRACT(YEAR FROM sm.timestamp) = $${queryParams.length + 1}`
      );
      queryParams.push(year);
    }

    if (building) {
      conditions.push(`sm.cpe = $${queryParams.length + 1}`);
      queryParams.push(building);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += `
      GROUP BY sm.cpe, md.name, year, month
      ORDER BY year, month, md.name
    `;

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows,
      message: "Monthly consumption data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching monthly consumption:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get daily aggregated energy consumption
export const getDailyConsumption = async (req, res) => {
  try {
    const { year, month, building } = req.query;

    let query = `
      SELECT
        sm.cpe,
        md.name,
        EXTRACT(YEAR FROM sm.timestamp) as year,
        EXTRACT(MONTH FROM sm.timestamp) as month,
        EXTRACT(DAY FROM sm.timestamp) as day,
        SUM(sm.active_energy) as total_consumption
      FROM smart_meter sm
      JOIN metadata md ON sm.cpe = md.cpe
    `;

    const queryParams = [];
    const conditions = [];

    if (year) {
      conditions.push(
        `EXTRACT(YEAR FROM sm.timestamp) = $${queryParams.length + 1}`
      );
      queryParams.push(year);
    }

    if (month) {
      conditions.push(
        `EXTRACT(MONTH FROM sm.timestamp) = $${queryParams.length + 1}`
      );
      queryParams.push(month);
    }

    if (building) {
      conditions.push(`sm.cpe = $${queryParams.length + 1}`);
      queryParams.push(building);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += `
      GROUP BY sm.cpe, md.name, year, month, day
      ORDER BY year, month, day, md.name
    `;

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows,
      message: "Daily consumption data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching daily consumption:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get 15-minute consumption data
export const getFifteenMinConsumption = async (req, res) => {
  try {
    const { year, month, day, building } = req.query;

    let query = `
      SELECT
        sm.cpe,
        md.name,
        sm.timestamp,
        sm.active_energy
      FROM smart_meter sm
      JOIN metadata md ON sm.cpe = md.cpe
    `;

    const queryParams = [];
    const conditions = [];

    if (year) {
      conditions.push(
        `EXTRACT(YEAR FROM sm.timestamp) = $${queryParams.length + 1}`
      );
      queryParams.push(year);
    }

    if (month) {
      conditions.push(
        `EXTRACT(MONTH FROM sm.timestamp) = $${queryParams.length + 1}`
      );
      queryParams.push(month);
    }

    if (day) {
      conditions.push(
        `EXTRACT(DAY FROM sm.timestamp) = $${queryParams.length + 1}`
      );
      queryParams.push(day);
    }

    if (building) {
      conditions.push(`sm.cpe = $${queryParams.length + 1}`);
      queryParams.push(building);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY sm.timestamp, md.name`;

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows,
      message: "15-minute consumption data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching 15-minute consumption:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get energy source breakdown
export const getEnergySourceBreakdown = async (req, res) => {
  try {
    const { year, month, day, building } = req.query;

    let query = `
      SELECT
        esb.timestamp,
        esb.renewable,
        esb.renewable_biomass,
        esb.renewable_hydro,
        esb.renewable_solar,
        esb.renewable_wind,
        esb.renewable_geothermal,
        esb.renewable_otherrenewable,
        esb.nonrenewable,
        esb.nonrenewable_coal,
        esb.nonrenewable_gas,
        esb.nonrenewable_nuclear,
        esb.nonrenewable_oil,
        esb.hydropumpedstorage,
        esb.unknown
      FROM energy_source_breakdown esb
    `;

    const queryParams = [];
    const conditions = [];

    if (year) {
      conditions.push(
        `EXTRACT(YEAR FROM esb.timestamp) = $${queryParams.length + 1}`
      );
      queryParams.push(year);
    }

    if (month) {
      conditions.push(
        `EXTRACT(MONTH FROM esb.timestamp) = $${queryParams.length + 1}`
      );
      queryParams.push(month);
    }

    if (day) {
      conditions.push(
        `EXTRACT(DAY FROM esb.timestamp) = $${queryParams.length + 1}`
      );
      queryParams.push(day);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY esb.timestamp`;

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows,
      message: "Energy source breakdown retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching energy source breakdown:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
