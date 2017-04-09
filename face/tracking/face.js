window.onload = function() {
  eye = document.getElementById('eye');
  moveEye(55, 55);
  var video = document.getElementById('video');

  var tracker = new tracking.ObjectTracker('face');
  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);

  tracking.track('#video', tracker, { camera: true });

  var face = false;
  var falseTimeout;
  var timeoutSet = false;
  var infoSent = false;
  tracker.on('track', function (event) {
    if (event.data.length > 0){
      if (!infoSent){
        var data = event.data[0];
        moveEye(mapX(data.x), mapY(data.y));
        chrome.runtime.sendMessage({face: true, info: data});
        infoSent = true;
        setTimeout(function (){
          infoSent = false;
        }, 500);
      }
      if (!face){
        // chrome.runtime.sendMessage({type: 'face', face: true});
        face = true;
        console.log('face');
      }
      if (timeoutSet){
        timeoutSet = false;
        clearTimeout(falseTimeout);
      }
    } else {
      if (!timeoutSet){
        timeoutSet = true;
        falseTimeout = setTimeout(function (){
          console.log('no face');
          chrome.runtime.sendMessage({face: false});
          face = false;
        }, 3000);
      }
    }
  });
};

chrome.runtime.sendMessage({type: 'load', side: 'left'});
var eye;
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