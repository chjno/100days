chrome.runtime.sendMessage('appendage');

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function getWebcam(){
  var errorCallback = function(e) {
    // console.log('error', e);
    stockHead();
  };

  navigator.getUserMedia  = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;

  var video = document.getElementById('head');

  if (navigator.getUserMedia) {
    navigator.getUserMedia({video: {width: {exact: 320}, height: {exact: 240}}}, function (stream) {
      video.src = window.URL.createObjectURL(stream);
    }, errorCallback);
  } else {
    stockHead();
  }
}

window.onload = function(){
  if (hasGetUserMedia()) {
    getWebcam();
  } else {
    alert('getUserMedia() is not supported in your browser');
  }
};

function stockHead(){
  console.log('stock head');
  document.body.removeChild(document.getElementById('head'));
  var img = document.createElement('img');
  img.src = chrome.extension.getURL('limbs/stock-head.png');
  img.align = 'center';
  center = document.createElement('center');
  center.append(img);
  document.body.append(center);
}


var resizeTimeout;
window.onresize = function(e) {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function (){
    window.resizeTo(320, 262);
  }, 200);
};