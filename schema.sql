-- ==============================================================================
-- Community Emergency Response & Resource Management System (CER-RMS)
-- Database Schema for User Authentication (Admin & Citizen Roles)
-- ==============================================================================

-- 1. Users Table (Admin & Citizen Roles)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(32) NOT NULL DEFAULT 'citizen', -- 'citizen' or 'admin'
    area VARCHAR(255),
    city VARCHAR(100),
    blood_group VARCHAR(10),
    volunteer_status VARCHAR(100) DEFAULT 'Citizen',
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Real Accounts in SQL Database for Admin & Citizen Login
INSERT OR REPLACE INTO users (id, name, email, password, phone, role, area, city, blood_group, volunteer_status)
VALUES 
  ('USR-ADMIN-1', 'Emergency Admin', 'admin@emergency.gov', 'admin123', '+91 98111 22334', 'admin', 'HQ Control Center', 'New Delhi', 'B+', 'Incident Commander'),
  ('USR-CITIZEN-1', 'Rahul Sharma', 'citizen@example.com', 'password123', '+91 98765 43210', 'citizen', 'Rohini Sector 14', 'New Delhi', 'O+', 'Registered Citizen');
