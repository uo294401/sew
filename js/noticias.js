class noticias{
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) 
            document.write("<p>Este navegador soporta el API File </p>");
        else 
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
    }

    readInputFile(file){

    }
}