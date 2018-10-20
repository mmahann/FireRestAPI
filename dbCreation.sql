CREATE TABLE fire (
    fid SERIAL PRIMARY KEY,
    reportedTimeMark TIMESTAMP without TIME ZONE NOT NULL,
    fire_lat DOUBLE PRECISION,
    fire_lon DOUBLE PRECISION,
    fire_alt DOUBLE PRECISION,
    fire_verified BOOLEAN
);

INSERT INTO fire (fid, reportedTimeMark, fire_lat, fire_lon, fire_alt, fire_verified) VALUES (0, now(), 34.712185, -86.650315, 183, false);    