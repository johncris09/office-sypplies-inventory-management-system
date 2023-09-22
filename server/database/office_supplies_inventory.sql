-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 22, 2023 at 05:19 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `office_supplies_inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `borrower`
--

CREATE TABLE `borrower` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrower`
--

INSERT INTO `borrower` (`id`, `name`) VALUES
(7, 'Bonnie H. Whitfield'),
(8, 'James L. Escobedo'),
(9, 'mark rellon'),
(5, 'Pansy J. Alsop'),
(6, 'Patrick S. Frost'),
(4, 'Paula C. Koopman'),
(2, 'Sally S. Grove'),
(1, 'William F. Welch');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`id`, `name`, `unit`) VALUES
(1, 'Item1', 'pcs'),
(2, 'Item2', 'pcs'),
(3, 'Item3', 'pcs');

-- --------------------------------------------------------

--
-- Table structure for table `item_stock`
--

CREATE TABLE `item_stock` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity_added` int(11) NOT NULL,
  `date_added` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_stock`
--

INSERT INTO `item_stock` (`id`, `item_id`, `quantity_added`, `date_added`) VALUES
(1, 1, 6, '2023-01-21'),
(2, 1, 30, '2023-03-21'),
(3, 2, 12, '2023-01-21');

-- --------------------------------------------------------

--
-- Table structure for table `track_item_quantity`
--

CREATE TABLE `track_item_quantity` (
  `id` int(11) NOT NULL,
  `item_stock_id` int(11) NOT NULL,
  `borrower_id` int(11) DEFAULT NULL,
  `borrowed_quantity` int(11) NOT NULL,
  `date_borrowed` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `track_item_quantity`
--

INSERT INTO `track_item_quantity` (`id`, `item_stock_id`, `borrower_id`, `borrowed_quantity`, `date_borrowed`) VALUES
(1, 1, 2, 2, '2023-09-22 08:37:06'),
(2, 3, 9, 3, '2023-09-22 08:40:32'),
(3, 1, 9, 2, '2023-09-22 08:40:32');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `borrower_id` int(11) NOT NULL,
  `quantity_borrowed` int(11) NOT NULL,
  `date_borrowed` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `item_id`, `borrower_id`, `quantity_borrowed`, `date_borrowed`) VALUES
(1, 1, 2, 2, '2023-09-22 00:37:06'),
(2, 2, 9, 3, '2023-09-22 00:40:32'),
(3, 1, 9, 2, '2023-09-22 00:40:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_type` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'Pending',
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `username`, `password`, `role_type`, `status`, `timestamp`) VALUES
(1, 'John Cris Manabo', 'manabojc@gmail.com', 'admin', '$2a$12$00btEDeltYIvUEBTWsHRC.RAmDXyVLX3A8lNAjBioH2Rp.gHV6v76', 'SuperAdmin', 'Approved', '2023-05-25 10:09:28'),
(2, 'David K. Morton', 'DavidKMorton@rhyta.com', 'user', '$2a$12$E33/esO.8n6.EmVriq9oAOQkNbj6N7KeD9JR.aPwBSzPJQGfNEQv.', 'User', 'Approved', '2023-05-25 10:25:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `borrower`
--
ALTER TABLE `borrower`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `item_stock`
--
ALTER TABLE `item_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`item_id`);

--
-- Indexes for table `track_item_quantity`
--
ALTER TABLE `track_item_quantity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `borrower_id` (`borrower_id`),
  ADD KEY `item_stock_id` (`item_stock_id`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`item_id`),
  ADD KEY `borrower_id` (`borrower_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `borrower`
--
ALTER TABLE `borrower`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `item_stock`
--
ALTER TABLE `item_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `track_item_quantity`
--
ALTER TABLE `track_item_quantity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `item_stock`
--
ALTER TABLE `item_stock`
  ADD CONSTRAINT `item_stock_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `track_item_quantity`
--
ALTER TABLE `track_item_quantity`
  ADD CONSTRAINT `track_item_quantity_ibfk_1` FOREIGN KEY (`borrower_id`) REFERENCES `borrower` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `track_item_quantity_ibfk_2` FOREIGN KEY (`item_stock_id`) REFERENCES `item_stock` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`borrower_id`) REFERENCES `borrower` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
