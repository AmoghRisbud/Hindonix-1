-- Hindonix MySQL Schema
-- Run this once on your Hostinger MySQL database

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS subcategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT,
  subcategory_id INT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS finish_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS finishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  image VARCHAR(500) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  category_id INT,
  subcategory VARCHAR(255),
  subcategory_id INT,
  material VARCHAR(255) NOT NULL,
  material_id INT,
  description TEXT NOT NULL,
  model_number VARCHAR(255),
  long_description TEXT,
  image VARCHAR(500) NOT NULL,
  finishes JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS case_studies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  image VARCHAR(500) NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  outcome TEXT NOT NULL,
  stats JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(500) NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(500),
  rating INT DEFAULT 5
);

-- hero_images stores a single row with the JSON array of image URLs
CREATE TABLE IF NOT EXISTS hero_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  urls JSON NOT NULL
);

-- Seed default categories
INSERT IGNORE INTO categories (id, name, description) VALUES
  (1, 'Knob', 'Door and cabinet knobs'),
  (2, 'Door Handle', 'Various types of door handles');

-- Seed default subcategories
INSERT IGNORE INTO subcategories (id, name, category_id, description) VALUES
  (1, 'Cabinet Handle', 2, 'Handles for cabinets'),
  (2, 'Door Handle', 2, 'Handles for doors');

-- Seed default materials
INSERT IGNORE INTO materials (id, name, description) VALUES
  (1, 'Stainless Steel', 'Premium stainless steel'),
  (2, 'Brass', 'High-quality brass');

-- Seed default finish categories
INSERT IGNORE INTO finish_categories (id, name, description) VALUES
  (1, 'Stainless Steel Finish', 'Finishes for stainless steel products'),
  (2, 'Brass Finish', 'Finishes for brass products'),
  (3, 'PVD Finish', 'Physical Vapor Deposition finishes');

-- Seed default finishes
INSERT IGNORE INTO finishes (id, name, category_id, image) VALUES
  (1, 'Matt', 1, '/images/finishes/matt.jpg'),
  (2, 'Glossy Chrome', 1, '/images/finishes/glossy-chrome.jpg'),
  (3, 'Satin', 1, '/images/finishes/satin-stainless-steel.jpg'),
  (4, 'Black Satin', 1, '/images/finishes/satin-black.jpg'),
  (5, 'Brass Antique', 2, '/images/finishes/brass.jpg'),
  (6, 'Rose Gold', 3, '/images/finishes/pvd-rose-gold.jpg'),
  (7, 'Matte Black', 3, '/images/finishes/pvd-satin-black.jpg'),
  (8, 'PVD Rose Gold', 3, '/images/finishes/pvd-polished-copper.jpg'),
  (9, 'PVD Gold', 3, '/images/finishes/pvd-satin-gold.jpg'),
  (10, 'PVD Bronze', 3, '/images/finishes/pvd-satin-bronze.jpg'),
  (11, 'PVD Nickel', 3, '/images/finishes/pvd-satin-nickel.jpg');

-- Seed default products
INSERT IGNORE INTO products (id, name, category, material, description, image, finishes) VALUES
  (1, 'Classic Brass Knob', 'Knob', 'Brass', 'Timeless brass knob with exceptional craftsmanship and warm golden finish.', '/images/products/knobs/brassknob1.jpg', '["Brass","PVD Satin Gold","PVD Polished Copper"]'),
  (2, 'Stainless Steel Knob', 'Knob', 'Stainless Steel', 'Modern metal knob with premium finishes for contemporary interiors.', '/images/products/knobs/metal-knob-1.jpg', '["Polished Stainless Steel","Satin Stainless Steel","Satin Nickel"]'),
  (3, 'Architectural Cabinet Handle', 'Door Handle', 'Stainless Steel', 'Precision-engineered cabinet handle with ergonomic design and multiple finish options.', '/images/products/door-handles/door-handle-1.jpg', '["PVD Satin Black","PVD Satin Bronze","Satin Black"]'),
  (4, 'Contemporary Cabinet Handle', 'Door Handle', 'Brass', 'Sleek brass cabinet handle combining functionality with minimalist aesthetics.', '/images/products/door-handles/door-handle-2.jpg', '["Brass","PVD Satin Gold","PVD Polished Copper"]'),
  (5, 'Premium Door Handle', 'Door Handle', 'Stainless Steel', 'Robust door handle perfect for entrance doors and commercial applications.', '/images/products/pull-handles/pull-handle-1.jpg', '["PVD Satin Stainless Steel","PVD Satin Black","Satin Stainless Steel"]'),
  (6, 'Designer Door Handle', 'Door Handle', 'Brass', 'Statement door handle with architectural presence and luxurious finishes.', '/images/products/pull-handles/pull-handle-2.jpg', '["Brass","PVD Satin Gold","PVD Satin Bronze","PVD Polished Copper"]');

-- Seed default testimonials
INSERT IGNORE INTO testimonials (id, name, role, company, location, content, image, rating) VALUES
  (1, 'David Richardson', 'Lead Architect', 'Richardson & Partners', 'London, UK', 'Hindonix hardware has become our go-to specification for luxury residential projects. The PVD finishes are exceptional and the quality is consistently outstanding.', '/images/testimonials/client-1.jpg', 5),
  (2, 'Sarah Mitchell', 'Interior Designer', 'Mitchell Design Studio', 'Dubai, UAE', 'The attention to detail in Hindonix products is remarkable. Their brass knobs and door handles add that perfect finishing touch to our high-end projects.', '/images/testimonials/client-2.jpg', 5),
  (3, 'James Thompson', 'Project Manager', 'Thompson Construction', 'Manchester, UK', 'Reliable delivery and consistent quality. Hindonix has never let us down on our commercial projects. Their range of finishes meets all our specification needs.', '/images/testimonials/client-3.jpg', 5),
  (4, 'Fatima Al-Mansoori', 'Procurement Director', 'Al-Mansoori Developments', 'Abu Dhabi, UAE', 'Outstanding B2B partnership. Hindonix understands the demands of large-scale projects and delivers premium hardware that exceeds expectations every time.', '/images/testimonials/client-4.jpg', 5);

-- Default hero image
INSERT IGNORE INTO hero_images (id, urls) VALUES (1, '["/images/home/hero-knobs.jpg"]');
