import React, { useState, useEffect } from "react";
import MapWidget from "./widgets/MapWidget";
import MonthlyChart from "./widgets/MonthlyChart";
import DailyChart from "./widgets/DailyChart";
import FifteenMinChart from "./widgets/FifteenMinChart";
import EnergySourceChart from "./widgets/EnergySourceChart";
import FilterPanel from "./widgets/FilterPanel";
import DataExport from "./widgets/DataExport";
import LoadingSkeleton, { ChartSkeleton, MapSkeleton } from "./common/LoadingSkeleton";
import PageTransition from "./common/PageTransition";
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
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="skeleton-title" style={{ width: '250px', height: '32px', marginBottom: '24px' }}></div>
        </div>
        
        <div className="skeleton-filters" style={{ marginBottom: '24px' }}>
          <LoadingSkeleton width="100%" height="120px" />
        </div>
        
        <div className="skeleton-export" style={{ marginBottom: '24px' }}>
          <LoadingSkeleton width="100%" height="80px" />
        </div>

        <div className="dashboard-grid">
          <div className="widget map-widget">
            <MapSkeleton />
          </div>
          
          <div className="widget chart-widget">
            <ChartSkeleton />
          </div>
          
          <div className="widget chart-widget">
            <ChartSkeleton />
          </div>
          
          <div className="widget chart-widget">
            <ChartSkeleton />
          </div>
          
          <div className="widget chart-widget">
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition transitionKey="dashboard" type="fadeInUp" duration={400}>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Energy Dashboard</h1>
          <p className="dashboard-subtitle">
            Real-time energy consumption monitoring and analytics
          </p>
        </div>

        <FilterPanel
          filters={filters}
          buildings={buildings}
          onFilterChange={handleFilterChange}
        />

        <DataExport filters={filters} buildings={buildings} />

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
    </PageTransition>
  );
};

export default Dashboard;
