import xml.etree.ElementTree as ET

def extract_altimetria(filename):
    namespaces = {'uni': 'http://www.uniovi.es'}
    tree = ET.parse(filename)
    root = tree.getroot()

    distancias = []
    altitudes = []

    for tramo in root.findall("uni:tramos/uni:tramo", namespaces):
        distancia = float(tramo.attrib.get('distancia'))
        altitud = float(tramo.attrib.get('altitud'))

        distancias.append(distancia)
        altitudes.append(altitud)

    return distancias, altitudes

def generate_svg(distancias, altitudes, output_filename):
    svg_width = 700
    svg_height = 350
    max_distance = sum(distancias)
    max_altitude = max(altitudes)

    x_scale = svg_width / max_distance
    y_scale = svg_height / max_altitude

    points = []
    current_x = 0

    for distance, altitude in zip(distancias, altitudes):
        current_y = svg_height - (altitude * y_scale)
        points.append(f"{current_x},{current_y}")
        current_x += distance * x_scale

    points.extend([f"{current_x},{svg_height}", f"0,{svg_height}"])

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{svg_width}" height="{svg_height}">
        <polyline points="{" ".join(points)}" fill="lightblue" stroke="black" stroke-width="3"/>
        <text x="10" y="20" font-size="16" fill="black">Perfil de Altimetría del Circuito</text>
    </svg>'''

    with open(output_filename, 'w') as svg_file:
        svg_file.write(svg_content)

xml_filename = "circuitoEsquema.xml"
svg_filename = "perfil.svg"

distancias, altitudes = extract_altimetria(xml_filename)
generate_svg(distancias, altitudes, svg_filename)

print(f"Archivo SVG '{svg_filename}' generado con éxito.")