const timer = {
    interval: 0,
    minutes: 0,
    seconds: 0,
    timerElement: document.querySelector('.timer'),
    init() { initTimer(this); }
}

const deck = {
    cards: Array.from(document.querySelectorAll('.card')),
    currentCards: [],
    moveCount: 0,
    getmatchedCards() { 
        return Array.from(document.querySelectorAll('.match')); 
    },
    modifyClassesOnCards(classesToAdd, classesToRemove = '') { 
        modifyClassesOnCards(this.cards, classesToAdd, classesToRemove); 
    },
    modifyClassesOnCurrentCards(classesToAdd, classesToRemove = '') { 
        modifyClassesOnCards(this.currentCards, classesToAdd, classesToRemove); 
    },
    init() { initDeck(this); }
}

const mainBoard = {
    deck: deck,
    timer: timer,
    init() { initGame(this); }
}

mainBoard.init();

function initGame(board) {
    board.timer.init();
    board.deck.init();
}

function initTimer(timer) {
    timer.minutes = 0;
    timer.seconds = 0;
    timer.timerElement.classList.remove('ended');
    timer.timerElement.textContent = '0 perc 0 mp';
}

function initDeck(deck) {
    deck.moveCount = 0;
    shuffleCards(deck.cards);
    deck.modifyClassesOnCards('', 'show, open, match, disabled, reset');
    deck.cards.forEach(card => card.addEventListener('click', displayCard));
    deck.cards.forEach(card => card.addEventListener('click', cardOpen));
    deck.cards.forEach(card => card.addEventListener('keypress', handleEnter));
    deck.cards.filter(card => card.tabIndex == 1)[0].focus();
}

function shuffleCards(cards) {
    let shuffledArray = createShuffledArray(cards.length);

    shuffledArray.forEach((item, index) => 
    {
        cards[index].style.order = item;
        cards[index].tabIndex = item + 1;
    });
}

function createShuffledArray(cardCount) {
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
    timer.interval = setInterval(() => {
        timer.timerElement.textContent = 
            `${timer.minutes} perc ${mainBoard.timer.seconds} mp`;
        timer.seconds++;
        if(timer.seconds == 60) {
            timer.minutes++;
            timer.seconds=0;
        }
    }, 1000);
}

function modifyClassesOnCards(cards, classesToAdd, classesToRemove) {
    if(classesToAdd && classesToAdd.trim().length > 0) {
        let classes = classesToAdd.split(', ');
        classes.forEach(c => cards.forEach(card => card.classList.add(c)));
    }
    if(classesToRemove && classesToRemove.trim().length > 0) {
        let classes = classesToRemove.split(', ');
        classes.forEach(c => cards.forEach(card => card.classList.remove(c)));
    }
}

function handleEnter(e) {
    if(e.key === 13 || e.key === 'Enter') {
        displayCard(e);
        cardOpen(e);
    }
}

function displayCard(e) {
    e.currentTarget.classList.toggle('open');
    e.currentTarget.classList.toggle('show');
    e.currentTarget.classList.toggle('disabled');
}

function cardOpen(e) {
    deck.currentCards.push(e.currentTarget);
    if(deck.currentCards.length === 2) { 
        if(deck.moveCount === 0) {
            deck.moveCount++;
            startTimer();
        }
        
        if(deck.currentCards[0].children[0].className === 
            deck.currentCards[1].children[0].className) {
            matched();
        } else {
            unmatched();
        }
    }
}

function matched() {
    deck.modifyClassesOnCurrentCards('match, disabled', 'show, open');
    deck.currentCards = [];

    if(mainBoard.deck.getmatchedCards().length === mainBoard.deck.cards.length) {
        restartGame();
    }
}

function restartGame() {
    clearInterval(timer.interval);
    timer.timerElement.classList.add('ended');
    timer.timerElement.textContent = `Gratulálok ${timer.timerElement.textContent} alatt megoldottad!`
    setTimeout(() => {
        deck.modifyClassesOnCards('reset', 'show, open, match, disabled');
    }, 4250);
    setTimeout(() => { mainBoard.init(); }, 5000);
}

function unmatched() {
    mainBoard.deck.modifyClassesOnCurrentCards('unmatch');
    disableCards();
    setTimeout(() => {
        deck.modifyClassesOnCurrentCards('', 'show, open, unmatch');
        enableCards();
        deck.currentCards = [];
    }, 1100);
}

function disableCards() {
    deck.cards.forEach(card => card.classList.add('disabled'));
}

function enableCards() {
    deck.cards.forEach(card =>  {
        if(!deck.getmatchedCards().includes(card)) {
            card.classList.remove('disabled')
        }
    });
}