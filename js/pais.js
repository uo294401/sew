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

    cargarDatos() {
      const apiKey = '361b23232f14213c128024345d952c1f'; // Tu API Key
      const lat = this.#coordenadasMeta.lat; // Coordenada de latitud
      const lon = this.#coordenadasMeta.lon; // Coordenada de longitud
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&mode=xml&units=metric&lang=es`;
  
      $.ajax({
          dataType: "xml", // Solicitar datos en formato XML
          url: url,
          method: 'GET',
          success: function(datos) {
              console.log('Datos recibidos:', datos); // Depuración
  
              let datosPorDia = {};
  
              // Iterar a través de los intervalos de 3 horas
              $(datos).find('time').each(function() {
                  const fecha = $(this).attr('from');  // Fecha en formato ISO (ej: 2024-11-18T00:00:00)
                  const tempMax = parseFloat($(this).find('temperature').attr('max')); // Temperatura máxima
                  const tempMin = parseFloat($(this).find('temperature').attr('min')); // Temperatura mínima
                  const humedad = parseFloat($(this).find('humidity').attr('value')); // Humedad
                  const precipitacion = parseFloat($(this).find('precipitation').attr('value')) || 0; // Precipitación
                  const icono = $(this).find('weather').attr('icon'); // Icono del clima
  
                  // Convertir la fecha ISO en un formato más sencillo de usar (solo día)
                  const fechaObj = new Date(fecha);
                  const dia = `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
  
                  // Si aún no existe ese día en el objeto, lo inicializamos
                  if (!datosPorDia[dia]) {
                      datosPorDia[dia] = {
                          temperaturasMax: [],
                          temperaturasMin: [],
                          humedades: [],
                          precipitaciones: [],
                          iconos: []
                      };
                  }
  
                  // Almacenamos los valores correspondientes
                  datosPorDia[dia].temperaturasMax.push(tempMax);
                  datosPorDia[dia].temperaturasMin.push(tempMin);
                  datosPorDia[dia].humedades.push(humedad);
                  datosPorDia[dia].precipitaciones.push(precipitacion);
                  datosPorDia[dia].iconos.push(icono);
              });
  
              console.log('Datos agrupados por día:', datosPorDia); // Depuración
  
              // Ahora, para cada día, calculamos los promedios y mostramos la información
              for (let dia in datosPorDia) {
                  // Calculamos la temperatura máxima y mínima real de todo el día (máximo y mínimo de los intervalos)
                  const tempMaxDia = Math.max(...datosPorDia[dia].temperaturasMax);
                  const tempMinDia = Math.min(...datosPorDia[dia].temperaturasMin);
                  const promedioHumedad = promedio(datosPorDia[dia].humedades);
                  const precipitacionTotal = suma(datosPorDia[dia].precipitaciones);
                  const iconoMasFrecuente = obtenerIconoMasFrecuente(datosPorDia[dia].iconos);
  
                  // Crear HTML para cada día
                  let pronosticoHTML = `
                      <article>
                          <h3>Pronóstico para el ${dia}</h3>
                          <p><strong>Temperatura máxima:</strong> ${tempMaxDia.toFixed(2)} °C</p>
                          <p><strong>Temperatura mínima:</strong> ${tempMinDia.toFixed(2)} °C</p>
                          <p><strong>Humedad promedio:</strong> ${promedioHumedad.toFixed(2)} %</p>
                          <p><strong>Lluvia total:</strong> ${precipitacionTotal.toFixed(2)} mm</p>
                          <p><img src="http://openweathermap.org/img/wn/${iconoMasFrecuente}.png" alt="Icono del clima" /></p>
                      </article>
                  `;
                  // Mostrar la información en el cuerpo del documento
                  $('body').append(pronosticoHTML);
              }
          },
          error: function() {
              $('body').append('<p>No se pudo obtener los datos del clima.</p>');
          }
      });
  }
  
}
  // Función para calcular el promedio de un array de números
  function promedio(arr) {
    const sumaTotal = arr.reduce((acc, curr) => acc + curr, 0);
    return sumaTotal / arr.length;
}

// Función para calcular la suma total de un array de números (precipitaciones)
function suma(arr) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}

// Función para obtener el icono más frecuente de los intervalos
function obtenerIconoMasFrecuente(iconos) {
    const iconoCount = {};
    iconos.forEach(icono => {
        iconoCount[icono] = (iconoCount[icono] || 0) + 1;
    });
    // Encontrar el icono con el mayor número de repeticiones
    return Object.keys(iconoCount).reduce((a, b) => iconoCount[a] > iconoCount[b] ? a : b);
}