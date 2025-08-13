-- Performance indexes for the builtrix database

-- Index on smart_meter timestamp for time-based queries
CREATE INDEX IF NOT EXISTS idx_smart_meter_timestamp ON smart_meter(timestamp);

-- Index on smart_meter cpe for filtering by building
CREATE INDEX IF NOT EXISTS idx_smart_meter_cpe ON smart_meter(cpe);

-- Composite index for smart_meter queries filtering by both cpe and timestamp
CREATE INDEX IF NOT EXISTS idx_smart_meter_cpe_timestamp ON smart_meter(cpe, timestamp);

-- Index on energy_source_breakdown timestamp
CREATE INDEX IF NOT EXISTS idx_energy_source_timestamp ON energy_source_breakdown(timestamp);

-- Indexes for common date extractions (PostgreSQL expression indexes)
CREATE INDEX IF NOT EXISTS idx_smart_meter_year ON smart_meter(EXTRACT(YEAR FROM timestamp));
CREATE INDEX IF NOT EXISTS idx_smart_meter_month ON smart_meter(EXTRACT(MONTH FROM timestamp));
CREATE INDEX IF NOT EXISTS idx_smart_meter_day ON smart_meter(EXTRACT(DAY FROM timestamp));

-- Index for energy source breakdown year extraction
CREATE INDEX IF NOT EXISTS idx_energy_source_year ON energy_source_breakdown(EXTRACT(YEAR FROM timestamp));
