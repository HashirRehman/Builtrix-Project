import React, { useState } from "react";
import "./MapWidget.css";

const MapWidget = ({ buildings, selectedBuilding, onBuildingSelect }) => {
  const [hoveredBuilding, setHoveredBuilding] = useState(null);

  const getMarkerSize = (consumption) => {
    if (!consumption) return 12;
    const minConsumption = Math.min(
      ...buildings.map((b) => parseFloat(b.total_consumption || 0))
    );
    const maxConsumption = Math.max(
      ...buildings.map((b) => parseFloat(b.total_consumption || 0))
    );
    const normalized =
      (consumption - minConsumption) / (maxConsumption - minConsumption);
    return Math.max(12, Math.min(40, 12 + normalized * 28));
  };

  const getMarkerPosition = (lat, lon) => {
    const minLat = 38,
      maxLat = 42;
    const minLon = -9.5,
      maxLon = -6;

    const x = ((parseFloat(lon) - minLon) / (maxLon - minLon)) * 100;
    const y = ((maxLat - parseFloat(lat)) / (maxLat - minLat)) * 100;

    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    };
  };

  const handleMarkerClick = (building) => {
    onBuildingSelect(building.cpe === selectedBuilding ? null : building.cpe);
  };

  return (
    <div className="map-widget-container">
      <h3>Building Locations</h3>
      <div className="map-container">
        <div className="map-background">
          {buildings.map((building) => {
            const consumption = parseFloat(building.total_consumption || 0);
            const size = getMarkerSize(consumption);
            const position = getMarkerPosition(building.lat, building.lon);
            const isSelected = building.cpe === selectedBuilding;

            return (
              <div
                key={building.cpe}
                className={`map-marker ${isSelected ? "selected" : ""}`}
                style={{
                  ...position,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                onClick={() => handleMarkerClick(building)}
                onMouseEnter={() => setHoveredBuilding(building)}
                onMouseLeave={() => setHoveredBuilding(null)}
                title={`${building.name} - ${Math.round(consumption)} kWh`}
              >
                <div className="marker-inner"></div>
              </div>
            );
          })}

          {hoveredBuilding && (
            <div
              className="map-tooltip"
              style={getMarkerPosition(
                hoveredBuilding.lat,
                hoveredBuilding.lon
              )}
            >
              <div className="tooltip-content">
                <strong>{hoveredBuilding.name}</strong>
                <div>Area: {hoveredBuilding.totalarea} m²</div>
                <div>
                  Consumption:{" "}
                  {Math.round(
                    parseFloat(hoveredBuilding.total_consumption || 0)
                  )}{" "}
                  kWh
                </div>
                <div className="tooltip-address">
                  {hoveredBuilding.fulladdress}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="map-legend">
          <h4>Legend</h4>
          <div className="legend-item">
            <div className="legend-marker small"></div>
            <span>Low Consumption</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker large"></div>
            <span>High Consumption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapWidget;
