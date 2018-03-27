let counter = 0;
let c = 1;
let matches = 1;
let openedCards = [];

$(document).ready(function () {
    deckInit();
});

/*
 * Create a list that holds all of your cards
 */
const cards =
    ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
        "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
        "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function deckInit() {
    const suffledCards = shuffle(cards);
    const deck = document.createElement("ul");
    deck.classList.add("deck");
    let liElement, iElement;
    for (let i = 1; i <= suffledCards.length; i++) {
        liElement = document.createElement("li");
        liElement.classList.add("card");
        iElement = document.createElement("i");
        iElement.classList.add("fa", suffledCards[i - 1]);
        liElement.appendChild(iElement);
        deck.appendChild(liElement);
    }
    $("div.container").append(deck);
    moves();
    addEventListerToCard();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(cards) {
    let currentIndex = cards.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }

    return cards;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function addEventListerToCard() {
    let cards = document.getElementsByTagName("li");
    for (let i = 1; i <= cards.length; i++) {
        cards[i - 1].addEventListener("click", function () {
            cards[i - 1].classList.add("open","show");
            moves();
            openCards(cards[i - 1]);
        });
    }
}

function openCards(card) {
    if (c === 1) {
        openedCards.push(card);
    } else if (c === 2) {
        openedCards.push(card);
    }
    if (c === 2) {
        if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
            openedCards[0].classList.remove("open", "show");
            openedCards[1].classList.remove("open", "show");
            openedCards[0].classList.add("match");
            openedCards[1].classList.add("match");
            checkIfAllCardsMatches();
        }
    } else if ( c > 2) {
        openedCards[0].classList.remove("open", "show");
        openedCards[1].classList.remove("open", "show");
        openedCards[0].classList.add("card");
        openedCards[1].classList.add("card");
        openedCards = [];
        c = 1;
        openedCards.push(card);
    }
    c++;
}

function checkIfAllCardsMatches(){
    if (matches === cards.length/2) {
        console.log("Success");
        this.alert("Success");
    }
    matches++;
}

function moves() {
    if (counter <= 1) {
        $("span.moves").text(counter + " Move");
    } else {
        $("span.moves").text(counter + " Moves");
    }
    counter++;
}


//create timer
let timerDiv = document.createElement("span");
timerDiv.classList.add("timer");
let time = document.createElement("li");
time.classList.add("fa", "fa-clock-o");
let timeH1 = document.createElement("time");
timeH1.innerHTML = "00:00:00";
timerDiv.appendChild(time);
timerDiv.appendChild(timeH1);
$(".restart").before(timerDiv);

let seconds = 0, minutes = 0, hours = 0, t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    timeH1.innerText = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}
timer();

$(".restart").click(function () {
    counter = 0;
    timeH1.innerHTML = "00:00:00";
    seconds = 0;
    minutes = 0;
    hours = 0;
    $(".deck").remove();
    deckInit();
});