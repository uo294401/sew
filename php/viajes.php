<?php
class Carrusel {
    protected $capital;
    protected $pais;
    protected $fotos = []; 

    public function __construct($capital, $pais) {
        $this->capital = $capital;
        $this->pais = $pais;
    }

    public function obtenerFotos() {
        $apiKey = "6c9e7b4923f2914517b1f0502864e187"; 
        $tags = urlencode($this->pais . ',' . $this->capital); 
        $url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=$apiKey&format=json&nojsoncallback=1&per_page=10&tags=$tags";

        $respuesta = file_get_contents($url);
        $json = json_decode($respuesta,true);

        foreach ($json['photos']['photo'] as $foto) {
            $fotoUrl = "https://live.staticflickr.com/" . $foto['server'] . "/" . $foto['id'] . "_" . $foto['secret'] . ".jpg";
            $this->fotos[] = $fotoUrl;
        }
        
    }

    public function mostrarCarrusel() {
        echo '<figure>';
        echo '<button></button>';
        echo '<button></button>';
        foreach ($this->fotos as $foto) {
            echo "<img src='$foto' alt='Imagen del carrusel'>";
        }
        echo '</figure>';

    }
}
class Moneda{
    protected $local;
    protected $cambio;
    public function __construct($local, $cambio) {
        $this->local = $local;
        $this->cambio = $cambio;
    }

    public function obtenerCambio() {
        $url = "https://open.er-api.com/v6/latest/{$this->cambio}";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $respuesta = curl_exec($ch);
        curl_close($ch);
    
        $datos = json_decode($respuesta, true);
        return round($datos['rates'][$this->local], 2); 
        
    }
}

$monedaLocal = "SGD";
$monedaCambio = "EUR";
$moneda = new Moneda($monedaLocal, $monedaCambio);
$cambio = $moneda->obtenerCambio();
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1Desktop-Viajes</title>
    <link rel="icon" href="../multimedia/imágenes/favicon.ico" type="image/x-icon">
    <meta name="author" content="Dario Cristobal Gonzalez" />
    <meta name="description" content="Viajes de la temporada" />
    <meta name="keywords" content="Direccion, Reserva, Hoteles, Fecha" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../js/viajes.js" ></script>
    </head>
<body>
    <header>
        <h1><a href="../index.html">F1 Desktop</a></h1>
        <nav>
            <a href="../index.html">Inicio</a>
            <a href="../piloto.html">Piloto</a>
            <a href="../noticias.html">Noticias</a>
            <a href="../calendario.html">Calendario</a>
            <a href="../meteorologia.html">Meteorologia</a>
            <a href="../circuito.html">Circuito</a>
            <a class="active" href="viajes.php">Viajes</a>
            <a href="../juegos.html">Juegos</a>
        </nav>
    </header>
    <header><p>Estas en: <a href="../index.html">F1 Desktop</a> >> Viajes</p></header>
    <h2>Viajes</h2>
    <main>
        <section><h3>Mapa estático</h3></section> 
        <button aria-label="Mostrar Mapa Estático">Mostrar Mapa Estático</button>
        <h3>Mapa dinámico</h3>
        <div></div> 
        <button aria-label="Mostrar Mapa Dinámico">Mostrar Mapa Dinámico</button>
        <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBv7eN8EoyOgoHK1Gf8zO5QPWN1SY7SWy0"></script>
        <h3>Carrusel de imágenes</h3>
        <?php
        $carrusel = new Carrusel("Singapur", "Singapur");
        $carrusel->obtenerFotos();
        $carrusel->mostrarCarrusel();
        ?>
    </main>
    <h3>Cambio de Moneda</h3>
    <p>Moneda local: <?php echo $monedaLocal; ?></p>
    <p>Moneda de cambio: <?php echo $monedaCambio; ?></p>
    <p>
        Tipo de cambio: 
        <?php
        echo "1 {$monedaCambio} = {$cambio} {$monedaLocal}";
        ?>
    </p>
</body>
</html>
