function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function randSignedInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  var absolute = Math.floor(Math.random() * (max - min)) + min;
  if (Math.random() < 0.5){
    return -absolute;
  } else {
    return absolute;
  }
}

var displays = [];
var originalWins = [];

chrome.system.display.getInfo(function (ds){
  for (var display of ds){
    console.log(display.bounds);
    displays.push(display.bounds);
  }
});

// chrome.windows.getCurrent(function (win){
//   console.log(win);

//   for (var display of displays){
//     if (win.left >= display.left && win.left <= display.left + display.width
//       && win.top >= display.top && win.top <= display.top + display.height){
//       console.log('win is in display', displays.indexOf(display));
//     }
//   }
// });

chrome.idle.setDetectionInterval(15);
chrome.idle.onStateChanged.addListener(function (idleState){
  console.log(idleState);
  if (idleState == 'active'){
    idle = false;
    backToNormal();
  } else {
    idle = true;
    screenSave();
  }
});

function screenSave(){
  chrome.windows.getAll({}, function (winArr){
    for (var win of winArr){
      originalWins.push(win);
      for (var display of displays){
        if (win.left >= display.left && win.left <= display.left + display.width &&
          win.top >= display.top && win.top <= display.top + display.height){
            shrink(win.id, display);
            break;
        }
      }
    }
  });
}

function shrink(winId, bounds){
  var params = {
    left: randInt(bounds.left, bounds.left + bounds.width - 500),
    top: randInt(bounds.top, bounds.top + bounds.height - 500),
    width: 100,
    height: 100
  };
  console.log(params);
  chrome.windows.update(winId, params, function (w){
    w.speedX = randSignedInt(1,10);
    w.speedY = randSignedInt(1,10);
    w.bounds = bounds;
    move(w);
  });
}

function move(win){
  var newLeft = win.left + win.speedX;
  var newTop = win.top + win.speedY;

  if (newLeft < win.bounds.left || newLeft + win.width > win.bounds.left + win.bounds.width){
    win.speedX = -win.speedX;
    newLeft = win.left + win.speedX;
  }
  if (newTop < win.bounds.top || newTop + win.height > win.bounds.top + win.bounds.height){
    win.speedY = -win.speedY;
    newTop = win.top + win.speedY;
  }

  var params = {
    left: newLeft,
    top: newTop
  };

  chrome.windows.update(win.id, params, function (w){
    setTimeout(function (){
      if (idle){
        w.speedX = win.speedX;
        w.speedY = win.speedY;
        w.bounds = win.bounds;
        if (w.top == win.top){
          w.speedY = -w.speedY;
        }
        if (w.left == win.left){
          w.speedX = -w.speedX;
        }
        move(w);
      }
    }, 10);
  });
}

function backToNormal(){
  for (var win of originalWins){
    var params = {
      left: win.left,
      top: win.top,
      width: win.width,
      height: win.height
    };
    chrome.windows.update(win.id, params);
  }
}