function randint(min, max) { //get from [min,max] (inclusive)
    min = Math.ceil(min);
    max = Math.floor(max) + 1; // +1 for inclusive
    return Math.floor(Math.random() * (max - min)) + min;
}

image = {};

function createImageLoadPromise(name, src) {
    return new Promise((resolve, reject) => {
        image[name] = new Image();
        image[name].onload = () => resolve(image[name]);
        image[name].onerror = (e) => reject(image[name]);
        image[name].src = src;
    });
}

function shuffle(arr) { // Fisher–Yates algorithm
    for (i = arr.length - 1; i > 0; i--) {
        r = randint(0, i);
        tmp = arr[i];
        arr[i] = arr[r];
        arr[r] = tmp;
    }
}

function loadImages() {

    loadPromises = [];
    image_info.forEach(img => {
        loadPromises.push(createImageLoadPromise(img["name"], img["src"]));
    });
    return Promise.all(loadPromises);
}

function getImageNameFromCard(card) {
    if (card.isFaceUp)
        return card.suit + card.number;
    else
        return "back";
}


function isSameNumber(card1, card2) {

    return card1.number == card2.number;
}

var canHandleClickEvent = true;

function onClick(e, gameState) {
    if (canHandleClickEvent == false) return;
    if (gameState.state == "game") {
        gameState.turn++;
        var rect = e.target.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        gridY = Math.floor(y / card_height);
        gridX = Math.floor(x / card_width);
        card = gameState.getCardFromPosition(gridX, gridY);
        if (card == null || card.isFaceUp) return;
        gameState.flipCard(gridX, gridY);

        if (gameState.prevFlipped != null) {
            prevCard = gameState.prevFlipped.card;
            console.log(prevCard)
            prevGridX = gameState.prevFlipped.gridX;
            prevGridY = gameState.prevFlipped.gridY;
            if (isSameNumber(card, prevCard)) {
                gameState.removeCard(gridX, gridY);
                gameState.removeCard(prevGridX, prevGridY);
                drawFunctions.push(createCardMoveProcedure(gameState, card, gridX * card_width, gridY * card_height, graveyard_x, graveyard_y, performance.now() + 500, performance.now() + 1000));
                drawFunctions.push(createCardMoveProcedure(gameState, prevCard, prevGridX * card_width, prevGridY * card_height, graveyard_x, graveyard_y, performance.now() + 500, performance.now() + 1000));
                gameState.prevFlipped = null;
            } else {
                drawFunctions.push(createCardFlipProcedure(gameState, gridX, gridY, performance.now() + 500));
                drawFunctions.push(createCardFlipProcedure(gameState, prevGridX, prevGridY, performance.now() + 500));
                gameState.prevFlipped = null;
            }
        } else {
            gameState.prevFlipped = { gridX: gridX, gridY: gridY, card: card };
        }
    } else if (gameState.state == "title") {
        gameState.state = "game";
    }
    else if (gameState.state == "clear") {
        location.href = "http://twitter.com/share?text=" + `神経衰弱を${miliSecToMinSec(gameState.elapsedTime)}でクリアしました！`;
    }
}

function createCardMoveProcedure(gameState, card, fromX, fromY, toX, toY, startTime, endTime) {
    return function (timestamp) {
        curTime = performance.now();
        if (curTime <= startTime) {
            canHandleClickEvent = false;
            ctx.drawImage(image[getImageNameFromCard(card)], fromX, fromY, card_width, card_height);
            return true;
        }
        else if (curTime <= endTime) {
            canHandleClickEvent = false;
            curX = fromX + (toX - fromX) * (curTime - startTime) / (endTime - startTime);
            curY = fromY + (toY - fromY) * (curTime - startTime) / (endTime - startTime);
            ctx.drawImage(image[getImageNameFromCard(card)], curX, curY, card_width, card_height);
            return true;
        } else {
            gameState.removedCards.push(card);
            return false;
        }
    }
}

function miliSecToMinSec(msec) {
    sec = Math.floor(msec / 1000);
    min = Math.floor(sec / 60);
    sec %= 60;
    zerofilled_min = ("0" + min).slice(-2);
    zerofilled_sec = ("0" + sec).slice(-2);
    return `${zerofilled_min}: ${zerofilled_sec} `
}

function createCardFlipProcedure(gameState, gridX, gridY, startTime) {
    return function (timestamp) {
        curTime = performance.now();
        if (curTime <= startTime) {
            canHandleClickEvent = false;
            return true;
        }
        else {
            gameState.flipCard(gridX, gridY);
            return false;
        }
    }
}
