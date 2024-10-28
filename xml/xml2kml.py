import xml.etree.ElementTree as ET
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Función para generar el archivo KML
def generate_kml(xml_file, kml_file):
    # Parsear el archivo XML
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Crear el archivo KML
    with open(kml_file, 'w') as kml:
        # Escribir el encabezado del KML
        kml.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        kml.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
        kml.write('<Document>\n')
        kml.write('<name>{}</name>\n'.format(root.get('nombre')))
        
        # Escribir las coordenadas
        kml.write('<Placemark>\n')
        kml.write('<name>{}</name>\n'.format(root.get('nombre')))
        kml.write('<LineString>\n')
        kml.write('<tessellate>1</tessellate>\n')
        kml.write('<coordinates>\n')

        # Extraer coordenadas del XML
        for coord in root.findall('.//coordenada'):
            lon = coord.get('longitud')
            lat = coord.get('latitud')
            kml.write(f'{lon},{lat},0\n')  # Añadiendo altitud como 0 para simplificar

        kml.write('</coordinates>\n')
        kml.write('</LineString>\n')
        kml.write('</Placemark>\n')
        
        # Escribir el epílogo del KML
        kml.write('</Document>\n')
        kml.write('</kml>\n')

# Función para generar un PDF de la planimetría del circuito
def generate_pdf(pdf_file, circuit_name):
    c = canvas.Canvas(pdf_file, pagesize=letter)
    c.drawString(100, 750, "Planimetría del Circuito: {}".format(circuit_name))
    c.drawString(100, 730, "El archivo KML ha sido generado correctamente.")
    c.save()

# Archivos de entrada y salida
xml_file = 'circuitoEsquema.xml'
kml_file = 'circuito.kml'
pdf_file = 'planimetria.pdf'

# Generar KML y PDF
generate_kml(xml_file, kml_file)
generate_pdf(pdf_file, 'MARINA BAY')

print("Archivos KML y PDF generados exitosamente.")