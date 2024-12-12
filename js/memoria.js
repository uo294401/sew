const json = {
    name: "Cartas de equipos de fórmula 1",
    active: true,
    cartas: [
      {
        name: "Alpine",
        dataState: "hidden",
        logo: "multimedia/imágenes/Alpine_F1_Team_2021_Logo.svg"
      },
      {
        name: "Alpine",
        dataState: "hidden",
        logo: "multimedia/imágenes/Alpine_F1_Team_2021_Logo.svg"
      },
      {
        name: "Aston Martin",
        dataState: "hidden",
        logo: "multimedia/imágenes/Aston_Martin_Aramco_Cognizant_F1.svg"
      },
      {
        name: "Aston Martin",
        dataState: "hidden",
        logo: "multimedia/imágenes/Aston_Martin_Aramco_Cognizant_F1.svg"
      },
      {
        name: "McLaren",
        dataState: "hidden",
        logo: "multimedia/imágenes/McLaren_Racing_logo.svg"
      },
      {
        name: "McLaren",
        dataState: "hidden",
        logo: "multimedia/imágenes/McLaren_Racing_logo.svg"
      },
      {
        name: "Mercedes",
        dataState: "hidden",
        logo: "multimedia/imágenes/Mercedes_AMG_Petronas_F1_Logo.svg"
       },
      {
        name: "Mercedes",
        dataState: "hidden",
        logo: "multimedia/imágenes/Mercedes_AMG_Petronas_F1_Logo.svg"
      },
      {
        name: "Red Bull",
        dataState: "hidden",
        logo: "multimedia/imágenes/Red_Bull_Racing_logo.svg"
      },
      {
        name: "Red Bull",
        dataState: "hidden",
        logo: "multimedia/imágenes/Red_Bull_Racing_logo.svg"
      },
      {
        name: "Ferrari",
        dataState: "hidden",
        logo: "multimedia/imágenes/Scuderia_Ferrari_Logo.svg"
      },
      {
        name: "Ferrari",
        dataState: "hidden",
        logo: "multimedia/imágenes/Scuderia_Ferrari_Logo.svg"
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
          this.#firstCard.setAttribute('data-state', 'hidden');
          this.#secondCard.setAttribute('data-state', 'hidden');
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
      this.#firstCard.getAttribute('data-element') === this.#secondCard.getAttribute('data-element') ? this.disableCards() : this.unflipCards();    
    }
    disableCards(){
      this.#firstCard.setAttribute('data-state', 'revealed');
      this.#secondCard.setAttribute('data-state', 'revealed');
      this.resetBoard()
    }
    createElements() {
      const container = document.querySelector('section > section');
      json.cartas.forEach(card => {
        const cardElement = document.createElement('article');
        cardElement.setAttribute('data-element', card.name);
        cardElement.setAttribute('data-state', card.dataState);

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
    const cards = document.querySelectorAll('section > section > article');
    cards.forEach(card => {
        card.addEventListener('click', this.flipCard.bind(card, this)); 
    });
}

flipCard(game) {
  if (this.getAttribute('data-state') === "revealed") return;
  if (game.#lockBoard) return;
  if (this === game.#firstCard) return;
  
  this.setAttribute('data-state', 'flip');

  if (!game.#hasFlippedCard) {
            game.#hasFlippedCard = true;
            game.#firstCard = this;
        } else {
            game.#secondCard = this;
            game.#lockBoard = true;
            game.checkForMatch();
        }
}
}

  