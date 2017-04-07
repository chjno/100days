window.onload = function() {
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
        chrome.runtime.sendMessage({face: true, info: event.data[0]});
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