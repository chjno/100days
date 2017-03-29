chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);
  // if (msg.type == 'img'){

  //   var tracker = new tracking.ObjectTracker(['face']);
  //   tracker.setStepSize(1.7);

  //   tracking.track(msg.img, tracker);

  //   tracker.on('track', function (event) {
  //     event.data.forEach(function (rect) {
  //       console.log(rect);
  //     });
  //   });
  // }
});