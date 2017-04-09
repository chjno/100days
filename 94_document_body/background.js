var leftArmHtml = chrome.extension.getURL('limbs/left-arm.html');
var rightArmHtml = chrome.extension.getURL('limbs/right-arm.html');
var leftFootHtml = chrome.extension.getURL('limbs/left-foot.html');
var rightFootHtml = chrome.extension.getURL('limbs/right-foot.html');
var headHtml = chrome.extension.getURL('limbs/head.html');
var leftArm;
var rightArm;
var leftFoot;
var rightFoot;
var head;

var armWidth = 100;
var armHeight = 230;
var footWidth = 100;
var footHeight = 100;
var headHeight = 262;
var headWidth = 320;
var titleBar = 22;

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
        if (win.left - display.left < armWidth){
          win.left = display.left + armWidth;
          update = true;
        }

        win.right = win.left + win.width;
        display.right = display.left + display.width;

        if (display.right - win.right < armWidth){
          win.width = display.right - win.left - armWidth;
          update = true;
        }

        if (win.top - display.top <= headHeight + titleBar){
          win.top = display.top + headHeight + titleBar + 1;
          update = true;
        }

        win.bottom = win.top + win.height;
        display.bottom = display.top + display.height;

        if (display.bottom - win.bottom < footHeight){
          win.height = display.bottom - win.top - footHeight;
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
  var headLeft = win.left + (win.width / 2) - (headWidth / 2);
  var headTop = win.top - headHeight;

  head.moveTo(headLeft, headTop);

  var armTop = win.top + (win.height / 4);
  var laLeft = win.left - armWidth;
  var raLeft = win.left + win.width;
  leftArm.moveTo(laLeft, armTop);
  rightArm.moveTo(raLeft, armTop);

  var footTop = win.top + win.height - titleBar;
  var lfLeft = win.left + (win.width / 4) - (footWidth / 2);
  var rfLeft = win.left + (win.width / 4) * 3 - (footWidth / 2);
  leftFoot.moveTo(lfLeft, footTop);
  rightFoot.moveTo(rfLeft, footTop);

  setTimeout(checkBod, 500);
}



var currentWin;


chrome.windows.getCurrent({}, function (win){
  currentWin = win;
  leftArm = window.open(leftArmHtml, '', 'width=' + armWidth + ', height=' + armHeight);
  rightArm = window.open(rightArmHtml, '', 'width=' + armWidth + ', height=' + armHeight);
  leftFoot = window.open(leftFootHtml, '', 'width=' + footWidth + ', height=' + footHeight);
  rightFoot = window.open(rightFootHtml, '', 'width=' + footWidth + ', height=' + footHeight);
  head = window.open(headHtml, '', 'width=' + headWidth + ', height=' + headHeight);
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
