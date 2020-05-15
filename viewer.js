function drawGameState(gameState) {
    if (gameState.state == "game") {
        ctx.fillStyle = "#008833";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000000";
        for (y = 0; y < table_height; y++) {
            for (x = 0; x < table_width; x++) {
                card = gameState.cardTable[y][x];
                if (card != null && card.isRemoved == false) {
                    ctx.drawImage(image[getImageNameFromCard(card)], x * card_width, y * card_height, card_width, card_height);
                }
            }
        }
        card = gameState.removedCards[gameState.removedCards.length - 1];
        if (card != null)
            ctx.drawImage(image[getImageNameFromCard(card)], graveyard_x, graveyard_y, card_width, card_height);
    } else if (gameState.state == "title") {
        ctx.textAlign = "center";
        ctx.drawImage(image["title"], 0, 0, canvas_width, canvas_height);
        fontsize = 72;
        ctx.font = `${fontsize}px normal`;
        msg = "神経衰弱";
        ctx.fillText(msg, canvas_width / 2, canvas_height * 1 / 3);
        fontsize = 32;
        ctx.font = `${fontsize}px normal`;
        msg = "click to start";
        ctx.fillText(msg, canvas_width / 2, canvas_height / 2);
    } else if (gameState.state == "clear") {
        ctx.textAlign = "center";
        ctx.drawImage(image["clear"], 0, 0, canvas_width, canvas_height);
        fontsize = 72;
        ctx.font = `${fontsize}px normal`;
        msg = "ゲームクリア！！！！！";
        ctx.fillText(msg, canvas_width / 2, canvas_height * 1 / 3);
        fontsize = 32;
        ctx.font = `${fontsize}px normal`;
        msg = `消費時間:${miliSecToMinSec(gameState.elapsedTime)}`;
        ctx.fillText(msg, canvas_width / 2, canvas_height / 2 - 2 * fontsize);
        msg = "click to tweet";
        ctx.fillText(msg, canvas_width / 2, canvas_height / 2);

    }
}


var drawFunctions = new Array(); // all functions in this array must return if it will call next update() (true for yes)

function update(timestamp, gameState) {
    canHandleClickEvent = true;
    drawGameState(gameState);
    newDrawFunctions = drawFunctions.filter(drawFunction => drawFunction(timestamp) == true); // get functions which will call next update()
    drawFunctions = newDrawFunctions;
    if (gameState.removedCards.length == card_number && gameState.state != "clear") {
        gameState.state = "clear";
        gameState.endTime = performance.now();
        gameState.elapsedTime = gameState.endTime - gameState.startTime;
        drawGameState(gameState);
        return;
    }

    window.requestAnimationFrame(function (timestamp) { return update(timestamp, gameState) });
}


