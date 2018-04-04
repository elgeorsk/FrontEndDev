let movesCounter = 0;
let selectedCard = 1;
let matches = 1;
let openedCards = [];
let seconds = 0, minutes = 0, tInterval;
let stars = document.querySelectorAll(".stars li i");
let modal = document.getElementById("myModal");
let path = document.querySelector("path");
let circle = document.getElementsByTagName("circle")[0];
let polyline = document.querySelector("polyline");
let circle1 = document.getElementsByTagName("circle")[1];
let score = document.createElement("p");

/* List that holds all of your cards */
const cards =
    ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
        "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
        "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

/* Memory Game Deck Initialization */
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
}

/* Create game's deck when document is ready */
$(document).ready(function () {
    deckInit();
});

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

/* Add Listener - functionality on each card */
function addEventListerToCard() {
    let cards = document.getElementsByTagName("li");
    for (let i = 1; i <= cards.length; i++) {
        cards[i - 1].addEventListener("click", function () {
            if (!cards[i - 1].classList.contains("match") && !cards[i - 1].classList.contains("open")) {
                cards[i - 1].classList.add("open", "show");
                openCards(cards[i - 1]);
            }
        });
    }
}


/* Handle opened cards -- if we have match or un-match */
function openCards(card) {
    if (selectedCard === 1) {
        openedCards.push(card);
    } else if (selectedCard === 2) {
        moves();
        openedCards.push(card);
        if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
            openedCards[0].classList.remove("open", "show");
            openedCards[1].classList.remove("open", "show");
            openedCards[0].classList.add("match");
            openedCards[1].classList.add("match");
            checkIfAllCardsMatches();
        }
    } else if (selectedCard > 2) {
        openedCards[0].classList.remove("open", "show");
        openedCards[1].classList.remove("open", "show");
        openedCards[0].classList.add("card");
        openedCards[1].classList.add("card");
        openedCards = [];
        selectedCard = 1;
        openedCards.push(card);
    }
    selectedCard++;
}

/* Checked if games has finished */
function checkIfAllCardsMatches() {
    if (matches === cards.length / 2) {
        modalDisplay();
        //stop timer
        clearTimeout(tInterval);
    }
    matches++;
}

/* Counts player's moves */
function moves() {
    if (movesCounter <= 1) {
        $("span.moves").text(movesCounter + " Move");
    } else {
        $("span.moves").text(movesCounter + " Moves");
    }

    // stars rating
    if (movesCounter >= 30) {
        stars[1].classList.remove("fa-star");
        stars[1].classList.add("fa-star-o");
    } else if (movesCounter >= 24 && movesCounter < 30) {
        stars[2].classList.remove("fa-star");
        stars[2].classList.add("fa-star-o");
    }
    movesCounter++;
}


/* Timer */
let timerDiv = document.createElement("span");
timerDiv.classList.add("timer");
let time = document.createElement("li");
time.classList.add("fa", "fa-clock-o");
let timeLi = document.createElement("time");
timeLi.innerHTML = "00:00";
timerDiv.appendChild(time);
timerDiv.appendChild(timeLi);
$(".start-button").before(timerDiv);

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
        }
    }

    timeLi.innerText =
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    timer();
}

function timer() {
    tInterval = setTimeout(add, 1000);
}

function restart() {
    movesCounter = 0;
    matches = 1;
    seconds = 0;
    minutes = 0;
    timeLi.innerText = "00:00";
    for (let i = 0; i < 3; i++) {
        if (stars[i].classList.contains("fa-star-o")) {
            stars[i].classList.remove("fa-star-o");
            stars[i].classList.add("fa-star");
        }
    }
    score.innerHTML = "";
    path.classList.remove("path");
    circle.classList.remove("path");
    polyline.classList.remove("path");
    circle1.classList.remove("spin");

    $(".deck").remove();
    deckInit();
    addEventListerToCard();
}

/* Restart button */
$(".restart").on("click", restart);

/* Modal window */
function modalDisplay() {
    modal.style.visibility = (modal.style.visibility == "visible") ? "hidden" : "visible";
    let text = document.getElementsByClassName("modal-text")[0];
    score.innerHTML = "With " + (movesCounter - 1) + " Moves and " + document.getElementsByClassName("fa-star").length + " Stars" + " in " + timeLi.innerText;
    text.appendChild(score);

    // Checkmark animation
    path.classList.add("path");
    circle.classList.add("path");
    polyline.classList.add("path");
    circle1.classList.add("spin");
}

$(".start-button").click(function() {
    addEventListerToCard();
    clearTimeout(tInterval);
    timer();
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.visibility = "hidden";
        restart();
        timer();
    }
};