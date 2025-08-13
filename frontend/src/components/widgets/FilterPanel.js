import React, { useState, useEffect } from "react";
import "./FilterPanel.css";

const FilterPanel = ({ filters, buildings, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBuildings, setFilteredBuildings] = useState(buildings);

  const years = [2020, 2021, 2022, 2023];
  const months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];

  // Filter buildings based on search term
  useEffect(() => {
    const filtered = buildings.filter(
      (building) =>
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.fulladdress.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuildings(filtered);
  }, [searchTerm, buildings]);

  const handleYearChange = (e) => {
    onFilterChange({
      year: parseInt(e.target.value),
      month: null,
      day: null,
    });
  };

  const handleMonthChange = (e) => {
    const month = e.target.value === "all" ? null : parseInt(e.target.value);
    onFilterChange({
      month: month,
      day: null,
    });
  };

  const handleBuildingChange = (e) => {
    const buildingId = e.target.value === "all" ? null : e.target.value;
    onFilterChange({
      building: buildingId,
    });
  };

  const handleBuildingSelect = (buildingId) => {
    onFilterChange({
      building: buildingId,
    });
    setSearchTerm("");
  };

  const handleDateRangePreset = (preset) => {
    const currentYear = new Date().getFullYear();
    switch (preset) {
      case "currentYear":
        onFilterChange({ year: currentYear, month: null, day: null });
        break;
      case "lastYear":
        onFilterChange({ year: currentYear - 1, month: null, day: null });
        break;
      case "currentMonth":
        onFilterChange({
          year: currentYear,
          month: new Date().getMonth() + 1,
          day: null,
        });
        break;
      case "lastMonth":
        const lastMonth =
          new Date().getMonth() === 0 ? 12 : new Date().getMonth();
        const lastMonthYear =
          new Date().getMonth() === 0 ? currentYear - 1 : currentYear;
        onFilterChange({ year: lastMonthYear, month: lastMonth, day: null });
        break;
      default:
        break;
    }
  };

  const clearFilters = () => {
    onFilterChange({
      year: 2021,
      building: null,
      month: null,
      day: null,
    });
    setSearchTerm("");
  };

  const getSelectedBuildingName = () => {
    if (!filters.building) return null;
    const building = buildings.find((b) => b.cpe === filters.building);
    return building ? building.name : null;
  };

  const getSelectedMonthName = () => {
    if (!filters.month) return null;
    const month = months.find((m) => m.value === filters.month);
    return month ? month.name : null;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.building) count++;
    if (filters.month) count++;
    if (filters.day) count++;
    return count;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters & Controls</h3>
        <div className="filter-header-right">
          {getActiveFiltersCount() > 0 && (
            <span className="active-filters-badge">
              {getActiveFiltersCount()} active
            </span>
          )}
          <button
            className="toggle-button"
            onClick={toggleExpanded}
            title={isExpanded ? "Collapse filters" : "Expand filters"}
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      <div
        className={`filter-content ${isExpanded ? "expanded" : "collapsed"}`}
      >
        {/* Quick Presets */}
        <div className="filter-section">
          <label className="section-label">Quick Filters:</label>
          <div className="preset-buttons">
            <button
              className="preset-btn"
              onClick={() => handleDateRangePreset("currentYear")}
            >
              Current Year
            </button>
            <button
              className="preset-btn"
              onClick={() => handleDateRangePreset("lastYear")}
            >
              Last Year
            </button>
            <button
              className="preset-btn"
              onClick={() => handleDateRangePreset("currentMonth")}
            >
              This Month
            </button>
            <button
              className="preset-btn"
              onClick={() => handleDateRangePreset("lastMonth")}
            >
              Last Month
            </button>
          </div>
        </div>

        {/* Main Filters */}
        <div className="filter-section">
          <div className="filter-row">
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
              <label>Month:</label>
              <select
                value={filters.month || "all"}
                onChange={handleMonthChange}
              >
                <option value="all">All Months</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Building Search */}
        <div className="filter-section">
          <label className="section-label">Building Search:</label>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search buildings by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="search-results">
              {filteredBuildings.slice(0, 5).map((building) => (
                <div
                  key={building.cpe}
                  className="search-result-item"
                  onClick={() => handleBuildingSelect(building.cpe)}
                >
                  <div className="building-name">{building.name}</div>
                  <div className="building-address">{building.fulladdress}</div>
                </div>
              ))}
              {filteredBuildings.length > 5 && (
                <div className="search-more">
                  +{filteredBuildings.length - 5} more results...
                </div>
              )}
              {filteredBuildings.length === 0 && (
                <div className="no-results">No buildings found</div>
              )}
            </div>
          )}

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
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="filter-section">
            <label className="section-label">Active Filters:</label>
            <div className="active-filters">
              {filters.building && (
                <span className="filter-tag building">
                  <span className="tag-icon">🏢</span>
                  {getSelectedBuildingName()}
                  <button
                    onClick={() => onFilterChange({ building: null })}
                    title="Remove building filter"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.month && (
                <span className="filter-tag month">
                  <span className="tag-icon">📅</span>
                  {getSelectedMonthName()}
                  <button
                    onClick={() => onFilterChange({ month: null, day: null })}
                    title="Remove month filter"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.day && (
                <span className="filter-tag day">
                  <span className="tag-icon">📆</span>
                  Day {filters.day}
                  <button
                    onClick={() => onFilterChange({ day: null })}
                    title="Remove day filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="filter-actions">
          <button className="clear-filters" onClick={clearFilters}>
            Clear All Filters
          </button>
          <button className="toggle-button" onClick={toggleExpanded}>
            {isExpanded ? "Collapse" : "Expand"} Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
