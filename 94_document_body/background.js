var leftArmHtml = chrome.extension.getURL('parts/left-arm.html');
var rightArmHtml = chrome.extension.getURL('parts/right-arm.html');
var leftFootHtml = chrome.extension.getURL('parts/left-foot.html');
var rightFootHtml = chrome.extension.getURL('parts/right-foot.html');
var headHtml = chrome.extension.getURL('parts/head.html');
var leftArm;
var rightArm;
var leftFoot;
var rightFoot;
var head;

var displays = [];
chrome.system.display.getInfo(function (ds){
  for (var display of ds){
    displays.push(display.bounds);
  }
});

function bodify(win){
  for (var display of displays){
    if (win.left >= display.left && win.left <= display.left + display.width &&
      win.top >= display.top && win.top <= display.top + display.height){

        var update = false;
        if (win.left - display.left < 100){
          win.left = display.left + 100;
          update = true;
        }

        win.right = win.left + win.width;
        display.right = display.left + display.width;

        if (display.right - win.right < 100){
          win.width = display.right - win.left - 100;
          update = true;
        }

        if (win.top - display.top < 263){
          win.top = display.top + 263;
          update = true;
        }

        win.bottom = win.top + win.height;
        display.bottom = display.top + display.height;

        if (display.bottom - win.bottom < 100){
          win.height = display.bottom - win.top - 100;
          update = true;
        }

        var params = {
          left: win.left,
          top: win.top,
          width: win.width,
          height: win.height
        };

        if (update){
          chrome.windows.update(win.id, params, function (win){
            appendage(win);
          });
        } else {
          appendage(win);
        }
        break;
    }
  }
}

function appendage(win){
  var headLeft = win.left + (win.width / 2) - 160;
  var headTop = win.top - 240;

  head.moveTo(headLeft, headTop);

  var armTop = win.top + (win.height / 4);
  var laLeft = win.left - 100;
  var raLeft = win.left + win.width;
  leftArm.moveTo(laLeft, armTop);
  rightArm.moveTo(raLeft, armTop);

  var footTop = win.top + win.height - 22;
  var lfLeft = win.left + (win.width / 4) - 50;
  var rfLeft = win.left + (win.width / 4) * 3 - 50;
  leftFoot.moveTo(lfLeft, footTop);
  rightFoot.moveTo(rfLeft, footTop);

  setTimeout(checkBod, 500);
}



var currentWin;


chrome.windows.getCurrent({}, function (win){
  currentWin = win;
  leftArm = window.open(leftArmHtml, '', 'width=100, height=230');
  rightArm = window.open(rightArmHtml, '', 'width=100, height=230');
  leftFoot = window.open(leftFootHtml, '', 'width=100, height=100');
  rightFoot = window.open(rightFootHtml, '', 'width=100, height=100');
  head = window.open(headHtml, '', 'width=320, height=240');
});

var refocusing = false;
chrome.windows.onFocusChanged.addListener(function (windowId){
  if (ready && windowId != -1 && appendageIds.indexOf(windowId) == -1 && !refocusing){
    refocusing = true;
    for (var id of appendageIds){
      chrome.windows.update(id, {focused: true});
    }
    chrome.windows.update(windowId, {focused: true}, function (){
      refocusing = false;
      
      chrome.windows.get(windowId, {}, function (win){
        currentWin = win;
        bodify(win);
      });
    });

  }
});

ready = false;
appendageIds = [];
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  appendageIds.push(sender.tab.windowId);
  if (appendageIds.length >= 5){
    ready = true;
  }
});

function checkBod(){
  chrome.windows.get(currentWin.id, {}, function (win){
    if (win.left != currentWin.left || win.top != currentWin.top ||
      win.width != currentWin.width || win.height != currentWin.height){
        bodify(win);
    } else {
      setTimeout(checkBod, 500);
    }
  });
}

setTimeout(checkBod, 500);
