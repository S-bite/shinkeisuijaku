const table_height = 7;
const table_width = 13;

const card_height = 64 * 2;
const card_width = 48 * 2;

const graveyard_x = (card_width + 1.5) * table_width;
const graveyard_y = card_height * (table_height - 1);

const info_display_space_width = 192;

const canvas_height = card_height * table_height;
const canvas_width = card_width * table_width + info_display_space_width;

var card_number = 52;
const card_image = new Image();
const suits = ["club", "heart", "diamond", "spade"];
image_info = [];
image_info.push({ "name": "back", "src": "./images/card_back.png" });
image_info.push({ "name": "title", "src": "./images/title.jpg" });
image_info.push({ "name": "clear", "src": "./images/clear.jpg" });

for (number = 1; number <= 13; number++) {
    zerofilled_number = ("0" + number).slice(-2);
    suits.forEach(suit => {
        image_info.push({ "name": suit + number, "src": `./images/card_${suit}_${zerofilled_number}.png` })
    });
}

const canvas = document.getElementById("game")
canvas.height = canvas_height;
canvas.width = canvas_width;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#008833";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#000000";