-- Migration 004: Add cta_image table for CTA section background image

CREATE TABLE IF NOT EXISTS cta_image (
  id  INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(1000) NOT NULL DEFAULT ''
);

-- Seed with empty default (no background image by default)
INSERT IGNORE INTO cta_image (id, url) VALUES (1, '');
