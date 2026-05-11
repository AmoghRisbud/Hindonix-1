-- Migration 003: Add images and videos JSON columns to products table

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS images JSON NOT NULL DEFAULT (JSON_ARRAY()),
  ADD COLUMN IF NOT EXISTS videos JSON NOT NULL DEFAULT (JSON_ARRAY());
