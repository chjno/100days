// $(function() {
window.onload = function(){
  var tracker = new tracking.ObjectTracker(['face']);
  tracker.setStepSize(1.7);

  tracking.track('img', tracker);

  tracker.on('track', function(event) {
    event.data.forEach(function(rect) {
      console.log(rect);
    });
  });
  
};


// });