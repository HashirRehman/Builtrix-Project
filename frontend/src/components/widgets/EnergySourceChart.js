import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "./EnergySourceChart.css";

const API_BASE_URL = "http://localhost:5000/api";

const EnergySourceChart = ({ filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnergySourceData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);
      if (filters.day) params.append("day", filters.day);

      const response = await fetch(`${API_BASE_URL}/energy/sources?${params}`);
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        // Calculate averages across all records
        const totals = result.data.reduce(
          (acc, item) => {
            acc.renewable += parseFloat(item.renewable || 0);
            acc.nonrenewable += parseFloat(item.nonrenewable || 0);
            acc.hydropumpedstorage += parseFloat(item.hydropumpedstorage || 0);
            acc.unknown += parseFloat(item.unknown || 0);
            return acc;
          },
          { renewable: 0, nonrenewable: 0, hydropumpedstorage: 0, unknown: 0 }
        );

        const count = result.data.length;

        // Convert to percentages and create chart data
        const chartData = [
          {
            name: "Renewable",
            value: (totals.renewable / count) * 100,
            color: "#28a745",
          },
          {
            name: "Non-Renewable",
            value: (totals.nonrenewable / count) * 100,
            color: "#dc3545",
          },
          {
            name: "Hydro Pumped Storage",
            value: (totals.hydropumpedstorage / count) * 100,
            color: "#17a2b8",
          },
          {
            name: "Unknown",
            value: (totals.unknown / count) * 100,
            color: "#6c757d",
          },
        ].filter((item) => item.value > 0); // Only show sources with data

        setData(chartData);
      }
    } catch (error) {
      console.error("Error fetching energy source data:", error);
    } finally {
      setLoading(false);
    }
  }, [filters.year, filters.month, filters.day]);

  useEffect(() => {
    fetchEnergySourceData();
  }, [fetchEnergySourceData]);

  const formatTooltip = (value, name) => {
    return [`${value.toFixed(1)}%`, name];
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getChartTitle = () => {
    if (filters.day && filters.month && filters.year) {
      return `Energy Source Breakdown - Day ${filters.day}`;
    }
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
      return `Energy Source Breakdown - ${monthNames[filters.month - 1]} ${
        filters.year
      }`;
    }
    if (filters.year) {
      return `Energy Source Breakdown - ${filters.year}`;
    }
    return "Energy Source Breakdown";
  };

  if (loading) {
    return (
      <div className="chart-loading">
        <h3>Energy Source Breakdown</h3>
        <div>Loading...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="chart-loading">
        <h3>Energy Source Breakdown</h3>
        <div>No energy source data available.</div>
      </div>
    );
  }

  return (
    <div className="energy-source-chart">
      <h3>{getChartTitle()}</h3>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={formatTooltip} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value}: {entry.payload.value.toFixed(1)}%
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="chart-hint">🔋 Energy generation source breakdown</div>
    </div>
  );
};

export default EnergySourceChart;
