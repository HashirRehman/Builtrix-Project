import React, { useState, useEffect } from "react";
import MapWidget from "./widgets/MapWidget";
import MonthlyChart from "./widgets/MonthlyChart";
import DailyChart from "./widgets/DailyChart";
import FifteenMinChart from "./widgets/FifteenMinChart";
import EnergySourceChart from "./widgets/EnergySourceChart";
import FilterPanel from "./widgets/FilterPanel";
import "./Dashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const [buildings, setBuildings] = useState([]);
  const [filters, setFilters] = useState({
    year: 2021,
    building: null,
    month: null,
    day: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/metadata`);
      const data = await response.json();
      if (data.success) {
        setBuildings(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleMonthClick = (month) => {
    setFilters((prev) => ({ ...prev, month, day: null }));
  };

  const handleDayClick = (day) => {
    setFilters((prev) => ({ ...prev, day }));
  };

  const handleBuildingSelect = (building) => {
    setFilters((prev) => ({ ...prev, building }));
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Energy Dashboard</h1>

      <FilterPanel
        filters={filters}
        buildings={buildings}
        onFilterChange={handleFilterChange}
      />

      <div className="dashboard-grid">
        <div className="widget map-widget">
          <MapWidget
            buildings={buildings}
            selectedBuilding={filters.building}
            onBuildingSelect={handleBuildingSelect}
          />
        </div>

        <div className="widget chart-widget">
          <MonthlyChart filters={filters} onMonthClick={handleMonthClick} />
        </div>

        <div className="widget chart-widget">
          <DailyChart filters={filters} onDayClick={handleDayClick} />
        </div>

        <div className="widget chart-widget">
          <FifteenMinChart filters={filters} />
        </div>

        <div className="widget chart-widget">
          <EnergySourceChart filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
