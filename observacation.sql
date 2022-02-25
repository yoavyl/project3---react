-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 24, 2022 at 10:16 AM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `observacation`
--
CREATE DATABASE IF NOT EXISTS `observacation` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `observacation`;

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `userId` int(11) NOT NULL,
  `vacationId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`userId`, `vacationId`) VALUES
(1, 3),
(3, 1),
(3, 2),
(3, 3),
(1, 1),
(1, 7),
(1, 6),
(1, 5),
(4, 1),
(4, 7),
(4, 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `role` enum('User','Admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `username`, `password`, `role`) VALUES
(1, 'Yoav', 'Lifshitz', 'yoavyl73', 'ec008eb41e6c3c60f44a9eb0dd2575c9d67e1815e5c9b3b5fa13b8e19915d3bca458785c2d79d135fc25f317b827dbea561de83bd360fef1372834f1321eb1d7', 'User'),
(2, 'Admin', 'Admin', 'admin123', 'ec008eb41e6c3c60f44a9eb0dd2575c9d67e1815e5c9b3b5fa13b8e19915d3bca458785c2d79d135fc25f317b827dbea561de83bd360fef1372834f1321eb1d7', 'Admin'),
(3, 'Yoav', 'Lifshitz2', 'yoavyl81', 'ec008eb41e6c3c60f44a9eb0dd2575c9d67e1815e5c9b3b5fa13b8e19915d3bca458785c2d79d135fc25f317b827dbea561de83bd360fef1372834f1321eb1d7', 'User'),
(4, 'Test', 'Test', 'testing123', 'ec008eb41e6c3c60f44a9eb0dd2575c9d67e1815e5c9b3b5fa13b8e19915d3bca458785c2d79d135fc25f317b827dbea561de83bd360fef1372834f1321eb1d7', 'User');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `id` int(11) NOT NULL,
  `details` varchar(1000) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `imageName` varchar(100) NOT NULL,
  `fromDate` date NOT NULL,
  `toDate` date NOT NULL,
  `price` decimal(11,2) NOT NULL,
  `followers` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`id`, `details`, `destination`, `imageName`, `fromDate`, `toDate`, `price`, `followers`) VALUES
(1, 'Weekend in London', 'London', 'a95de7b9-16ff-4157-9a60-852ef149ac9b.jpg', '2022-02-22', '2022-02-28', '230.00', 3),
(2, 'Weekend in Amsterdam', 'Amsterdam', '6afd0cc5-66fe-478f-9f1f-7a283ca68927.jpg', '2022-02-17', '2022-02-19', '310.00', 1),
(3, 'Turkish delight', 'Instanbul', 'fccadb35-0cb0-4477-972a-d33a71264588.jpg', '2022-02-20', '2022-02-24', '360.00', 2),
(5, 'Luxury husha in Sharm El Sheikh', 'Sinai', 'aa190295-a55a-4c55-9442-1900ed022af9.jpg', '2022-02-24', '2022-02-28', '100.00', 2),
(6, 'Four nights in Prague. Four nights in Prague. Four nights in Prague. Four nights in Prague.', 'Prague', '767625c9-6f05-405e-a31e-d7f9a42777d0.jpg', '2022-02-23', '2022-02-27', '400.00', 1),
(7, 'Romantic gateaway', 'Lisbon', '88eea9d4-cdd5-463f-ade7-f3df68578f0a.jpg', '2022-02-23', '2022-02-27', '200.00', 2),
(14, 'Jazz is Paris and Paris is Jazz', 'Paris', '0a5e5caf-50a1-4479-b368-ae7fa5aeebf6.jpg', '2022-02-22', '2022-02-26', '300.00', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD KEY `userId` (`userId`),
  ADD KEY `vacationId` (`vacationId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
