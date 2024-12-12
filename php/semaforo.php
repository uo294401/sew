<?php
class Record {
    private $server;
    private $user;
    private $pass;
    private $dbname;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";
    }

    public function saveRecord($nombre, $apellidos, $nivel, $tiempo) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        $stmt = $conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssd", $nombre, $apellidos, $nivel, $tiempo);
        $stmt->execute();

        $stmt->close();
        $conn->close();
    }

    public function getTopRecords($nivel) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        $stmt = $conn->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE ROUND(nivel, 1) = ? ORDER BY tiempo ASC LIMIT 10");
        $stmt->bind_param("s", $nivel);
        $stmt->execute();
        $result = $stmt->get_result();

        $records = [];
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }

        $stmt->close();
        $conn->close();
        return $records;
    }
}

$topRecords = [];
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $record = new Record();

    if (isset($_POST['nombre'], $_POST['apellidos'], $_POST['nivel'], $_POST['tiempo'])) {
        $record->saveRecord($_POST['nombre'], $_POST['apellidos'], $_POST['nivel'], $_POST['tiempo']);
    }

    if (isset($_POST['nivel'])) {
        $topRecords = $record->getTopRecords($_POST['nivel']);
    }
}
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1Desktop-Juegos</title>
    <link rel="icon" href="multimedia/imágenes/favicon.ico" type="image/x-icon">
    <meta name="author" content="Dario Cristobal Gonzalez" />
    <meta name="description" content="Juegos de la pagina web" />
    <meta name="keywords" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/semaforo_grid.css" />
    <script src="../js/semaforo.js"></script>
</head>
<body>
    <header>
        <h1><a href="index.html">F1 Desktop</a></h1>
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
        <p>Estás en: <a href="../index.html">F1 Desktop</a> >> <a href="../juegos.html"></a> Juegos >> Semaforo</p>
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
    <main></main>
    <section></section>
    <?php if (!empty($topRecords)): ?>
        <h3>Top 10 Récords</h3>
        <ol>
            <?php foreach ($topRecords as $rec): ?>
                <li><?= htmlspecialchars($rec['nombre']) ?> <?= htmlspecialchars($rec['apellidos']) ?> - <?= htmlspecialchars($rec['tiempo']) ?> segundos</li>
            <?php endforeach; ?>
        </ol>
    <?php else: ?>
        <p>Aún no hay registros disponibles.</p>
    <?php endif; ?>
    <script>
        "use strict";
        document.addEventListener("DOMContentLoaded", () => {
            new Semaforo();
        });
    </script>
</body>
</html>
