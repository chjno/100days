$(window).mousemove(function (e){
  // console.log(e);
  
  // distance from window top left corner
  var winHead = window.outerHeight - window.innerHeight;
  var mouse = {
    x: e.clientX,
    y: winHead + e.clientY
  };
  
  chrome.runtime.sendMessage(mouse);
});
