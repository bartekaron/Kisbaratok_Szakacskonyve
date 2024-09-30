-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Sze 30. 12:07
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `szakacskonyv`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `ID` varchar(40) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`ID`, `name`) VALUES
('37971fb2-c5f4-4e8d-a756-b3856479d568', 'Levesek'),
('3b8d6455-785b-48f4-9768-fb13d5b3c55b', 'Desszertek'),
('faa12bbe-fd07-4902-8df9-a1ad597a2eac', 'Főételek');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `recipes`
--

CREATE TABLE `recipes` (
  `ID` varchar(40) NOT NULL,
  `catID` varchar(40) NOT NULL,
  `userID` varchar(40) NOT NULL,
  `title` varchar(40) NOT NULL,
  `descp` varchar(200) NOT NULL,
  `time` int(30) NOT NULL,
  `additions` varchar(40) NOT NULL,
  `calorie` int(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `recipes`
--

INSERT INTO `recipes` (`ID`, `catID`, `userID`, `title`, `descp`, `time`, `additions`, `calorie`) VALUES
('3a34bf5c-b00f-44a7-ae50-51057d62cb01', '3b8d6455-785b-48f4-9768-fb13d5b3c55b', 'fdc59140-e825-4eba-9667-ec8de9995aa7', 'Somlói galuska', 'Háromféle piskóta, csokoládéöntet és tejszínhab', 30, 'Dió', 500),
('9055e7ff-1916-44b4-8237-694cc444f96f', '37971fb2-c5f4-4e8d-a756-b3856479d568', 'fdc59140-e825-4eba-9667-ec8de9995aa7', 'Gulyásleves', 'Hagyományos magyar leves marhahússal és zöldségekkel', 90, 'Tejföl', 350),
('b3c064e8-f143-4703-b9bd-c428d7b3c74f', 'faa12bbe-fd07-4902-8df9-a1ad597a2eac', 'fdc59140-e825-4eba-9667-ec8de9995aa7', 'Paprikás csirke', 'Csirkehús paprikás mártásban, nokedlivel', 60, 'Tejföl', 450),
('d40b5a87-7885-4810-a38b-9d4997e4b0b9', '3b8d6455-785b-48f4-9768-fb13d5b3c55b', 'd3a65d1f-54be-4b40-98f9-2aa5ece5b67b', 'Gesztenyepüré', 'Gyors, sütés, főzés nélküli, kiváló desszert', 30, '      500 g gesztenyepüré (mirelit)     ', 800);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` varchar(40) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(40) NOT NULL,
  `passwd` varchar(40) NOT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `role` varchar(40) NOT NULL,
  `status` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `name`, `email`, `passwd`, `phone`, `role`, `status`) VALUES
('d3a65d1f-54be-4b40-98f9-2aa5ece5b67b', 'Lolmester37', 'lolmester37@gmail.com', 'fc58337e500736cd87055a263c2d07c69f5baa8f', '0630708923', 'user', 'true'),
('fdc59140-e825-4eba-9667-ec8de9995aa7', 'Admin', 'admin@admin.admin', '3dae2b74a8d6a899b3d51c0795fdaf3f2b76e9eb', '', 'admin', 'true');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `catID` (`catID`),
  ADD KEY `userID` (`userID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`catID`) REFERENCES `categories` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
