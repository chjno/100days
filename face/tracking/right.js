var eye;
chrome.runtime.sendMessage({type: 'load', side: 'right'});

window.onload = function() {
  eye = document.getElementById('eye');
  moveEye(55, 55);
};

function moveEye(x, y){
  eye.style.left = x + 'px';
  eye.style.top = y + 'px';
}

var resizeTimeout;
window.onresize = function(e) {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function (){
    window.resizeTo(107, 129);
  }, 200);
};

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

function mapX(num){
  return num.map(0, 520, 65, 45);
}

function mapY(num){
  return num.map(0, 320, 45, 65);
}

// function mapZ(num){
//   return num.map(100, 305, 45, 65);
// }

chrome.runtime.onMessage.addListener(function (data, sender, sendResponse){
  console.log(data);
  // moveEye(mapX(data.x), mapY(data.y));
});