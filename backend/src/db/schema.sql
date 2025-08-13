CREATE TABLE IF NOT EXISTS metadata (
    cpe VARCHAR PRIMARY KEY,
    lat DECIMAL,
    lon DECIMAL,
    totalarea DECIMAL,
    name TEXT,
    fulladdress TEXT
);

CREATE TABLE IF NOT EXISTS smart_meter (
    id SERIAL PRIMARY KEY,
    cpe VARCHAR REFERENCES metadata(cpe),
    timestamp TIMESTAMP,
    active_energy DECIMAL
);

CREATE TABLE IF NOT EXISTS energy_source_breakdown (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP,
    renewable DECIMAL,
    renewable_biomass DECIMAL,
    renewable_hydro DECIMAL,
    renewable_solar DECIMAL,
    renewable_wind DECIMAL,
    renewable_geothermal DECIMAL,
    renewable_otherrenewable DECIMAL,
    nonrenewable DECIMAL,
    nonrenewable_coal DECIMAL,
    nonrenewable_gas DECIMAL,
    nonrenewable_nuclear DECIMAL,
    nonrenewable_oil DECIMAL,
    hydropumpedstorage DECIMAL,
    unknown DECIMAL
);
