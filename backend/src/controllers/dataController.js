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

// Export data endpoint for CSV/JSON downloads
export const exportData = async (req, res) => {
  try {
    const { type, building, year, month, day } = req.query;
    let query, result;

    switch (type) {
      case "metadata":
        query = `
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
        result = await pool.query(query);
        break;

      case "monthly":
        query = `
          SELECT
            sm.cpe,
            md.name,
            EXTRACT(YEAR FROM sm.timestamp) as year,
            EXTRACT(MONTH FROM sm.timestamp) as month,
            SUM(sm.active_energy) as total_consumption
          FROM smart_meter sm
          JOIN metadata md ON sm.cpe = md.cpe
        `;

        const monthlyParams = [];
        const monthlyConditions = [];

        if (year) {
          monthlyConditions.push(
            `EXTRACT(YEAR FROM sm.timestamp) = $${monthlyParams.length + 1}`
          );
          monthlyParams.push(year);
        }

        if (building) {
          monthlyConditions.push(`sm.cpe = $${monthlyParams.length + 1}`);
          monthlyParams.push(building);
        }

        if (monthlyConditions.length > 0) {
          query += ` WHERE ${monthlyConditions.join(" AND ")}`;
        }

        query += ` GROUP BY sm.cpe, md.name, year, month ORDER BY year, month, md.name`;
        result = await pool.query(query, monthlyParams);
        break;

      case "daily":
        query = `
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

        const dailyParams = [];
        const dailyConditions = [];

        if (year) {
          dailyConditions.push(
            `EXTRACT(YEAR FROM sm.timestamp) = $${dailyParams.length + 1}`
          );
          dailyParams.push(year);
        }

        if (month) {
          dailyConditions.push(
            `EXTRACT(MONTH FROM sm.timestamp) = $${dailyParams.length + 1}`
          );
          dailyParams.push(month);
        }

        if (building) {
          dailyConditions.push(`sm.cpe = $${dailyParams.length + 1}`);
          dailyParams.push(building);
        }

        if (dailyConditions.length > 0) {
          query += ` WHERE ${dailyConditions.join(" AND ")}`;
        }

        query += ` GROUP BY sm.cpe, md.name, year, month, day ORDER BY year, month, day, md.name`;
        result = await pool.query(query, dailyParams);
        break;

      case "fifteenmin":
        query = `
          SELECT
            sm.cpe,
            md.name,
            sm.timestamp,
            sm.active_energy
          FROM smart_meter sm
          JOIN metadata md ON sm.cpe = md.cpe
        `;

        const fifteenParams = [];
        const fifteenConditions = [];

        if (year) {
          fifteenConditions.push(
            `EXTRACT(YEAR FROM sm.timestamp) = $${fifteenParams.length + 1}`
          );
          fifteenParams.push(year);
        }

        if (month) {
          fifteenConditions.push(
            `EXTRACT(MONTH FROM sm.timestamp) = $${fifteenParams.length + 1}`
          );
          fifteenParams.push(month);
        }

        if (day) {
          fifteenConditions.push(
            `EXTRACT(DAY FROM sm.timestamp) = $${fifteenParams.length + 1}`
          );
          fifteenParams.push(day);
        }

        if (building) {
          fifteenConditions.push(`sm.cpe = $${fifteenParams.length + 1}`);
          fifteenParams.push(building);
        }

        if (fifteenConditions.length > 0) {
          query += ` WHERE ${fifteenConditions.join(" AND ")}`;
        }

        // Limit to prevent very large exports
        query += ` ORDER BY sm.timestamp, md.name LIMIT 10000`;
        result = await pool.query(query, fifteenParams);
        break;

      default:
        return res.status(400).json({
          success: false,
          message:
            "Invalid export type. Use: metadata, monthly, daily, or fifteenmin",
        });
    }

    res.json({
      success: true,
      data: result.rows,
      message: `${type} data exported successfully`,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
