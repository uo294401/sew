# 02020-KML.py
# -*- coding: utf-8 -*-
"""
Crea archivos KML con puntos y líneas
@version 1.0 17/Noviembre/2023
"""

import xml.etree.ElementTree as ET

class Kml(object):
    """
    Genera archivo KML con puntos y líneas
    """
    def __init__(self):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz, 'Document')

    def addPlacemark(self, long, lat, alt, modoAltitud):
        """
        Añade un elemento <Placemark> con puntos <Point>
        """
        pm = ET.SubElement(self.doc, 'Placemark')
        punto = ET.SubElement(pm, 'Point')
        ET.SubElement(punto, 'coordinates').text = '\n{},{},{}\n'.format(long, lat, alt)
        ET.SubElement(punto, 'altitudeMode').text = '\n' + modoAltitud + '\n'

    def addLineString(self, nombre, extrude, tesela, listaCoordenadas, modoAltitud, color, ancho):
        """
        Añade un elemento <Placemark> con líneas <LineString>
        """
        ET.SubElement(self.doc, 'name').text = '\n' + nombre + '\n'
        pm = ET.SubElement(self.doc, 'Placemark')
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls, 'extrude').text = '\n' + extrude + '\n'
        ET.SubElement(ls, 'tessellation').text = '\n' + tesela + '\n'
        ET.SubElement(ls, 'coordinates').text = '\n' + listaCoordenadas + '\n'
        ET.SubElement(ls, 'altitudeMode').text = '\n' + modoAltitud + '\n'

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement(linea, 'color').text = '\n' + color + '\n'
        ET.SubElement(linea, 'width').text = '\n' + ancho + '\n'

    def escribir(self, nombreArchivoKML):
        """
        Escribe el archivo KML con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)


def main():
    print(Kml.__doc__)
    nombreKML = "circuito.kml"
    nuevoKML = Kml()
    namespaces = {'uni': 'http://www.uniovi.es'}

    tree = ET.parse("circuitoEsquema.xml")
    root = tree.getroot()
    coordenadasPaseo = ""

    for tramo in root.findall("uni:tramos/uni:tramo", namespaces):
        longitud = tramo.attrib.get("longitud")
        latitud = tramo.attrib.get("latitud")
        altitud = tramo.attrib.get("altitud")
        nuevoKML.addPlacemark(longitud, latitud, altitud, 'relativeToGround')
        coordenadasPaseo += f"{longitud},{latitud},{altitud}\n"

    nuevoKML.addLineString("MARINA BAY", "1", "1", coordenadasPaseo, 'relativeToGround', '#ff0000ff', "5")
    nuevoKML.escribir(nombreKML)
    print("Creado el archivo: ", nombreKML)

if __name__ == "__main__":
    main()