// x: 0-520
// y: 0-320
// width/height: 100-305

// x
// 520 == 45
// 240 == 55
// 0 == 65

// y
// 0 == 45
// 140 == 155
// 320 == 65
var leftHtml = chrome.extension.getURL('tracking/index.html');
var rightHtml = chrome.extension.getURL('tracking/right.html');
var leftEye;
var rightEye;

var displays = [];
chrome.system.display.getInfo(function (ds){
  for (var display of ds){
    display.bounds.right = display.bounds.left + display.bounds.width;
    display.bounds.bottom = display.bounds.top + display.bounds.height;
    displays.push(display.bounds);
  }
});

var eyeIds = [];
var ready = false;
var eyes = {};
var rightId;
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.type == 'load'){
    eyeIds.push(sender.tab.windowId);
    if (eyeIds.length >= 2){
      ready = true;
    }
    if (msg.side == 'right'){
      rightId = sender.tab.id;
    }
  } else if (msg.face){
    chrome.tabs.sendMessage(rightId, msg.info);
    // console.log(msg.info);
  }
});

var currentWin;
var eyeHeight = 129;
var eyeWidth = 107;
var titleBar = 22;
chrome.windows.getCurrent({}, function (win){
  currentWin = win;
  leftEye = window.open(leftHtml, '', 'width=' + eyeWidth + ', height=' + eyeHeight);
  rightEye = window.open(rightHtml, '', 'width=' + eyeWidth + ', height=' + eyeHeight);
});

chrome.windows.onFocusChanged.addListener(function (windowId){
  if (ready && windowId != -1 && eyeIds.indexOf(windowId) == -1){
    chrome.windows.get(windowId, {}, function (win){
      currentWin = win;
      putEyesOnIt(win);
    });
  }
});

function putEyesOnIt(win){
  for (var display of displays){
    if (win.left >= display.left && win.left <= display.right && win.top >= display.top && win.top <= display.bottom){
      var update = false;

      if (win.top - display.top <= eyeHeight + titleBar){
        win.top = display.top + eyeHeight + titleBar + 1;
        update = true;
      }

      if (update){
        chrome.windows.update(win.id, {top: win.top}, function (win){
          reposition(win);
        });
      } else {
        reposition(win);
      }
      break;
    }
  }
}

function reposition(win){
  var ll = win.left + (win.width / 4) - (eyeWidth / 2);
  var rl = win.left + (win.width / 4) * 3 - (eyeWidth / 2);
  var t = win.top - eyeHeight;

  leftEye.moveTo(ll, t);
  rightEye.moveTo(rl, t);

  setTimeout(checkBod, 500);
}

function checkBod(){
  chrome.windows.get(currentWin.id, {}, function (win){
    if (win.left != currentWin.left || win.top != currentWin.top || win.width != currentWin.width){
      putEyesOnIt(win);
    } else {
      setTimeout(checkBod, 500);
    }
  });
}

setTimeout(checkBod, 500);
