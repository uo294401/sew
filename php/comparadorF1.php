<?php
class Database {
    private $server;
    private $user;
    private $pass;
    private $dbname;
    protected $pilotos;
    protected $equipos;

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
    public function cargarPilotos(){
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $query = "SELECT * FROM Pilotos";
        $result = $conn->query($query);
        $this->pilotos = [];
        while ($row = $result->fetch_assoc()) {
            $this->pilotos[] = $row;
        }

        $conn->close();
    }
    public function obtenerTemporadas() {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $query = "SHOW TABLES LIKE 'Temporadas'";
        $result = $conn->query($query);
        $temporadas = [];

        if ($result->num_rows > 0) {
            $query = "SELECT id_temporada, año FROM Temporadas ORDER BY año DESC";
            $result = $conn->query($query);
    
            while ($row = $result->fetch_assoc()) {
                $temporadas[] = $row;
            }
        } 

        $conn->close();
        return $temporadas;
    }

    public function obtenerClasificacionPilotos($id_temporada) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $query = "SELECT p.nombre, ept.puntos 
                  FROM Estadisticas_Pilotos_Temporada ept
                  INNER JOIN Pilotos p ON ept.id_piloto = p.id_piloto
                  WHERE ept.id_temporada = ?
                  ORDER BY ept.puntos DESC";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id_temporada);
        $stmt->execute();
        $result = $stmt->get_result();

        $clasificacion = [];
        while ($row = $result->fetch_assoc()) {
            $clasificacion[] = $row;
        }
        $stmt->close();
        $conn->close();
        return $clasificacion;
    }

    public function obtenerClasificacionEquipos($id_temporada) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $query = "SELECT e.nombre, eet.puntos_totales 
                  FROM Estadisticas_Equipos_Temporada eet
                  INNER JOIN Equipos e ON eet.id_equipo = e.id_equipo
                  WHERE eet.id_temporada = ?
                  ORDER BY eet.puntos_totales DESC";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id_temporada);
        $stmt->execute();
        $result = $stmt->get_result();

        $clasificacion = [];
        while ($row = $result->fetch_assoc()) {
            $clasificacion[] = $row;
        }
        $stmt->close();
        $conn->close();
        return $clasificacion;
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
$temporadas = $db->obtenerTemporadas();
$clasificacion_pilotos = [];
$clasificacion_equipos = [];
if (isset($_POST['cargar_pilotos'])) {
    $clasificacion_pilotos = $db->obtenerClasificacionPilotos($_POST['temporada']);
}

if (isset($_POST['cargar_equipos'])) {
    $clasificacion_equipos = $db->obtenerClasificacionEquipos($_POST['temporada']);
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
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <script src="../js/comparadorF1.js"></script>

</head>
<body>
    <header>
        <h1><a href="../index.html">F1 Desktop</a></h1>
        <nav>
            <ul>
                <li><a href="../index.html">Inicio</a></li>
                <li><a href="../piloto.html">Piloto</a></li>
                <li><a href="../noticias.html">Noticias</a></li>
                <li><a href="../calendario.html">Calendario</a></li>
                <li><a href="../meteorologia.html">Meteorologia</a></li>
                <li><a href="../circuito.html">Circuito</a></li>
                <li><a href="viajes.php">Viajes</a></li>
                <li><a class="active" href="../juegos.html">Juegos</a></li>
            </ul>
        </nav>
    </header>
    <header>
        <p>Estás en: <a href="../index.html">F1 Desktop</a> >> <a href="../juegos.html"></a> Juegos >> Clasificacion temporadas</p>
    </header>
    <h2>Juegos</h2>
    <nav>
        <ul>
            <li><a href="../memoria.html">Memoria</a></li>
            <li><a href="semaforo.php">Semaforo</a></li>
            <li><a href="../api.html">Campeones F1</a></li>
            <li><a href="comparadorF1.php">Clasificacion por temporadas de equipos y pilotos</a></li>
        </ul>
    </nav>
    <form action="comparadorF1.php" method="post" enctype="multipart/form-data">
    <h3>Crear la base de datos</h3>
    <p>Haciendo click en este botón crearas la base de datos</p>
    <button type="submit" name="crear_db">Crear</button>
    <h3>Importar un csv a la base de datos</h3>
    <p>Haciendo click en este botón importaras el csv elegido a la base de datos</p>
    <label>Selecciona el archivo CSV:<input type="file" name="csv_file" accept=".csv"></label>
    <button type="submit" name="importar_csv">Importar</button>
    <h3>Exportar un csv de la base de datos</h3>
    <p>Haciendo click en este botón exportaras un csv de la base de datos</p>
    <button type="submit" name="exportar_csv">Exportar CSV</button>
    <h3>Clasificación por temporada</h3>
    </form>
    <?php if (!empty($clasificacion_pilotos)): ?>
        <h4>Clasificación de Pilotos</h4>
        <table>
            <thead>
                <tr>
                    <th>Piloto</th>
                    <th>Puntos</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($clasificacion_pilotos as $piloto): ?>
                    <tr>
                        <td><?= htmlspecialchars($piloto['nombre']) ?></td>
                        <td><?= htmlspecialchars($piloto['puntos']) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>

    <?php if (!empty($clasificacion_equipos)): ?>
        <h4>Clasificación de Equipos</h4>
        <table>
            <thead>
                <tr>
                    <th>Equipo</th>
                    <th>Puntos</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($clasificacion_equipos as $equipo): ?>
                    <tr>
                        <td><?= htmlspecialchars($equipo['nombre']) ?></td>
                        <td><?= htmlspecialchars($equipo['puntos_totales']) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
    <form method="post">
        <label>Selecciona una temporada:
            <select name="temporada" required>
                <?php foreach ($temporadas as $temporada): ?>
                    <option value="<?php echo $temporada['id_temporada']; ?>">
                        <?php echo htmlspecialchars($temporada['año']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </label>

        <button type="submit" name="cargar_pilotos">Cargar Clasificación Pilotos</button>
        <button type="submit" name="cargar_equipos">Cargar Clasificación Equipos</button>
    </form>    
</body>
</html>

