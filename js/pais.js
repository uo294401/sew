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
        const { lat, lon, alt } = this.#coordenadasMeta; // Asegúrate de incluir 'alt' si lo necesitas
        document.write(`Coordenadas de la línea de meta: Latitud ${lat}, Longitud ${lon}, Altitud ${alt}`);
    }
}