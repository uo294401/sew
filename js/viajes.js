class Geolocalización {
    constructor (){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }
    getPosicion(posicion){
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;
    }
    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }
    getLongitud(){
        return this.longitud;
    }
    getLatitud(){
        return this.latitud;
    }
    getAltitud(){
        return this.altitud;
    }
    getMapaEstaticoGoogle(dondeVerlo){
        const ubicacion = document.querySelector("section");
        
        var apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        var centro = "center=" + this.latitud + "," + this.longitud;

        var zoom ="&zoom=15";
        var tamaño= "&size=300x230";
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        var sensor = "&sensor=false"; 
        
        var formato = "&format=webp";
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey + formato;
        ubicacion.innerHTML = "<img src='"+this.imagenMapa+"' alt='mapa estático google' />";
    }
    initMap(){  
        const mapaGeoposicionado = new google.maps.Map(document.querySelector("main > div"),{
            zoom: 14,
            center:{lat:this.latitud,lng:this.longitud},
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        new google.maps.Marker({
            position:{lat:this.latitud,lng:this.longitud},
            map:mapaGeoposicionado
        });
    }

} 
function carrusel() {
    const slides = document.querySelectorAll("main figure img");

    const nextButton = document.querySelector("main figure button:last-of-type"); 
    const prevButton = document.querySelector("main figure button:nth-last-of-type(2)"); 
    
    let curSlide = 0;
    const totalSlides = slides.length;
    
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${index * 100}%)`;
    });
    
    function updateSlides() {
        slides.forEach((slide, index) => {
            const offset = 100 * (index - curSlide);
            slide.style.transform = `translateX(${offset}%)`;
        });
    }
    
    nextButton.addEventListener("click", () => {
        curSlide = (curSlide + 1) % totalSlides; 
        updateSlides();
    });
    
    prevButton.addEventListener("click", () => {
        curSlide = (curSlide - 1 + totalSlides) % totalSlides; 
        updateSlides();
    });
    
}
document.addEventListener('DOMContentLoaded', () => {
    const geo = new Geolocalización(); 
    carrusel();
    const botones = document.querySelectorAll("button");
    botones[0].addEventListener("click", function () {
        geo.getMapaEstaticoGoogle();
    });
    botones[1].addEventListener("click", function () {
        geo.initMap();
    });
});





