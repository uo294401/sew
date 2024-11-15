class Pais {
    #nombre;
    #capital;
    #poblacion;
    #circuitoF1;
    #formaGobierno;
    #coordenadasMeta;
    #religionMayoritaria;
    constructor(nombre, capital, poblacion) {
        this.#nombre = nombre;                  
        this.#capital = capital;               
        this.#poblacion = poblacion;            
        this.#circuitoF1 = '';                  
        this.#formaGobierno = '';                
        this.#coordenadasMeta = { lat: 0, lon: 0, alt: 0 }; 
        this.#religionMayoritaria = '';         
    }

    inicializarValores(circuitoF1, formaGobierno, coordenadasMeta, religionMayoritaria) {
        this.#circuitoF1 = circuitoF1;
        this.#formaGobierno = formaGobierno;
        this.#coordenadasMeta = coordenadasMeta;
        this.#religionMayoritaria = religionMayoritaria;
    }

    obtenerNombre() {
        return this.#nombre;
    }

    obtenerCapital() {
        return this.#capital;
    }

    obtenerInformacionSecundaria() {
        return `
            <ul>
                <li>Circuito de F1: ${this.#circuitoF1}</li>
                <li>Población: ${this.#poblacion}</li>
                <li>Forma de Gobierno: ${this.#formaGobierno}</li>
                <li>Religión Mayoritaria: ${this.#religionMayoritaria}</li>
            </ul>
        `;
    }

    escribirCoordenadas() {
        const { lat, lon, alt } = this.#coordenadasMeta; 
        document.write(`Coordenadas de la línea de meta: Latitud ${lat}, Longitud ${lon}, Altitud ${alt}`);
    }

    obtenerPronostico(circuito) {
        const apiKey = 'TU_API_KEY_OPENWEATHER'; // Reemplazar con la API Key de OpenWeatherMap
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${circuito}&lang=es&units=metric&appid=${apiKey}`;
      
        $.ajax({
          url: url,
          method: 'GET',
          success: (data) => {
            mostrarPronostico(data);
          },
          error: (error) => {
            console.error("Error al obtener el pronóstico:", error);
          }
        });
      }
      
    mostrarPronostico(data) {
        data.list.slice(0, 5).forEach((dia) => {
          const pronosticoHTML = `
            <article>
              <p>Temp Máx: ${dia.main.temp_max}°C</p>
              <p>Temp Mín: ${dia.main.temp_min}°C</p>
              <p>Humedad: ${dia.main.humidity}%</p>
              <img src="http://openweathermap.org/img/wn/${dia.weather[0].icon}.png" alt="${dia.weather[0].description}">
              <p>Lluvia: ${dia.rain ? dia.rain['3h'] : 0} mm</p>
            </article>
          `;
          $('#pronostico').append(pronosticoHTML);
        });
      }
}