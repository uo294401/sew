class Fondo{
    #pais
    #capital
    #circuitoF1
    constructor(pais,capital,circuitoF1){
        this.#pais=pais
        this.#capital=capital
        this.#circuitoF1=circuitoF1
    }
    obtenerImagenFlickr() {
        const apiKey = 'TU_CLAVE_DE_API';  // Reemplaza con tu propia clave de API
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${this.circuito}&format=json&nojsoncallback=1`;

        // Realizamos la llamada AJAX
        $.ajax({
            url: url,
            method: 'GET',
            success: function(data) {
                if (data.photos && data.photos.photo.length > 0) {
                    const photo = data.photos.photo[0]; // Tomamos la primera foto
                    const imageUrl = `https://farm${photo.farm}.static.flickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;

                    // Llamar al método para establecer la imagen de fondo
                    fondo.establecerFondo(imageUrl);
                } else {
                    console.log('No se encontraron imágenes');
                }
            },
            error: function() {
                console.log('Error al realizar la llamada AJAX');
            }
        });
    }
}