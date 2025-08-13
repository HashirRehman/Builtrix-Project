import React from "react";
import "./FilterPanel.css";

const FilterPanel = ({ filters, buildings, onFilterChange }) => {
  const years = [2020, 2021, 2022, 2023];

  const handleYearChange = (e) => {
    onFilterChange({
      year: parseInt(e.target.value),
      month: null,
      day: null,
    });
  };

  const handleBuildingChange = (e) => {
    const buildingId = e.target.value === "all" ? null : e.target.value;
    onFilterChange({
      building: buildingId,
      month: null,
      day: null,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      year: 2021,
      building: null,
      month: null,
      day: null,
    });
  };

  const getSelectedBuildingName = () => {
    if (!filters.building) return null;
    const building = buildings.find((b) => b.cpe === filters.building);
    return building ? building.name : null;
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Year:</label>
        <select value={filters.year} onChange={handleYearChange}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Building:</label>
        <select
          value={filters.building || "all"}
          onChange={handleBuildingChange}
        >
          <option value="all">All Buildings</option>
          {buildings.map((building) => (
            <option key={building.cpe} value={building.cpe}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      {filters.building && (
        <div className="filter-group">
          <span className="filter-tag">
            {getSelectedBuildingName()}
            <button
              onClick={() =>
                onFilterChange({ building: null, month: null, day: null })
              }
            >
              ×
            </button>
          </span>
        </div>
      )}

      {filters.month && (
        <div className="filter-group">
          <span className="filter-tag">
            Month: {filters.month}
            <button onClick={() => onFilterChange({ month: null, day: null })}>
              ×
            </button>
          </span>
        </div>
      )}

      {filters.day && (
        <div className="filter-group">
          <span className="filter-tag">
            Day: {filters.day}
            <button onClick={() => onFilterChange({ day: null })}>×</button>
          </span>
        </div>
      )}

      <button className="clear-filters" onClick={clearFilters}>
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterPanel;
