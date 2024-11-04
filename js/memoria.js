const json = {
    name: "Cartas de equipos de fórmula 1",
    active: true,
    cartas: [
      {
        name: "Alpine",
        dataState: "hidden",
        logo: "multimedia/imágenes/Alpine_F1_Team_2021_Logo"
      },
      {
        name: "Alpine",
        dataState: "hidden",
        logo: "multimedia/imágenes/Alpine_F1_Team_2021_Logo"
      },
      {
        name: "Aston Martin",
        dataState: "hidden",
        logo: "multimedia/imágenes/Aston_Martin_Aramco_Cognizant_F1"
      },
      {
        name: "Aston Martin",
        dataState: "hidden",
        logo: "multimedia/imágenes/Aston_Martin_Aramco_Cognizant_F1"
      },
      {
        name: "McLaren",
        dataState: "hidden",
        logo: "multimedia/imágenes/McLaren_Racing_logo"
      },
      {
        name: "McLaren",
        dataState: "hidden",
        logo: "multimedia/imágenes/McLaren_Racing_logo"
      },
      {
        name: "Mercedes",
        dataState: "hidden",
        logo: "multimedia/imágenes/Mercedes_AMG_Petronas_F1_Logo"
       },
      {
        name: "Mercedes",
        dataState: "hidden",
        logo: "multimedia/imágenes/Mercedes_AMG_Petronas_F1_Logo"
      },
      {
        name: "Red Bull",
        dataState: "hidden",
        logo: "multimedia/imágenes/Red_Bull_Racing_logo"
      },
      {
        name: "Red Bull",
        dataState: "hidden",
        logo: "multimedia/imágenes/Red_Bull_Racing_logo"
      },
      {
        name: "Ferrari",
        dataState: "hidden",
        logo: "multimedia/imágenes/Scuderia_Ferrari_Logo"
      },
      {
        name: "Ferrari",
        dataState: "hidden",
        logo: "multimedia/imágenes/Scuderia_Ferrari_Logo"
      }
    ]
  };
  class Memoria{
    #hasFlippedCard
    #lockBoard
    #firstCard
    #secondCard
    constructor(hasFlippedCard,lockBoard, firstCard,secondCard){
        this.#hasFlippedCard=hasFlippedCard
        this.#lockBoard=lockBoard
        this.#firstCard=firstCard
        this.#secondCard=secondCard
        this.shuffleElements()
        this.createElements()
        this.addEventListeners()
    }
    shuffleElements(){
        const cartas= json.cartas;
        for (let i = cartas.length - 1; i >0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const changed=cartas[j]
            cartas[j]=cartas[i]
            cartas[i]=changed 
        }
    }
    unflipCards(){
        this.#lockBoard=true
        setTimeout(()=>{
            this.#firstCard.dataState = "hidden";
            this.#secondCard.dataState = "hidden";
            this.resetBoard()
        },2000);
    }
    resetBoard(){
        this.#firstCard=null
        this.#secondCard=null
        this.#hasFlippedCard=false
        this.#lockBoard=false
    }
    checkForMatch(){
        this.#firstCard.name==this.#secondCard.name ? this.disableCards() : this.unflipCards();
    }
    disableCards(){
        this.#firstCard.dataState = "revealed";
        this.#secondCard.dataState = "revealed";
        this.resetBoard()
    }
    createElements() {
      const container = document.querySelector('.card-container');
      json.cartas.forEach(card => {
        const cardElement = document.createElement('article');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-element', card.name);
        cardElement.dataset.state = card.dataState; 

        const h3 = document.createElement('h3');
        h3.textContent = 'Memory Card'; 
        cardElement.appendChild(h3);

        const img = document.createElement('img');
        img.src = card.logo;
        img.alt = card.name;
        cardElement.appendChild(img);

        container.appendChild(cardElement);
      });
  }
    addEventListeners() {
      const cards = json.cartas; 
      cards.forEach(card => {
        card.addEventListener('click', this.flipCard.bind(card, this)); 
      });
    }

    flipCard(game) {
      if (this.dataState === "revealed") return;
      if (game.#lockBoard) return; 
      if (this === game.firstCard) return;
      this.dataState = "flip"; 
      if(!game.hasFlippedCard){
        game.hasFlippedCard = true;
        game.firstCard=this;
      }else{
        game.secondCard=this;
        game.checkForMatch(this); 
      }
    }
}
  