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
    generarContenidoDinamico() {
        const tituloPais = document.createElement("h3");
        tituloPais.textContent = `Información del País: ${this.#nombre}`;
        document.body.appendChild(tituloPais);

        const capitalPais = document.createElement("p");
        capitalPais.textContent = `Capital: ${this.#capital}`;
        document.body.appendChild(capitalPais);

        const infoSecundaria = document.createElement("ul");
        infoSecundaria.innerHTML = `
            <li>Circuito de F1: ${this.#circuitoF1}</li>
            <li>Población: ${this.#poblacion}</li>
            <li>Forma de Gobierno: ${this.#formaGobierno}</li>
            <li>Religión Mayoritaria: ${this.#religionMayoritaria}</li>
        `;
        document.body.appendChild(infoSecundaria);

        const { lat, lon, alt } = this.#coordenadasMeta;
        const coordenadas = document.createElement("p");
        coordenadas.textContent = `Coordenadas de la línea de meta: Latitud ${lat}, Longitud ${lon}, Altitud ${alt}`;
        document.body.appendChild(coordenadas);

        this.cargarDatos();
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
        const pCoordenadas = document.createElement('p');
        pCoordenadas.textContent = `Coordenadas de la línea de meta: Latitud ${lat}, Longitud ${lon}, Altitud ${alt}`;
        document.body.appendChild(pCoordenadas);
    }

    cargarDatos() {
      const apiKey = '361b23232f14213c128024345d952c1f'; 
      const lat = this.#coordenadasMeta.lat; 
      const lon = this.#coordenadasMeta.lon;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&mode=xml&units=metric&lang=es`;
  
      $.ajax({
        dataType: "xml", 
        url: url,
        method: 'GET',
        success: function(datos) {
    
            let datosPorDia = {};
    
            $(datos).find('time').each(function() {
                const fecha = $(this).attr('from');  
                const tempMax = parseFloat($(this).find('temperature').attr('max')); 
                const tempMin = parseFloat($(this).find('temperature').attr('min')); 
                const humedad = parseFloat($(this).find('humidity').attr('value')); 
                const precipitacion = parseFloat($(this).find('precipitation').attr('value')) || 0; 
                const icono = $(this).find('symbol').attr('var');
    
                const fechaObj = new Date(fecha);
                const dia = `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
    
                if (!datosPorDia[dia]) {
                    datosPorDia[dia] = {
                        temperaturasMax: [],
                        temperaturasMin: [],
                        humedades: [],
                        precipitaciones: [],
                        iconos: []
                    };
                }
    
                datosPorDia[dia].temperaturasMax.push(tempMax);
                datosPorDia[dia].temperaturasMin.push(tempMin);
                datosPorDia[dia].humedades.push(humedad);
                datosPorDia[dia].precipitaciones.push(precipitacion);
                datosPorDia[dia].iconos.push(icono);
            });
    
            for (let dia in datosPorDia) {
                const tempMaxDia = Math.max(...datosPorDia[dia].temperaturasMax);
                const tempMinDia = Math.min(...datosPorDia[dia].temperaturasMin);
                const promedioHumedad = promedio(datosPorDia[dia].humedades);
                const precipitacionTotal = suma(datosPorDia[dia].precipitaciones);
                const iconoMasFrecuente = obtenerIconoMasFrecuente(datosPorDia[dia].iconos);
    
                let pronosticoHTML = `
                    <article>
                        <h3>Pronóstico para el ${dia}</h3>
                        <p><strong>Temperatura máxima:</strong> ${tempMaxDia.toFixed(2)} °C</p>
                        <p><strong>Temperatura mínima:</strong> ${tempMinDia.toFixed(2)} °C</p>
                        <p><strong>Humedad promedio:</strong> ${promedioHumedad.toFixed(2)} %</p>
                        <p><strong>Lluvia total:</strong> ${precipitacionTotal.toFixed(2)} mm</p>
                        <p><img src="https://openweathermap.org/img/wn/${iconoMasFrecuente}@2x.png" alt="Icono del clima"/></p>
                    </article>
                `;
                $('body').append(pronosticoHTML);
            }
        },
        error: function() {
            $('body').append('<p>No se pudo obtener los datos del clima.</p>');
        }
    });
  }
  
}
function promedio(arr) {
    let sumaTotal = 0;
    for (let i = 0; i < arr.length; i++) {
        sumaTotal += arr[i];
    }
    return sumaTotal / arr.length;
}

function suma(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total;
}

function obtenerIconoMasFrecuente(iconos) {
    const iconoCount = {};
    for (let i = 0; i < iconos.length; i++) {
        const icono = iconos[i];
        if (iconoCount[icono]) {
            iconoCount[icono]++;
        } else {
            iconoCount[icono] = 1;
        }
    }

    let masFrecuente = null;
    let maxCount = 0;

    for (let icono in iconoCount) {
        if (iconoCount[icono] > maxCount) {
            maxCount = iconoCount[icono];
            masFrecuente = icono;
        }
    }

    return masFrecuente;
}