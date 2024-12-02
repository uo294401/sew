$(document).ready(function() {
    // Procesar archivo XML
    $('input[type="file"]').eq(0).on('change', function(event) {
        const file = event.target.files[0];
        const outputXml = $('section').eq(0); // Primera sección
        if (file && file.type === "text/xml") {
            const reader = new FileReader();
            reader.onload = function(e) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
  
  
                let outputHtml = "<ul>";
  
                // Obtener el espacio de nombres del XML
                const ns = "http://www.uniovi.es";
  
                // Acceder al nodo <circuito> con el espacio de nombres
                const circuito = xmlDoc.getElementsByTagNameNS(ns, 'circuito')[0];
                if (circuito) {
                    // Mostrar los atributos del nodo "circuito"
                    const attrs = circuito.attributes;
                    for (let i = 0; i < attrs.length; i++) {
                        outputHtml += `<li><strong>${attrs[i].nodeName}</strong>: ${attrs[i].nodeValue}</li>`;
                    }
                }
  
                // Acceder a los nodos hijos como <bibliografia>, <imagenes>, etc.
                const bibliografia = xmlDoc.getElementsByTagNameNS(ns, 'bibliografia');
                if (bibliografia.length > 0) {
                    const referencias = bibliografia[0].getElementsByTagNameNS(ns, 'referencia');
                    $(referencias).each(function() {
                        const link = $(this).attr('link');
                        outputHtml += `<li><strong>Referencia</strong>: <a href="${link}" target="_blank">${link}</a></li>`;
                    });
                }
  
                const imagenes = xmlDoc.getElementsByTagNameNS(ns, 'imagenes');
                if (imagenes.length > 0) {
                    const imagenList = imagenes[0].getElementsByTagNameNS(ns, 'imagen');
                    $(imagenList).each(function() {
                    const link = $(this).attr('link');
                    outputHtml += `<li><strong>Imagen</strong>: <img src="${link}" alt="Imagen"/></li>`;
                    });
                }
  
                const coordenadas = xmlDoc.getElementsByTagNameNS(ns, 'coordenadas');
                if (coordenadas.length > 0) {
                    const coordenadaList = coordenadas[0].getElementsByTagNameNS(ns, 'coordenada');
                    $(coordenadaList).each(function() {
                        const longitud = $(this).attr('longitud');
                        const latitud = $(this).attr('latitud');
                        const altitud = $(this).attr('altitud');
                        outputHtml += `<li><strong>Coordenada</strong>: Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud}</li>`;
                    });
                }
  
                // Mostrar los tramos
                const tramos = xmlDoc.getElementsByTagNameNS(ns, 'tramo');
                $(tramos).each(function() {
                    const distancia = $(this).attr('distancia');
                    const longitud = $(this).attr('longitud');
                    const latitud = $(this).attr('latitud');
                    const altitud = $(this).attr('altitud');
                    const numeroSector = $(this).attr('numeroSector');
                    outputHtml += `<li><strong>Tramo</strong>: Distancia: ${distancia}, Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud}, Sector: ${numeroSector}</li>`;
                });
  
                outputHtml += "</ul>";
                outputXml.html(outputHtml);
            };
            reader.readAsText(file);
        } else {
            alert("Por favor, selecciona un archivo XML válido.");
        }
    });
  
    // Procesar archivo KML
    $('input[type="file"]').eq(1).on('change', function(event) {
        const file = event.target.files[0];
        const mapDiv = $('div').eq(0); // Primer div
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const map = new google.maps.Map(mapDiv[0], {
                    center: { lat: 0, lng: 0 },
                    zoom: 2,
                });
                const kmlLayer = new google.maps.KmlLayer({
                    url: e.target.result,
                    map: map,
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, selecciona un archivo KML válido.");
        }
    });
  
    // Procesar archivo SVG
    $('input[type="file"]').eq(2).on('change', function(event) {
        const file = event.target.files[0];
        const outputSvg = $('section').eq(1); // Segunda sección
        if (file && file.type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onload = function(e) {
                outputSvg.html(e.target.result);
            };
            reader.readAsText(file);
        } else {
            alert("Por favor, selecciona un archivo SVG válido.");
        }
    });
  });
  