-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 02, 2025 at 06:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `swiftslot`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(10) UNSIGNED NOT NULL,
  `vendor_id` int(10) UNSIGNED NOT NULL,
  `buyer_id` int(10) UNSIGNED NOT NULL,
  `start_time_utc` datetime NOT NULL,
  `end_time_utc` datetime NOT NULL,
  `status` enum('pending','paid') DEFAULT 'pending',
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `vendor_id`, `buyer_id`, `start_time_utc`, `end_time_utc`, `status`, `created_at`) VALUES
(7, 1, 1, '2025-10-02 09:30:00', '2025-10-02 10:00:00', 'pending', '2025-10-02 14:32:44'),
(8, 2, 1, '2025-10-02 11:30:00', '2025-10-02 12:00:00', 'pending', '2025-10-02 14:34:33'),
(9, 2, 1, '2025-10-02 15:00:00', '2025-10-02 15:30:00', 'pending', '2025-10-02 14:42:10'),
(11, 2, 1, '2025-10-02 08:30:00', '2025-10-02 09:00:00', 'paid', '2025-10-02 14:43:38'),
(12, 3, 1, '2025-10-02 13:00:00', '2025-10-02 13:30:00', 'paid', '2025-10-02 15:03:49'),
(13, 1, 1, '2025-10-24 10:00:00', '2025-10-24 10:30:00', 'paid', '2025-10-02 15:50:13'),
(14, 1, 1, '2025-10-24 14:30:00', '2025-10-24 15:00:00', 'paid', '2025-10-02 16:15:20');

-- --------------------------------------------------------

--
-- Table structure for table `booking_slots`
--

CREATE TABLE `booking_slots` (
  `id` int(10) UNSIGNED NOT NULL,
  `booking_id` int(10) UNSIGNED NOT NULL,
  `vendor_id` int(10) UNSIGNED NOT NULL,
  `slot_start_utc` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_slots`
--

INSERT INTO `booking_slots` (`id`, `booking_id`, `vendor_id`, `slot_start_utc`) VALUES
(7, 7, 1, '2025-10-02 09:30:00'),
(8, 8, 2, '2025-10-02 11:30:00'),
(9, 9, 2, '2025-10-02 15:00:00'),
(11, 11, 2, '2025-10-02 08:30:00'),
(12, 12, 3, '2025-10-02 13:00:00'),
(13, 13, 1, '2025-10-24 10:00:00'),
(14, 14, 1, '2025-10-24 14:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `idempotency_keys`
--

CREATE TABLE `idempotency_keys` (
  `key` varchar(255) NOT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `response_hash` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `idempotency_keys`
--

INSERT INTO `idempotency_keys` (`key`, `scope`, `response_hash`, `created_at`) VALUES
('4qwu5j5f75b', 'create-booking', '{\"id\":5}', '2025-10-02 14:28:42'),
('7p1jgm263cp', 'create-booking', '{\"id\":14}', '2025-10-02 16:15:20'),
('80w1rxlgbwp', 'create-booking', '{\"id\":4}', '2025-10-02 14:01:27'),
('dqukggvjvr8', 'create-booking', '{\"id\":8}', '2025-10-02 14:34:33'),
('g8o1526co9l', 'create-booking', '{\"error\":\"Slot already booked\"}', '2025-10-02 14:43:29'),
('mwjmhunmhue', 'create-booking', '{\"id\":9}', '2025-10-02 14:42:10'),
('oj9zo70lz1e', 'create-booking', '{\"id\":11}', '2025-10-02 14:43:38'),
('ouqj6jpe38l', 'create-booking', '{\"id\":12}', '2025-10-02 15:03:49'),
('pnt0oejtmrg', 'create-booking', '{\"id\":7}', '2025-10-02 14:32:44'),
('qw2d88vssi', 'create-booking', '{\"id\":13}', '2025-10-02 15:50:13'),
('sa8uiqyfxmr', 'create-booking', '{\"id\":6}', '2025-10-02 14:30:49');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(10) UNSIGNED NOT NULL,
  `booking_id` int(10) UNSIGNED NOT NULL,
  `ref` varchar(255) NOT NULL,
  `status` enum('pending','paid') DEFAULT 'pending',
  `raw_event_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`raw_event_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `ref`, `status`, `raw_event_json`) VALUES
(6, 7, '1ab6e8ed-064e-47b8-9962-9b47d960b305', 'pending', NULL),
(7, 8, '51ac3551-10a0-46dc-b734-2a155acbf5df', 'pending', NULL),
(8, 9, '529e2c31-42d2-49d5-9af7-0b45334cd9f7', 'pending', NULL),
(9, 11, '579ea83b-a0ca-454f-8634-588bd2fd8917', 'paid', '{\"type\":\"mock.payment_success\",\"amount\":5000}'),
(10, 12, '01ac4c78-e1af-4ab0-b2a0-9545392dfbd0', 'paid', '{\"type\":\"mock.payment_success\",\"amount\":5000}'),
(11, 13, '6ef2575b-0791-49c1-b9a1-93b9bfb12e06', 'paid', '{\"type\":\"mock.payment_success\",\"amount\":5000}'),
(12, 14, '973cc49b-f50f-4aec-b15f-b4582d3056a1', 'paid', '{\"type\":\"mock.payment_success\",\"amount\":5000}');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `timezone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `name`, `timezone`) VALUES
(1, 'Vendor A', 'Africa/Lagos'),
(2, 'Vendor B', 'Africa/Lagos'),
(3, 'Vendor C', 'Africa/Lagos');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `booking_slots`
--
ALTER TABLE `booking_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_slots_vendor_id_slot_start_utc` (`vendor_id`,`slot_start_utc`);

--
-- Indexes for table `idempotency_keys`
--
ALTER TABLE `idempotency_keys`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ref` (`ref`),
  ADD UNIQUE KEY `ref_2` (`ref`),
  ADD UNIQUE KEY `ref_3` (`ref`),
  ADD UNIQUE KEY `ref_4` (`ref`),
  ADD UNIQUE KEY `ref_5` (`ref`),
  ADD UNIQUE KEY `ref_6` (`ref`),
  ADD UNIQUE KEY `ref_7` (`ref`),
  ADD UNIQUE KEY `ref_8` (`ref`),
  ADD UNIQUE KEY `ref_9` (`ref`),
  ADD UNIQUE KEY `ref_10` (`ref`),
  ADD UNIQUE KEY `ref_11` (`ref`),
  ADD UNIQUE KEY `ref_12` (`ref`),
  ADD UNIQUE KEY `ref_13` (`ref`),
  ADD UNIQUE KEY `ref_14` (`ref`),
  ADD UNIQUE KEY `ref_15` (`ref`),
  ADD UNIQUE KEY `ref_16` (`ref`),
  ADD UNIQUE KEY `ref_17` (`ref`),
  ADD UNIQUE KEY `ref_18` (`ref`),
  ADD UNIQUE KEY `ref_19` (`ref`),
  ADD UNIQUE KEY `ref_20` (`ref`),
  ADD UNIQUE KEY `ref_21` (`ref`),
  ADD UNIQUE KEY `ref_22` (`ref`),
  ADD UNIQUE KEY `ref_23` (`ref`),
  ADD UNIQUE KEY `ref_24` (`ref`),
  ADD UNIQUE KEY `ref_25` (`ref`),
  ADD UNIQUE KEY `ref_26` (`ref`),
  ADD UNIQUE KEY `ref_27` (`ref`),
  ADD UNIQUE KEY `ref_28` (`ref`),
  ADD UNIQUE KEY `ref_29` (`ref`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `booking_slots`
--
ALTER TABLE `booking_slots`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
