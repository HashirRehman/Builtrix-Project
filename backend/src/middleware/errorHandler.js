export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Database errors
  if (err.code && err.code.startsWith("42")) {
    return res.status(400).json({
      success: false,
      message: "Database query error",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Invalid query",
    });
  }

  // Connection errors
  if (err.code === "ECONNREFUSED") {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// Not found middleware
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
