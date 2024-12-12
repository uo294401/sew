class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob)
            document.write("<p>Este navegador soporta el API File</p>");
        else
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
    }

    readInputFile(input) {
        const archivo = input.files[0];

        const tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();
            lector.onload = (evento) => {
                const contenido = lector.result;
                this.procesarContenido(contenido);
            };
            lector.readAsText(archivo);
        }
    }

    procesarContenido(contenido) {
        const lineas = contenido.split('\n');
        const listaNoticias = document.querySelector("section");
        
        lineas.forEach(linea => {
            if (linea.trim()) {
                const [titulo, texto, autor] = linea.split('_'); 
                const noticia = document.createElement("article");
                noticia.innerHTML = `
                    <h3>${titulo}</h3>
                    <p>${texto}</p>
                    <p>${autor}</p>
                `;
                listaNoticias.appendChild(noticia);
            }
        });
    }

    agregarNoticiaManual(titulo, texto, autor) {
        const listaNoticias = document.querySelector("section");

        const noticia = document.createElement("article");
        noticia.innerHTML = `
            <h3>${titulo}</h3>
            <p>${texto}</p>
            <p>${autor}</p>
        `;
        listaNoticias.appendChild(noticia);
    }
}
