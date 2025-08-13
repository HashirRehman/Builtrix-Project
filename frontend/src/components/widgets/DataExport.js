import React, { useState } from "react";
import { SuccessButton } from "../common/AnimatedButton";
import { useNotification } from "../../context/NotificationContext";
import "./DataExport.css";

const DataExport = ({ filters, buildings }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportType, setExportType] = useState("current");
  const { showSuccess, showError } = useNotification();

  const API_BASE_URL = "http://localhost:5000/api";

  const buildApiUrl = (endpoint, params) => {
    const urlParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        urlParams.append(key, params[key]);
      }
    });
    return `${API_BASE_URL}${endpoint}?${urlParams}`;
  };

  const fetchAndExportData = async (endpoint, filename, params = {}) => {
    try {
      const response = await fetch(buildApiUrl(endpoint, params));
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Export failed");
      }

      const data = result.data;

      if (exportFormat === "csv") {
        downloadCSV(data, filename);
      } else {
        downloadJSON(data, filename);
      }

      return data.length;
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  };

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      showError("No data available to export", { title: 'Export Error' });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.json`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const buildingName = filters.building
        ? buildings
            .find((b) => b.cpe === filters.building)
            ?.name?.replace(/\s+/g, "_") || "Unknown"
        : "All_Buildings";

      let totalRecords = 0;

      switch (exportType) {
        case "current":
          // Export currently filtered data
          if (filters.day) {
            // 15-minute data
            const count = await fetchAndExportData(
              "/energy/15min",
              `15min_energy_${buildingName}_${filters.year}_${filters.month}_${filters.day}_${timestamp}`,
              filters
            );
            totalRecords += count;
          } else if (filters.month) {
            // Daily data
            const count = await fetchAndExportData(
              "/energy/daily",
              `daily_energy_${buildingName}_${filters.year}_${filters.month}_${timestamp}`,
              filters
            );
            totalRecords += count;
          } else {
            // Monthly data
            const count = await fetchAndExportData(
              "/energy/monthly",
              `monthly_energy_${buildingName}_${filters.year}_${timestamp}`,
              filters
            );
            totalRecords += count;
          }
          break;

        case "all_current_building":
          if (filters.building) {
            // Export all data for current building
            const monthlyCount = await fetchAndExportData(
              "/energy/monthly",
              `monthly_energy_${buildingName}_all_${timestamp}`,
              { building: filters.building, year: filters.year }
            );
            totalRecords += monthlyCount;
          }
          break;

        case "all_buildings_current_period":
          // Export all buildings for current time period
          if (filters.day) {
            const count = await fetchAndExportData(
              "/energy/15min",
              `15min_energy_all_buildings_${filters.year}_${filters.month}_${filters.day}_${timestamp}`,
              { year: filters.year, month: filters.month, day: filters.day }
            );
            totalRecords += count;
          } else if (filters.month) {
            const count = await fetchAndExportData(
              "/energy/daily",
              `daily_energy_all_buildings_${filters.year}_${filters.month}_${timestamp}`,
              { year: filters.year, month: filters.month }
            );
            totalRecords += count;
          } else {
            const count = await fetchAndExportData(
              "/energy/monthly",
              `monthly_energy_all_buildings_${filters.year}_${timestamp}`,
              { year: filters.year }
            );
            totalRecords += count;
          }
          break;

        case "metadata":
          // Export building metadata
          const metadataCount = await fetchAndExportData(
            "/metadata",
            `building_metadata_${timestamp}`,
            {}
          );
          totalRecords += metadataCount;
          break;

        default:
          throw new Error("Unknown export type");
      }

      showSuccess(`Export completed! ${totalRecords} records exported successfully.`, {
        title: 'Export Complete',
        duration: 4000
      });
    } catch (error) {
      showError(`Export failed: ${error.message}`, {
        title: 'Export Error',
        duration: 6000
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getExportDescription = () => {
    switch (exportType) {
      case "current":
        return "Export data with current filters applied";
      case "all_current_building":
        return filters.building
          ? `Export all data for ${
              buildings.find((b) => b.cpe === filters.building)?.name
            }`
          : "Select a building first";
      case "all_buildings_current_period":
        return `Export all buildings for ${filters.year}${
          filters.month ? `/${filters.month}` : ""
        }${filters.day ? `/${filters.day}` : ""}`;
      case "metadata":
        return "Export building metadata and information";
      default:
        return "";
    }
  };

  return (
    <div className="data-export">
      <div className="export-header">
        <h4>Data Export</h4>
        <span className="export-subtitle">Download filtered data</span>
      </div>

      <div className="export-options">
        <div className="option-group">
          <label>Export Type:</label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
          >
            <option value="current">Current View</option>
            <option value="all_current_building" disabled={!filters.building}>
              All Data (Current Building)
            </option>
            <option value="all_buildings_current_period">
              All Buildings (Current Period)
            </option>
            <option value="metadata">Building Metadata</option>
          </select>
        </div>

        <div className="option-group">
          <label>Format:</label>
          <div className="format-options">
            <label className="radio-label">
              <input
                type="radio"
                value="csv"
                checked={exportFormat === "csv"}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              CSV
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="json"
                checked={exportFormat === "json"}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              JSON
            </label>
          </div>
        </div>
      </div>

      <div className="export-description">{getExportDescription()}</div>

      <SuccessButton
        loading={isExporting}
        disabled={exportType === "all_current_building" && !filters.building}
        onClick={handleExport}
        icon={isExporting ? null : "📥"}
        size="large"
        className="export-button"
      >
        {isExporting ? "Exporting..." : "Export Data"}
      </SuccessButton>
    </div>
  );
};

export default DataExport;
