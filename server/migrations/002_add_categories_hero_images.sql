-- Migration 002: Add categories and hero_images tables
-- Run if these tables are missing from the database (they were absent from
-- the initial remote deployment despite being in init.sql).

CREATE TABLE IF NOT EXISTS categories (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS hero_images (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  urls JSON NOT NULL
);

-- Seed default categories (safe to re-run)
INSERT IGNORE INTO categories (id, name, description) VALUES
  (1, 'Knob',        'Door and cabinet knobs'),
  (2, 'Door Handle', 'Various types of door handles');

-- Seed default hero image (safe to re-run)
INSERT IGNORE INTO hero_images (id, urls) VALUES
  (1, '["/images/home/hero-knobs.jpg"]');
