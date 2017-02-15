$(function (){
  chrome.runtime.sendMessage('ready', function (response) {});
});

var moveInterval;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg){
    moveInterval = setInterval(move, 500);
    // console.log('move');
  } else {
    clearInterval(moveInterval);
    // console.log('stop');
  }
});

function move(){
  // console.log('moving');

  $('body :visible').each(function (){
    if (this.style.transform === ''){
      this.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
    }

    /*
      scaleX: -1, 1
      skewY: ignore
      skewX: -2, 2
      scaleY: -5, 5
      translateX: -100, 100
      translateY: -100, 100
    */
    var currentMatrix = this.style.transform;
    var matrixArr = currentMatrix.replace('matrix(', '').replace(')', '').split(', ');
    var tX = matrixArr[4];
    var tY = matrixArr[5];
    var transArr = [tX, tY];

    for (var i = 0; i < transArr.length; i++){
      if (Math.random() < .5){
        transArr[i]--;
        if (transArr[i] < -100){
          transArr[i] = -100;
        }
      } else {
        transArr[i]++;
        if (transArr[i] > 100){
          transArr[i] = 100;
        }
      }
    }

    this.style.transform = 'matrix(1,0,0,1,' + transArr.join(', ') + ')';
  });
}

function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}
