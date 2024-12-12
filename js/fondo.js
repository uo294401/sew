class Fondo{
    #pais
    #capital
    #circuitoF1
    constructor(pais,capital,circuitoF1){
        this.#pais=pais
        this.#capital=capital
        this.#circuitoF1=circuitoF1
    }
    obtenerImagenFondo() {
        const apiKey = '6c9e7b4923f2914517b1f0502864e187'; 
        const photoId = '52406399358'; 
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
    
        $.ajax({
          url: url,
          method: 'GET', 
          success: (data) => {
            if (data && data.photo) {
              const foto = data.photo;
              const imageUrl = `https://live.staticflickr.com/${foto.server}/${foto.id}_${foto.secret}_b.jpg`;
              $('body').css({
                'background-image': `url(${imageUrl})`,
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'min-height': '100vh', 
                'margin': '0'
              });
            } 
          },
        });
      }
}

const fondo = new Fondo("Singapur", "Singapur", "Marina Bay");
fondo.obtenerImagenFondo();