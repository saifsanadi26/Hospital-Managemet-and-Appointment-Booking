-- Hospital Management System Database Schema
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'patient') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  age INT,
  gender ENUM('male', 'female', 'other'),
  contact VARCHAR(15),
  address TEXT,
  blood_group VARCHAR(5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  qualification VARCHAR(255),
  experience INT,
  consultation_fee DECIMAL(10, 2),
  availability TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Medical Records table
CREATE TABLE IF NOT EXISTS medical_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_id INT,
  diagnosis TEXT NOT NULL,
  prescription TEXT,
  treatment TEXT,
  notes TEXT,
  report_file VARCHAR(255),
  record_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_doctors_department ON doctors(department);
CREATE INDEX idx_medical_records_date ON medical_records(record_date);

-- Insert default admin user (password: admin123)
-- Note: You should create the admin user through the signup API with a secure password
