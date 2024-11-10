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
        startButton.textContent='Arrancar Semáforo';
        startButton.onclick = this.initSequence.bind(this);
        mainElement.appendChild(startButton);

        const reactionButton=document.createElement('button');
        reactionButton.textContent='Tiempo de reacción';
        reactionButton.disabled = true;
        reactionButton.onclick = this.stopReaction.bind(this);
        mainElement.appendChild(reactionButton);

        const reactionTime = document.createElement('p');
        reactionTime.textContent = 'Tiempo de reacción: ';
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
        const reactionTime = (this.#clic_moment - this.#unload_moment) / 1000;
        const mainElement = document.querySelector('main');
        
        // Mostrar el tiempo de reacción
        const reactionParagraph = mainElement.querySelector('p');
        reactionParagraph.textContent = `Tiempo de reacción: ${reactionTime.toFixed(3)} segundos`;
    
        // Reiniciar botones y clases
        const startButton = mainElement.querySelector('button:nth-of-type(1)');
        const reactionButton = mainElement.querySelector('button:nth-of-type(2)');
        startButton.disabled = false;
        reactionButton.disabled = true;
        mainElement.classList.remove('load', 'unload');
    }
}