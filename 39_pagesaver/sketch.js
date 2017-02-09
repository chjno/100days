var h = 0;
var s = 100;
var b = 100;
var cardW = 100;
var cardH = 140;
var cardR = 5;
var cardX;
var cardY = 20;
var gravity = 1;
var speedX = 0;
var speedY = 0;
var origins = [];
var index = 0;
var cardCount = 0;
var animate = false;

function setup() {}

function newGame() {
  var canvasWidth = $(window).width();
  createCanvas(canvasWidth, $(window).height());
  $('#defaultCanvas0').css({
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'z-index': canvasZ
  });

  for (var i = 0; i < 4; i++){
    origins[3 - i] = canvasWidth - 125 - i * 120;
  }

  cardX = origins[0];
  cardY = 20;
  speedX = 5;
  speedY = -1;

  colorMode(HSB);

  cardCount = 0;

  // chino card
  fill(32, 23, 94);
  rect(20, 20, cardW, cardH, cardR);

  // starting cards
  for (var i = 0; i < 4; i++) {
    fill(0 + i * 90, s, b);
    var x = origins[i];
    rect(x, 20, cardW, cardH, cardR);
  }
}

function draw() {
  if (animate){
    h++;
    if (h > 360) {
      h = 0;
    }

    fill(h, s, b);
    rect(cardX, cardY, 100, 140, 5);
    cardX += speedX;
    cardY += speedY;
    speedY += gravity;
    if (cardY + 140 > height) {
      cardY = height - 140;
      speedY *= -0.8;
    }
    if (cardX > width || cardX + cardW < 0) {
      index++;
      cardCount++;
      if (cardCount == 52) {
        newGame();
      }
      if (index > 3) {
        index = 0;
      }
      speedX = random(-12, 6);
      while (speedX > -2 && speedX < 2) {
        speedX = random(-12, 6);
      }
      cardX = origins[index];
      cardY = 20;
    }
  }
}
