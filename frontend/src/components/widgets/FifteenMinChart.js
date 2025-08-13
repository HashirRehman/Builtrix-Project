import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./FifteenMinChart.css";

const API_BASE_URL = "http://localhost:5000/api";

const FifteenMinChart = ({ filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFifteenMinData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);
      if (filters.day) params.append("day", filters.day);
      if (filters.building) params.append("building", filters.building);

      const response = await fetch(`${API_BASE_URL}/energy/15min?${params}`);
      const result = await response.json();

      if (result.success) {
        // Process and format the data
        const chartData = result.data
          .slice(0, 96) // Limit to first 96 records (24 hours * 4 readings per hour)
          .map((item) => ({
            timestamp: new Date(item.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            consumption: parseFloat(item.active_energy),
            fullTimestamp: item.timestamp,
            buildingName: item.name,
          }));

        setData(chartData);
      }
    } catch (error) {
      console.error("Error fetching 15-minute data:", error);
    } finally {
      setLoading(false);
    }
  }, [filters.year, filters.month, filters.day, filters.building]);

  useEffect(() => {
    fetchFifteenMinData();
  }, [fetchFifteenMinData]);

  const formatTooltip = (value, name) => {
    if (name === "consumption") {
      return [`${value.toFixed(3)} kWh`, "15-min Consumption"];
    }
    return [value, name];
  };

  const getChartTitle = () => {
    if (filters.day && filters.month && filters.year) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `15-Minute Consumption - ${monthNames[filters.month - 1]} ${
        filters.day
      }, ${filters.year}`;
    }
    return "15-Minute Energy Consumption";
  };

  if (loading) {
    return (
      <div className="chart-loading">
        <h3>15-Minute Energy Consumption</h3>
        <div>Loading...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="chart-loading">
        <h3>15-Minute Energy Consumption</h3>
        <div>
          No data available. Click on a day in the daily chart to see 15-minute
          breakdown.
        </div>
      </div>
    );
  }

  return (
    <div className="fifteen-min-chart">
      <h3>{getChartTitle()}</h3>
      {filters.building && (
        <p className="chart-subtitle">
          Building: {data[0]?.buildingName || filters.building}
        </p>
      )}

      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            interval="preserveStartEnd"
            tick={{ fontSize: 10 }}
          />
          <YAxis
            tickFormatter={(value) => value.toFixed(2)}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={formatTooltip}
            labelStyle={{ color: "#333" }}
            contentStyle={{
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
            }}
          />
          <Line
            type="monotone"
            dataKey="consumption"
            stroke="#fd7e14"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-hint">
        📈 Showing 15-minute interval energy consumption
      </div>
    </div>
  );
};

export default FifteenMinChart;
