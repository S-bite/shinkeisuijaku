class GameState {
    constructor() {
        this.cardTable = null;
        this.removedCards = new Array();
        this.prevFlipped = null;
        this.state = "title";
        this.trun = 0;
        this.startTime;
        this.endTIme;
        this.elapsedTime;
    }
    initCards(cardNum) {
        this.cardTable = new Array(table_height);
        for (let i = 0; i < this.cardTable.length; i++) {
            this.cardTable[i] = new Array(table_width).fill(null);
        }
        var cards = [];
        for (number = 1; number <= 13; number++) {
            suits.forEach(suit => { cards.push(new Card(suit, number)) });
        }
        cards = cards.slice(0, card_number);
        shuffle(cards);
        for (var i = 0; i < cardNum; i++) {
            var rx = randint(0, table_width - 1);
            var ry = randint(0, table_height - 1);
            var card = cards[i];
            if (this.cardTable[ry][rx] != null) {
                i--;
                continue;
            }
            this.cardTable[ry][rx] = card;
        }
    }
    flipCard(x, y) {
        if (this.cardTable[y][x] != null) {
            this.cardTable[y][x].isFaceUp ^= true;
        }
    }
    removeCard(x, y) {
        this.cardTable[y][x] = null;
    }
    getCardFromPosition(x, y) {
        return this.cardTable[y][x];
    }
}