const timer = {
    minutes: 0,
    seconds: 0,
    interval: 0,
    timerElement: document.querySelector(".timer"),
}

const deck = {
    cards: Array.from(document.querySelectorAll('.card')),
    currentCards: [],
    moveCount: 0,
    getmatchedCards() { return Array.from(document.querySelectorAll('.match')); },
    shuffleCards() { shuffleCards(this.cards.length); }
}

const mainBoard = {
    deck: deck,
    timer: timer,
    init() { initGame(); }
}

mainBoard.init();

function initGame() {
    mainBoard.deck.shuffleCards();
    mainBoard.deck.cards.forEach(card => card.addEventListener('click', displayCard));
    mainBoard.deck.cards.forEach(card => card.addEventListener('click', cardOpen));
}

function shuffleCards(cardCount) {
    let shuffledArray = createShuffleArray(cardCount);

    shuffledArray.forEach((item, index) => 
    {
        mainBoard.deck.cards[index].style.order = item;
        mainBoard.deck.cards[index].tabIndex = item + 1;
    });

}

function createShuffleArray(cardCount) {
    let array = [...Array(cardCount).keys()];
    let currentIndex = cardCount;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function startTimer() {
    mainBoard.timer.interval = setInterval(() => {
        mainBoard.timer.timerElement.textContent = 
            `${mainBoard.timer.minutes} perc ${mainBoard.timer.seconds} mp`;
        mainBoard.timer.seconds++;
        if(mainBoard.timer.seconds == 60) {
            mainBoard.timer.minutes++;
            mainBoard.timer.seconds=0;
        }
    }, 1000);
}

function displayCard() {
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
}

function cardOpen() {
    mainBoard.deck.currentCards.push(this);
    if(mainBoard.deck.currentCards.length === 2) { 
        if(mainBoard.deck.moveCount === 0) {
            mainBoard.deck.moveCount++;
            startTimer();
        }
        
        if(mainBoard.deck.currentCards[0].children[0].className === 
            mainBoard.deck.currentCards[1].children[0].className) {
            matched();
        } else {
            unmatched();
        }
    }
}

function matched() {
    mainBoard.deck.currentCards[0].classList.add("match", "disabled");
    mainBoard.deck.currentCards[1].classList.add("match", "disabled");
    mainBoard.deck.currentCards[0].classList.remove("show", "open", "no-event");
    mainBoard.deck.currentCards[1].classList.remove("show", "open", "no-event");
    mainBoard.deck.currentCards = [];

    if(mainBoard.deck.getmatchedCards().length === mainBoard.deck.cards.length) {
        clearInterval(mainBoard.timer.interval);
    }
}

function unmatched() {
    mainBoard.deck.currentCards[0].classList.add("unmatched");
    mainBoard.deck.currentCards[1].classList.add("unmatched");
    disable();
    setTimeout(function() {
        mainBoard.deck.currentCards[0].classList.remove("show", "open", "no-event","unmatched");
        mainBoard.deck.currentCards[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        mainBoard.deck.currentCards = [];
    }, 1100);
}

function disable() {
    mainBoard.deck.cards.forEach(card => card.classList.add('disabled'));
}

function enable() {
    mainBoard.deck.cards.forEach(card => card.classList.remove('disabled'));
    for(let i = 0; i <  mainBoard.deck.getmatchedCards().length; i++) {
        mainBoard.deck.getmatchedCards()[i].classList.add("disabled");
    };
}
