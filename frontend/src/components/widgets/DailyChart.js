import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./DailyChart.css";

const API_BASE_URL = "http://localhost:5000/api";

const DailyChart = ({ filters, onDayClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDailyData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);
      if (filters.building) params.append("building", filters.building);

      const response = await fetch(`${API_BASE_URL}/energy/daily?${params}`);
      const result = await response.json();

      if (result.success) {
        // Group data by day and sum consumption
        const dailyData = {};
        result.data.forEach((item) => {
          const day = parseInt(item.day);
          const month = parseInt(item.month);
          const year = parseInt(item.year);

          // Only show data for the selected month, or most recent month if none selected
          if (filters.month && month !== filters.month) return;
          if (filters.year && year !== filters.year) return;

          if (!dailyData[day]) {
            dailyData[day] = {
              day,
              dayLabel: `Day ${day}`,
              totalConsumption: 0,
              buildingCount: 0,
              month,
              year,
            };
          }
          dailyData[day].totalConsumption += parseFloat(item.total_consumption);
          dailyData[day].buildingCount++;
        });

        // Convert to array and sort by day
        const chartData = Object.values(dailyData)
          .sort((a, b) => a.day - b.day)
          .map((item) => ({
            ...item,
            totalConsumption: Math.round(item.totalConsumption),
          }));

        setData(chartData);
      }
    } catch (error) {
      console.error("Error fetching daily data:", error);
    } finally {
      setLoading(false);
    }
  }, [filters.year, filters.month, filters.building]);

  useEffect(() => {
    fetchDailyData();
  }, [fetchDailyData]);

  const handleBarClick = (data) => {
    if (data && data.day) {
      onDayClick(data.day);
    }
  };

  const formatTooltip = (value, name) => {
    if (name === "totalConsumption") {
      return [`${value.toLocaleString()} kWh`, "Daily Consumption"];
    }
    return [value, name];
  };

  const getChartTitle = () => {
    if (filters.month && filters.year) {
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
      return `Daily Consumption - ${monthNames[filters.month - 1]} ${
        filters.year
      }`;
    }
    if (filters.year) {
      return `Daily Consumption - ${filters.year} (Most Recent Month)`;
    }
    return "Daily Energy Consumption";
  };

  if (loading) {
    return (
      <div className="chart-loading">
        <h3>Daily Energy Consumption</h3>
        <div>Loading...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="chart-loading">
        <h3>Daily Energy Consumption</h3>
        <div>
          No data available. Click on a month in the monthly chart to see daily
          breakdown.
        </div>
      </div>
    );
  }

  return (
    <div className="daily-chart">
      <h3>{getChartTitle()}</h3>
      {filters.building && (
        <p className="chart-subtitle">
          Filtered by building: {filters.building}
        </p>
      )}

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dayLabel" />
          <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`} />
          <Tooltip
            formatter={formatTooltip}
            labelStyle={{ color: "#333" }}
            contentStyle={{
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
            }}
          />
          <Bar
            dataKey="totalConsumption"
            fill="#28a745"
            cursor="pointer"
            onClick={handleBarClick}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-hint">
        💡 Click on a day bar to filter 15-minute data
      </div>
    </div>
  );
};

export default DailyChart;
