var leftArmHtml = chrome.runtime.getURL('limbs/left-arm.html');
var rightArmHtml = chrome.runtime.getURL('limbs/right-arm.html');
var leftFootHtml = chrome.runtime.getURL('limbs/left-foot.html');
var rightFootHtml = chrome.runtime.getURL('limbs/right-foot.html');
var headHtml = chrome.runtime.getURL('limbs/head.html');
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

const appendages = {
  'leftArm': {
    url: leftArmHtml,
    width: armWidth,
    height: armHeight,
  },
  'rightArm': {
    url: rightArmHtml,
    width: armWidth,
    height: armHeight,
  },
  'leftFoot': {
    url: leftFootHtml,
    width: footWidth,
    height: footHeight,
  },
  'rightFoot': {
    url: rightFootHtml,
    width: footWidth,
    height: footHeight,
  },
  'head': {
    url: headHtml,
    width: headWidth,
    height: headHeight,
  },
};

var displays = [];
chrome.system.display.getInfo(function (ds) {
  for (var display of ds) {
    displays.push(display.bounds);
  }
});

function bodify(win) {
  for (var display of displays) {
    if (win.left >= display.left && win.left <= display.left + display.width &&
      win.top >= display.top && win.top <= display.top + display.height) {

      var update = false;
      if (win.left - display.left < armWidth) {
        win.left = display.left + armWidth;
        update = true;
      }

      win.right = win.left + win.width;
      display.right = display.left + display.width;

      if (display.right - win.right < armWidth) {
        win.width = display.right - win.left - armWidth;
        update = true;
      }

      if (win.top - display.top <= headHeight + titleBar) {
        win.top = display.top + headHeight + titleBar + 1;
        update = true;
      }

      win.bottom = win.top + win.height;
      display.bottom = display.top + display.height;

      if (display.bottom - win.bottom < footHeight) {
        win.height = display.bottom - win.top - footHeight;
        update = true;
      }

      var params = {
        left: win.left || 0,
        top: win.top || 0,
        width: win.width || 0,
        height: win.height || 0,
      };

      if (update) {
        chrome.windows.update(win.id, params, function (win) {
          appendage(win);
        });
      } else {
        appendage(win);
      }
      break;
    }
  }
}

function appendage(win) {
  var headLeft = parseInt(win.left + (win.width / 2) - (headWidth / 2));
  var headTop = parseInt(win.top - headHeight);

  chrome.windows.update(appendages['head'].win.id, { left: headLeft, top: headTop });

  var armTop = parseInt(win.top + (win.height / 4));
  var laLeft = parseInt(win.left - armWidth);
  var raLeft = parseInt(win.left + win.width);
  chrome.windows.update(appendages['leftArm'].win.id, { left: laLeft, top: armTop });
  chrome.windows.update(appendages['rightArm'].win.id, { left: raLeft, top: armTop });

  var footTop = parseInt(win.top + win.height - titleBar);
  var lfLeft = parseInt(win.left + (win.width / 4) - (footWidth / 2));
  var rfLeft = parseInt(win.left + (win.width / 4) * 3 - (footWidth / 2));
  chrome.windows.update(appendages['leftFoot'].win.id, { left: lfLeft, top: footTop });
  chrome.windows.update(appendages['rightFoot'].win.id, { left: rfLeft, top: footTop });
}

var currentWin;
chrome.windows.getCurrent({}, function (win) {
  currentWin = win;
  for (const key in appendages) {
    const appendage = appendages[key];
    chrome.windows.create({ url: appendage.url, type: 'popup', width: appendage.width, height: appendage.height }, (win) => {
      appendage.win = win;
      if (Object.values(appendages).every(appendage => appendage.win)) {
        bodify(currentWin);
      }
    });
  }
});

var refocusing = false;
chrome.windows.onFocusChanged.addListener(function handleFocusChange(windowId) {
  if (ready && windowId != -1 && !Object.values(appendageIds).includes(windowId) && !refocusing) {
    refocusing = true;

    chrome.windows.onFocusChanged.removeListener(handleFocusChange);
    for (var id of Object.values(appendageIds)) {
      chrome.windows.update(id, { focused: true });
    }
    chrome.windows.update(windowId, { focused: true }, function () {
      refocusing = false;

      chrome.windows.get(windowId, {}, function (win) {
        currentWin = win;
        bodify(win);

        chrome.windows.onFocusChanged.addListener(handleFocusChange);
      });
    });

  }
});

chrome.windows.onBoundsChanged.addListener(function () {
  chrome.windows.get(currentWin.id, {}, function (win) {
    bodify(win);
  });
});

chrome.windows.onRemoved.addListener(function (windowId) {
  if (Object.values(appendageIds).includes(windowId)) {
    // get the corresponding key for the windowId
    var appendage = Object.keys(appendageIds).find(key => appendageIds[key] === windowId);
    delete appendageIds[appendage];
    // recreate the missing appendage
    chrome.windows.create({ url: appendages[appendage].url, type: 'popup', width: appendages[appendage].width, height: appendages[appendage].height }, (win) => {
      appendageIds[appendage] = win.id;
      appendages[appendage].win = win;
      bodify(currentWin);
    });
  }
})

ready = false;
appendageIds = {};
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  appendageIds[msg] = sender.tab.windowId;
  if (Object.keys(appendageIds).length >= 5) {
    ready = true;
  }
});
