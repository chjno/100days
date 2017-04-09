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

var center = 55;
var min = 35;
var max = 75;
var x = {
  left: min,
  right: max
};
var y = {
  top: min,
  bottom: max
};
function mapX(num){
  return num.map(0, 520, x.right, x.left);
}

function mapY(num){
  return num.map(0, 320, y.top, y.bottom);
}

function mapEyes(data){
  var z = data.width;
  x.right = z.map(100, 305, center, max);
  y.top = z.map(100, 305, min, center);
  y.bottom = z.map(100, 305, max, center);
  moveEye(mapX(data.x), mapY(data.y));
}

chrome.runtime.onMessage.addListener(function (data, sender, sendResponse){
  // console.log(data);
  mapEyes(data);
});