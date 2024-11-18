class noticias{
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) 
            document.write("<p>Este navegador soporta el API File </p>");
        else 
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
    }

    readInputFile(files){
        const archivo = files[0]; 

        Noticias.mostrarMetadatos(archivo);

        const tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();
            lector.onload = function (evento) {
                Noticias.procesarContenido(lector.result);
            };
            lector.readAsText(archivo); 
        } else {
            document.getElementById("errorArchivo").innerText = "Error: ¡¡El archivo no es un archivo de texto!!";
        }  
    }
}