
function startGame() {
    gameState = new GameState();
    gameState.initCards(card_number);
    gameState.startTime = performance.now();

    window.requestAnimationFrame(function (timestamp) { return update(timestamp, gameState) });
    canvas.addEventListener("click", function (e) { onClick(e, gameState) }, false);
}

loadImages().then(startGame);

