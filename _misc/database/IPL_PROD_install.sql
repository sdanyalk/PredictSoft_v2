-- --------------------------------------------------------
-- Host:                         gubuntu.duckdns.org
-- Server version:               5.5.47-0ubuntu0.14.04.1 - (Ubuntu)
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table psoft2_IPL.match
CREATE TABLE IF NOT EXISTS `match` (
  `matchID` int(11) NOT NULL AUTO_INCREMENT,
  `isActive` smallint(5) DEFAULT '0',
  `isHidden` int(11) DEFAULT '0',
  `Team1ID` int(11) NOT NULL,
  `Team2ID` int(11) NOT NULL,
  `MatchDate` date DEFAULT NULL,
  `WinningTeamID` int(11) DEFAULT NULL COMMENT 'Can be null for matches that have not been decided yet',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`matchID`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=latin1;

-- Dumping data for table psoft2_IPL.match: ~60 rows (approximately)
/*!40000 ALTER TABLE `match` DISABLE KEYS */;
INSERT INTO `match` (`matchID`, `isActive`, `isHidden`, `Team1ID`, `Team2ID`, `MatchDate`, `WinningTeamID`, `createdAt`, `updatedAt`) VALUES
	(1, 0, 0, 5, 6, '2016-04-09', NULL, NULL, NULL),
	(2, 0, 0, 4, 1, '2016-04-10', NULL, NULL, NULL),
	(3, 0, 0, 3, 2, '2016-04-11', NULL, NULL, NULL),
	(4, 0, 0, 7, 8, '2016-04-12', NULL, NULL, NULL),
	(5, 0, 0, 4, 5, '2016-04-13', NULL, NULL, NULL),
	(6, 0, 0, 2, 6, '2016-04-14', NULL, NULL, NULL),
	(7, 0, 0, 1, 3, '2016-04-15', NULL, NULL, NULL),
	(8, 0, 0, 8, 4, '2016-04-16', NULL, NULL, NULL),
	(9, 0, 0, 5, 2, '2016-04-16', NULL, NULL, NULL),
	(10, 0, 0, 3, 6, '2016-04-17', NULL, NULL, NULL),
	(11, 0, 0, 7, 1, '2016-04-17', NULL, NULL, NULL),
	(12, 0, 0, 8, 5, '2016-04-18', NULL, NULL, NULL),
	(13, 0, 0, 3, 4, '2016-04-19', NULL, NULL, NULL),
	(14, 0, 0, 5, 7, '2016-04-20', NULL, NULL, NULL),
	(15, 0, 0, 2, 8, '2016-04-21', NULL, NULL, NULL),
	(16, 0, 0, 6, 7, '2016-04-22', NULL, NULL, NULL),
	(17, 0, 0, 1, 5, '2016-04-23', NULL, NULL, NULL),
	(18, 0, 0, 8, 3, '2016-04-23', NULL, NULL, NULL),
	(19, 0, 0, 2, 7, '2016-04-24', NULL, NULL, NULL),
	(20, 0, 0, 6, 4, '2016-04-24', NULL, NULL, NULL),
	(21, 0, 0, 3, 5, '2016-04-25', NULL, NULL, NULL),
	(22, 0, 0, 8, 6, '2016-04-26', NULL, NULL, NULL),
	(23, 0, 0, 1, 2, '2016-04-27', NULL, NULL, NULL),
	(24, 0, 0, 5, 4, '2016-04-28', NULL, NULL, NULL),
	(25, 0, 0, 6, 2, '2016-04-29', NULL, NULL, NULL),
	(26, 0, 0, 1, 4, '2016-04-30', NULL, NULL, NULL),
	(27, 0, 0, 8, 7, '2016-04-30', NULL, NULL, NULL),
	(28, 0, 0, 2, 3, '2016-05-01', NULL, NULL, NULL),
	(29, 0, 0, 6, 5, '2016-05-01', NULL, NULL, NULL),
	(30, 0, 0, 7, 4, '2016-05-02', NULL, NULL, NULL),
	(31, 0, 0, 2, 1, '2016-05-03', NULL, NULL, NULL),
	(32, 0, 0, 4, 3, '2016-05-04', NULL, NULL, NULL),
	(33, 0, 0, 1, 6, '2016-05-05', NULL, NULL, NULL),
	(34, 0, 0, 8, 2, '2016-05-06', NULL, NULL, NULL),
	(35, 0, 0, 7, 6, '2016-05-07', NULL, NULL, NULL),
	(36, 0, 0, 3, 1, '2016-05-07', NULL, NULL, NULL),
	(37, 0, 0, 5, 8, '2016-05-08', NULL, NULL, NULL),
	(38, 0, 0, 4, 2, '2016-05-08', NULL, NULL, NULL),
	(39, 0, 0, 3, 7, '2016-05-09', NULL, NULL, NULL),
	(40, 0, 0, 6, 8, '2016-05-10', NULL, NULL, NULL),
	(41, 0, 0, 7, 5, '2016-05-11', NULL, NULL, NULL),
	(42, 0, 0, 8, 1, '2016-05-12', NULL, NULL, NULL),
	(43, 0, 0, 5, 3, '2016-05-13', NULL, NULL, NULL),
	(44, 0, 0, 7, 2, '2016-05-14', NULL, NULL, NULL),
	(45, 0, 0, 4, 6, '2016-05-14', NULL, NULL, NULL),
	(46, 0, 0, 5, 1, '2016-05-15', NULL, NULL, NULL),
	(47, 0, 0, 3, 8, '2016-05-15', NULL, NULL, NULL),
	(48, 0, 0, 4, 7, '2016-05-16', NULL, NULL, NULL),
	(49, 0, 0, 6, 1, '2016-05-17', NULL, NULL, NULL),
	(50, 0, 0, 7, 3, '2016-05-18', NULL, NULL, NULL),
	(51, 0, 0, 2, 4, '2016-05-19', NULL, NULL, NULL),
	(52, 0, 0, 1, 8, '2016-05-20', NULL, NULL, NULL),
	(53, 0, 0, 6, 3, '2016-05-21', NULL, NULL, NULL),
	(54, 0, 0, 2, 5, '2016-05-21', NULL, NULL, NULL),
	(55, 0, 0, 4, 8, '2016-05-22', NULL, NULL, NULL),
	(56, 0, 0, 1, 7, '2016-05-22', NULL, NULL, NULL),
	(57, 0, 1, 9, 9, '2016-05-24', NULL, NULL, NULL),
	(58, 0, 1, 9, 9, '2016-05-25', NULL, NULL, NULL),
	(59, 0, 1, 9, 9, '2016-05-27', NULL, NULL, NULL),
	(60, 0, 1, 9, 9, '2016-05-29', NULL, NULL, NULL);
/*!40000 ALTER TABLE `match` ENABLE KEYS */;


-- Dumping structure for table psoft2_IPL.prediction
CREATE TABLE IF NOT EXISTS `prediction` (
  `playerID` int(11) NOT NULL,
  `matchID` int(11) NOT NULL,
  `predictedTeamID` int(11) DEFAULT NULL,
  `predictionDate` date DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`playerID`,`matchID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table psoft2_IPL.prediction: ~0 rows (approximately)
/*!40000 ALTER TABLE `prediction` DISABLE KEYS */;
/*!40000 ALTER TABLE `prediction` ENABLE KEYS */;


-- Dumping structure for table psoft2_IPL.teams
CREATE TABLE IF NOT EXISTS `teams` (
  `teamID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `groupID` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`teamID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Dumping data for table psoft2_IPL.teams: ~9 rows (approximately)
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` (`teamID`, `Name`, `groupID`, `createdAt`, `updatedAt`) VALUES
	(1, 'Delhi Daredevils', NULL, NULL, NULL),
	(2, 'Gujarat Lions', NULL, NULL, NULL),
	(3, 'Kings XI Punjab', NULL, NULL, NULL),
	(4, 'Kolkata Knight Riders', NULL, NULL, NULL),
	(5, 'Mumbai Indians', NULL, NULL, NULL),
	(6, 'Rising Pune Supergiants', NULL, NULL, NULL),
	(7, 'Royal Challengers Bangalore', NULL, NULL, NULL),
	(8, 'Sunrisers Hyderabad', NULL, NULL, NULL),
	(9, 'TBD', NULL, NULL, NULL);
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;


-- Dumping structure for table psoft2_IPL.users
CREATE TABLE IF NOT EXISTS `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_image` varchar(255) NOT NULL,
  `auth_key` varchar(255) NOT NULL,
  `points` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table psoft2_IPL.users: ~0 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
