CREATE DATABASE IF NOT EXISTS f1_db;

USE f1_db;

CREATE TABLE IF NOT EXISTS Temporadas (
    id_temporada INT AUTO_INCREMENT PRIMARY KEY,
    año YEAR NOT NULL
);

CREATE TABLE IF NOT EXISTS Equipos (
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Pilotos (
    id_piloto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Estadisticas_Pilotos_Temporada (
    id_estadistica INT AUTO_INCREMENT PRIMARY KEY,
    id_piloto INT,
    id_temporada INT,
    puntos INT,
    FOREIGN KEY (id_piloto) REFERENCES Pilotos(id_piloto),
    FOREIGN KEY (id_temporada) REFERENCES Temporadas(id_temporada)
);

CREATE TABLE IF NOT EXISTS Estadisticas_Equipos_Temporada (
    id_estadistica INT AUTO_INCREMENT PRIMARY KEY,
    id_equipo INT,
    id_temporada INT,
    puntos_totales INT,
    FOREIGN KEY (id_equipo) REFERENCES Equipos(id_equipo),
    FOREIGN KEY (id_temporada) REFERENCES Temporadas(id_temporada)
);
