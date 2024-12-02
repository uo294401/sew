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
              $(xmlDoc).find('*').each(function() {
                  outputHtml += `<li>${this.nodeName}: ${$(this).text()}</li>`;
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
