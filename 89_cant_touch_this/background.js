chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (!kill){
    getWinOrigin(sender.tab, msg);
  }
});


function getWinOrigin(tab, msg){
  chrome.windows.get(tab.windowId, {}, function (win){
    var mouse = {
      x: msg.x + win.left,
      y: msg.y + win.top
    };

    for (var display of displays){

      if (win.left >= display.left && win.left <= display.right &&
        win.top >= display.top && win.top <= display.bottom){

          var destination = {
            // left:
            // top:
            // width:
            // height:
          };

          if (mouse.x < display.midX){
            destination.left = randInt(display.midX, display.right);
          } else {
            destination.left = randInt(display.left, display.midX);
          }

          if (mouse.y < display.midY){
            destination.top = randInt(display.midY, display.bottom);
          } else {
            destination.top = randInt(display.top, display.midY);
          }

          winMax = {
            width: display.right - destination.left,
            height: display.bottom - destination.top
          };

          destination.width = randInt(400, winMax.width);
          destination.height = randInt(300, winMax.height);

          chrome.windows.update(win.id, destination);

          break;
      }
    }
  });
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


var displays = [];
var updateTimeout;
function updateDisplays(){
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(function (){
    displays = [];
    chrome.system.display.getInfo(function (ds){
      for (var display of ds){
        display.bounds.midX = display.bounds.left + (display.bounds.width / 2);
        display.bounds.midY = display.bounds.top + (display.bounds.height / 2);
        display.bounds.right = display.bounds.left + display.bounds.width;
        display.bounds.bottom = display.bounds.top + display.bounds.height;
        displays.push(display.bounds);
      }
      // console.log(displays);
    });
  }, 1000);
}

updateDisplays();
chrome.system.display.onDisplayChanged.addListener(updateDisplays);


var kill = false;
chrome.commands.onCommand.addListener(function (command){
  kill = !kill;
});