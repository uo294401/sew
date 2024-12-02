class Semaforo{
    #levels
    #lights
    #unload_moment
    #clic_moment
    #difficulty
    constructor(){
        this.#levels=[0.2,0.5,0.8];
        this.#lights=4;
        this.#unload_moment=null;
        this.#clic_moment=null;
        this.#difficulty=this.#levels[Math.floor(Math.random() * 3)];
        this.createStructure();
    }

    createStructure(){
        const mainElement= document.querySelector('main');
        const header = document.createElement('h1');
        header.textContent= 'Juego del Semáforo';
        mainElement.appendChild(header);
        for(let i=0; i<this.#lights;i++){
            const lightBlock=document.createElement('div');
            mainElement.appendChild(lightBlock);
        }
        const startButton=document.createElement('button');
        startButton.textContent='Arranque';
        startButton.onclick = this.initSequence.bind(this);
        mainElement.appendChild(startButton);
        const reactionButton=document.createElement('button');
        reactionButton.textContent='Reacción';
        reactionButton.disabled = true;
        reactionButton.onclick = this.stopReaction.bind(this);
        mainElement.appendChild(reactionButton);
        mainElement.appendChild(reactionTime);
    }
    initSequence(){
        const mainElement= document.querySelector('main');
        mainElement.classList.add('load');
        const startButton = mainElement.querySelector('button:nth-of-type(1)');
        startButton.disabled = true;
        setTimeout(() => {
            this.#unload_moment = new Date();
            this.endSequence();
        }, 2000 + this.#difficulty * 100);
    }
    endSequence() {
        const mainElement = document.querySelector('main');
        mainElement.classList.remove('load');
        mainElement.classList.add('unload');
        const reactionButton = mainElement.querySelector('button:nth-of-type(2)');
        reactionButton.disabled = false;
    }
    stopReaction() {
        this.#clic_moment = new Date();
        const reactionTime = (this.#clic_moment - this.#unload_moment);
        const mainElement = document.querySelector('main');
        let reactionTimeP = mainElement.querySelector('p'); 
        
        if (!reactionTimeP) {
            reactionTimeP = document.createElement('p');
            mainElement.appendChild(reactionTimeP);
        }
        reactionTimeP.textContent = `Tiempo de reacción: ${(reactionTime / 1000).toFixed(3)} segundos`;  // Mostrar en segundos
    
        // Restaurar el estado de los botones
        mainElement.classList.remove('unload', 'load');
        const startButton = mainElement.querySelector('button:nth-of-type(1)');
        const reactionButton = mainElement.querySelector('button:nth-of-type(2)');
        reactionButton.disabled = true;
        startButton.disabled = false;
    
        // Crear el formulario para registrar el récord
        this.createRecordForm();
    }
    /*
    createRecordForm(){
        const mainElement = document.querySelector('main');

        // Crear el formulario
        const formHtml = `
            <form id="recordForm" action="procesarFormulario.php" method="POST">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required><br>
    
                <label for="apellidos">Apellidos:</label>
                <input type="text" id="apellidos" name="apellidos" required><br>
    
                <label for="nivel">Nivel:</label>
                <input type="text" id="nivel" name="nivel" value="${this.#difficulty}" readonly><br>
    
                <label for="tiempo">Tiempo de reacción (segundos):</label>
                <input type="text" id="tiempo" name="tiempo" value="${(this.#clic_moment - this.#unload_moment) / 1000}" readonly><br>
    
                <input type="submit" value="Guardar Record">
            </form>
        `;
    
        // Añadir el formulario al contenedor principal (debajo del semáforo)
        const recordContainer = document.createElement('div');
        recordContainer.id = 'record-container';
        recordContainer.innerHTML = formHtml;
        mainElement.appendChild(recordContainer);
    }
        */
}