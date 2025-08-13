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
import LoadingSpinner from "../LoadingSpinner";
import "./MonthlyChart.css";

const API_BASE_URL = "http://localhost:5000/api";

const MonthlyChart = ({ filters, onMonthClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthlyData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append("year", filters.year);
      if (filters.building) params.append("building", filters.building);

      const response = await fetch(`${API_BASE_URL}/energy/monthly?${params}`);
      const result = await response.json();

      if (result.success) {
        // Group data by month and sum consumption
        const monthlyData = {};
        result.data.forEach((item) => {
          const month = parseInt(item.month);
          if (!monthlyData[month]) {
            monthlyData[month] = {
              month,
              monthName: getMonthName(month),
              totalConsumption: 0,
              buildingCount: 0,
            };
          }
          monthlyData[month].totalConsumption += parseFloat(
            item.total_consumption
          );
          monthlyData[month].buildingCount++;
        });

        // Convert to array and sort by month
        const chartData = Object.values(monthlyData)
          .sort((a, b) => a.month - b.month)
          .map((item) => ({
            ...item,
            totalConsumption: Math.round(item.totalConsumption),
          }));

        setData(chartData);
      }
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    } finally {
      setLoading(false);
    }
  }, [filters.year, filters.building]);

  useEffect(() => {
    fetchMonthlyData();
  }, [fetchMonthlyData]);

  const getMonthName = (monthNum) => {
    const months = [
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
    return months[monthNum - 1];
  };

  const handleBarClick = (data) => {
    if (data && data.month) {
      onMonthClick(data.month);
    }
  };

  const formatTooltip = (value, name) => {
    if (name === "totalConsumption") {
      return [`${value.toLocaleString()} kWh`, "Total Consumption"];
    }
    return [value, name];
  };

  if (loading) {
    return (
      <div className="chart-loading">
        <h3>Monthly Energy Consumption</h3>
        <LoadingSpinner message="Loading monthly data..." />
      </div>
    );
  }

  return (
    <div className="monthly-chart">
      <h3>Monthly Energy Consumption ({filters.year})</h3>
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
          <XAxis dataKey="monthName" />
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
            fill="#007bff"
            cursor="pointer"
            onClick={handleBarClick}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-hint">
        💡 Click on a month bar to filter daily data
      </div>
    </div>
  );
};

export default MonthlyChart;
