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
                        if(attrs[i].nodeName!= "xmlns" && attrs[i].nodeName != "xmlns:xsi" && attrs[i].nodeName != "xsi:schemaLocation"){
                                if(attrs[i].nodeName=="nombre"){
                                    outputHtml += `<h3>${attrs[i].nodeValue}</h3>`;
                                    outputHtml +="<fieldset>"
                                }else{
                                    outputHtml += `<p><label><strong>${attrs[i].nodeName}</strong>: ${attrs[i].nodeValue}</label></p>`;
                                }
                            }
                    }
                    outputHtml +="</fieldset>"
                }
  
                const bibliografia = xmlDoc.getElementsByTagNameNS(ns, 'bibliografia');
                outputHtml+="<h4>Páginas web relacionadas con el circuito:</h4>";
                outputHtml+="<ul>"
                if (bibliografia.length > 0) {
                    const referencias = bibliografia[0].getElementsByTagNameNS(ns, 'referencia');
                    $(referencias).each(function() {
                        const link = $(this).attr('link');
                        outputHtml += `<li>: <a href="${link}" target="_blank">${link}</a></li>`;
                    });
                }
                outputHtml+="</ul>"
  
                const imagenes = xmlDoc.getElementsByTagNameNS(ns, 'imagenes');
                outputHtml+="<h4>Imágenes</h4>";
                if (imagenes.length > 0) {
                    const imagenList = imagenes[0].getElementsByTagNameNS(ns, 'imagen');
                    $(imagenList).each(function() {
                    const link = $(this).attr('link');
                    outputHtml += `<img src="${link}" alt="Imagen"/>`;
                    });
                }
  
                const coordenadas = xmlDoc.getElementsByTagNameNS(ns, 'coordenadas');
                outputHtml+="<h4>Coordenadas de la parrilla de salida del circuito:</h4>";
                if (coordenadas.length > 0) {
                    const coordenadaList = coordenadas[0].getElementsByTagNameNS(ns, 'coordenada');
                    $(coordenadaList).each(function() {
                        const longitud = $(this).attr('longitud');
                        const latitud = $(this).attr('latitud');
                        const altitud = $(this).attr('altitud');
                        outputHtml += `<p> Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud}</p>`;
                    });
                }
  
                const tramos = xmlDoc.getElementsByTagNameNS(ns, 'tramo');
                outputHtml+="<h4>Tramos del circuito:</h4>";
                outputHtml+="<ol>"
                $(tramos).each(function() {
                    const distancia = $(this).attr('distancia');
                    const longitud = $(this).attr('longitud');
                    const latitud = $(this).attr('latitud');
                    const altitud = $(this).attr('altitud');
                    const numeroSector = $(this).attr('numeroSector');
                    outputHtml += `<li>Distancia: ${distancia}, Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud}, Sector: ${numeroSector}</li>`;
                });

                outputHtml += "</ol>";
                outputXml.html(outputHtml);
            };
            reader.readAsText(file);
        } 
    });
  
    $('input[type="file"]').eq(1).on('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
    
                // Obtener la primera coordenada del archivo KML
                const firstCoordinates = xmlDoc.querySelector("coordinates");
                if (firstCoordinates) {
                    const coordsText = firstCoordinates.textContent.trim();
                    const [lng, lat] = coordsText.split(",").map(Number); 
                    const mapaGeoposicionado = new google.maps.Map(document.querySelector("main > div"), {
                        zoom: 14,
                        center: { lat: lat, lng: lng },
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                    });
    
                    // Renderizar el archivo KML como una capa (requiere URL pública)
                    const kmlLayer = new google.maps.KmlLayer({
                        url: e.target.result,
                        map: mapaGeoposicionado,
                    });
                } 
            };
            reader.readAsText(file);
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
  