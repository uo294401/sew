<?php
class Database {
    private $server;
    private $user;
    private $pass;
    private $dbname;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "f1_db";
    }
    public function crearBaseDeDatos() {
        $conn = new mysqli($this->server, $this->user, $this->pass);
        $sql = file_get_contents('DataBase.sql'); 
        $conn->multi_query($sql); 
        $conn->close();
    }
    public function importarCSV($file) {
        $handle = fopen($file['tmp_name'], "r");
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $conn->query("ALTER TABLE Pilotos AUTO_INCREMENT = 1;"); 
        $conn->query("ALTER TABLE Equipos AUTO_INCREMENT = 1;"); 
        $conn->query("ALTER TABLE Temporadas AUTO_INCREMENT = 1;"); 
        $conn->query("ALTER TABLE Estadisticas_Pilotos_Temporada AUTO_INCREMENT = 1;"); 
        $conn->query("ALTER TABLE Estadisticas_Equipos_Temporada AUTO_INCREMENT = 1;"); 
        $conn->close();

        if ($handle !== false) {
            $current_section = "";
            while (($line = fgetcsv($handle)) !== false) {
                if (strpos($line[0], "#") === 0) {
                    $current_section = trim($line[0], "# ");
                    continue;
                }

                if ($current_section == "Pilotos") {
                    $this->importarPilotos($line);
                } elseif ($current_section == "Equipos") {
                    $this->importarEquipos($line);
                } elseif ($current_section == "Temporadas") {
                    $this->importarTemporadas($line);
                } elseif ($current_section == "Estadísticas Pilotos Temporada") {
                    $this->importarEstadisticasPilotos($line);
                } elseif ($current_section == "Estadísticas Equipos Temporada") {
                    $this->importarEstadisticasEquipos($line);
                }
            }
            fclose($handle);
        } 
    }

    private function importarPilotos($line) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $nombre = $line[0];
        $stmt = $conn->prepare("INSERT INTO Pilotos (nombre) VALUES (?)");
        $stmt->bind_param("s", $nombre); 
        $stmt->execute();
        $stmt->close();
        $conn->close();
    }
    
    private function importarEquipos($line) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $nombre = $line[0];
        $stmt = $conn->prepare("INSERT INTO Equipos (nombre) VALUES (?)");
        $stmt->bind_param("s", $nombre); 
        $stmt->execute();
        $stmt->close();
        $conn->close();
    }
    
    private function importarTemporadas($line) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $año = $line[0]; 
        $stmt = $conn->prepare("INSERT INTO Temporadas (año) VALUES (?)");
        $stmt->bind_param("i", $año);  
        $stmt->execute();
        $stmt->close();
        $conn->close();
    }
    
    private function importarEstadisticasPilotos($line) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $id_piloto = $line[0];
        $id_temporada = $line[1];
        $puntos = $line[2];
        $sql = "INSERT INTO Estadisticas_Pilotos_Temporada (id_piloto, id_temporada, puntos) 
                VALUES ($id_piloto, $id_temporada, $puntos)";
        $conn->query($sql);
        $conn->close();
    }
    
    private function importarEstadisticasEquipos($line) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $id_equipo = $line[0];
        $id_temporada = $line[1];
        $puntos_totales = $line[2];
        $sql = "INSERT INTO Estadisticas_Equipos_Temporada (id_equipo, id_temporada, puntos_totales) 
                VALUES ($id_equipo, $id_temporada, $puntos_totales)";
        $conn->query($sql);
        $conn->close();
    }
    public function exportarBaseDeDatos() {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
    
        $file = fopen('exportDataBase.csv', 'w');

        $sql = "SELECT nombre FROM Pilotos";
        $result = $conn->query($sql);
        fputcsv($file, ['# Pilotos']);
        while ($row = $result->fetch_assoc()) {
            fputcsv($file, $row);
        }
    
        $sql = "SELECT nombre FROM Equipos";
        $result = $conn->query($sql);
        fputcsv($file, ['# Equipos']);
        while ($row = $result->fetch_assoc()) {
            fputcsv($file, $row);
        }    

        $sql = "SELECT año FROM Temporadas";
        $result = $conn->query($sql);
        fputcsv($file, ['# Temporadas']);
        while ($row = $result->fetch_assoc()) {
            fputcsv($file, $row);
        }

        $sql = "SELECT id_piloto, id_temporada, puntos FROM Estadisticas_Pilotos_Temporada";
        $result = $conn->query($sql);
        fputcsv($file, ['# Estadísticas Pilotos Temporada']);
        while ($row = $result->fetch_assoc()) {
            fputcsv($file, $row);
        }

        $sql = "SELECT id_equipo, id_temporada, puntos_totales FROM Estadisticas_Equipos_Temporada";
        $result = $conn->query($sql);
        fputcsv($file, ['# Estadísticas Equipos Temporada']);
        while ($row = $result->fetch_assoc()) {
            fputcsv($file, $row);
        }
    
        fclose($file);
        $conn->close();
    }
}    

$db = new Database();
if (isset($_POST['crear_db'])) {
    $db->crearBaseDeDatos();
}
if (isset($_POST['importar_csv']) && isset($_FILES['csv_file'])) {
    $db->importarCSV($_FILES['csv_file']);
}
if (isset($_POST['exportar_csv'])) {
    $db->exportarBaseDeDatos();
}

?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1Desktop-Juegos</title>
    <link rel="icon" href="multimedia/imágenes/favicon.ico" type="image/x-icon">
    <meta name="author" content="Dario Cristobal Gonzalez" />
    <meta name="description" content="Controlador de las temporadas" />
    <meta name="keywords" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
</head>
<body>
    <header>
        <h1><a href="index.html">F1 Desktop</a></h1>
        <nav>
            <ul>
                <li><a href="index.html">Inicio</a></li>
                <li><a href="piloto.html">Piloto</a></li>
                <li><a href="noticias.html">Noticias</a></li>
                <li><a href="calendario.html">Calendario</a></li>
                <li><a href="meteorologia.html">Meteorologia</a></li>
                <li><a href="circuito.html">Circuito</a></li>
                <li><a href="viajes.php">Viajes</a></li>
                <li><a class="active" href="juegos.html">Juegos</a></li>
            </ul>
        </nav>
    </header>
    <header>
        <p>Estás en: <a href="index.html">F1 Desktop</a> >> <a href="juegos.html"></a> Juegos >> Controlador de temporadas</p>
    </header>
    <h2>Juegos</h2>
    <nav>
        <ul>
            <li><a href="memoria.html">Memoria</a></li>
            <li><a href="semaforo.php">Semaforo</a></li>
            <li><a href="api.html">Campeones F1</a></li>
            <li><a href="comparadorF1.php">Comparador de equipos y pilotos de F1</a></li>
        </ul>
    </nav>
    <form action="Database.php" method="post" enctype="multipart/form-data">
    <h3>Crear la base de datos</h3>
    <p>Haciendo click en este botón crearas la base de datos</p>
    <button type="submit" name="crear_db">Crear</button>
    <h3>Importar un csv a la base de datos</h3>
    <p>Haciendo click en este botón importaras el csv elegido a la base de datos</p>
    <input type="file" name="csv_file" accept=".csv">
    <button type="submit" name="importar_csv">Importar</button>
    <h3>Exportar un csv de la base de datos</h3>
    <p>Haciendo click en este botón exportaras un csv de la base de datos</p>
    <button type="submit" name="exportar_csv">Exportar CSV</button>
    </form>
</body>
</html>

