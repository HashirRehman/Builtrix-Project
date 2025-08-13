import React from "react";
import "./LoadingSkeleton.css";

const LoadingSkeleton = ({
  type = "default",
  width = "100%",
  height = "20px",
  rows = 1,
  animated = true,
}) => {
  if (type === "chart") {
    return (
      <div className="skeleton-container">
        <div
          className={`skeleton skeleton-chart ${animated ? "animated" : ""}`}
        >
          <div className="skeleton-chart-header">
            <div
              className="skeleton-line"
              style={{ width: "60%", height: "24px" }}
            ></div>
            <div
              className="skeleton-line"
              style={{ width: "30%", height: "16px", marginTop: "8px" }}
            ></div>
          </div>
          <div className="skeleton-chart-body">
            <div className="skeleton-bars">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton-bar"
                  style={{
                    height: `${Math.random() * 100 + 50}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "map") {
    return (
      <div className="skeleton-container">
        <div className={`skeleton skeleton-map ${animated ? "animated" : ""}`}>
          <div className="skeleton-map-header">
            <div
              className="skeleton-line"
              style={{ width: "40%", height: "24px" }}
            ></div>
          </div>
          <div className="skeleton-map-body">
            <div className="skeleton-map-points">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton-map-point"
                  style={{
                    top: `${Math.random() * 70 + 15}%`,
                    left: `${Math.random() * 70 + 15}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="skeleton-container">
        <div
          className={`skeleton skeleton-table ${animated ? "animated" : ""}`}
        >
          {[...Array(rows)].map((_, i) => (
            <div
              key={i}
              className="skeleton-table-row"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="skeleton-line"
                style={{ width: "25%", height: "16px" }}
              ></div>
              <div
                className="skeleton-line"
                style={{ width: "20%", height: "16px" }}
              ></div>
              <div
                className="skeleton-line"
                style={{ width: "30%", height: "16px" }}
              ></div>
              <div
                className="skeleton-line"
                style={{ width: "15%", height: "16px" }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="skeleton-container">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-line ${animated ? "animated" : ""}`}
          style={{
            width,
            height,
            marginBottom: rows > 1 ? "8px" : "0",
            animationDelay: `${i * 0.1}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

// Specialized loading components
export const ChartSkeleton = (props) => (
  <LoadingSkeleton type="chart" {...props} />
);
export const MapSkeleton = (props) => <LoadingSkeleton type="map" {...props} />;
export const TableSkeleton = (props) => (
  <LoadingSkeleton type="table" rows={5} {...props} />
);

export default LoadingSkeleton;
