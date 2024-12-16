$(document).ready(function() {
    $('input[type="file"]').eq(0).on('change', function(event) {
        const file = event.target.files[0];
        const outputXml = $('section').eq(0); 
        if (file && file.type === "text/xml") {
            const reader = new FileReader();
            reader.onload = function(e) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
  
  
                let outputHtml;
  
                const ns = "http://www.uniovi.es";
  
                
                const circuito = xmlDoc.getElementsByTagNameNS(ns, 'circuito')[0];
                if (circuito) {
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
    
                const coordinatesList = xmlDoc.querySelectorAll("coordinates");
                if (coordinatesList.length > 0) {
                    const coordsArray = Array.from(coordinatesList).map(coord => {
                        const [lng, lat] = coord.textContent.trim().split(",").map(Number);
                        return { lat, lng };
                    });
    
                    const mapaGeoposicionado = new google.maps.Map(document.querySelector("main > div"), {
                        zoom: 14,
                        center: coordsArray[0],
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                    });
    
                    const polyline = new google.maps.Polyline({
                        path: coordsArray,
                        geodesic: true,
                        strokeColor: '#FF0000',  
                        strokeOpacity: 1.0,
                        strokeWeight: 2,  
                        map: mapaGeoposicionado
                    });
                }
            };
            reader.readAsText(file);
        }
    });
    
    
  
    $('input[type="file"]').eq(2).on('change', function(event) {
        const file = event.target.files[0];
        const outputSvg = $('section').eq(1);
        if (file && file.type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onload = function(e) {
                const svgContent = e.target.result;

                outputSvg.html(svgContent);
    
                const h3 = $('<h3></h3>').text('Archivo svg');
                outputSvg.prepend(h3);

                const svgElement = outputSvg.find('svg');
                const containerWidth = outputSvg.width();
                const containerHeight = outputSvg.height();
    
                svgElement.attr('viewBox', svgElement.attr('viewBox') || `0 0 ${containerWidth} ${containerHeight}`);
                svgElement.attr('width', '100%');
                svgElement.attr('height', '100%');
            };
            reader.readAsText(file);
        } 
    });
  });
  