var kill = false;
chrome.commands.onCommand.addListener(function (command){
  kill = !kill;
});

var display;
chrome.system.display.getInfo(function (ds){
  ds[0].bounds.right = ds[0].bounds.left + ds[0].bounds.width;
  ds[0].bounds.bottom = ds[0].bounds.top + ds[0].bounds.height;
  display = ds[0].bounds;
});

chrome.windows.getAll({}, function (winArr){
  for (var win of winArr){
    strobe(win);
  }
});

function strobe(win){
  if (!kill){
    var params = {
      left: randInt(display.left, display.right),
      top: randInt(display.top, display.bottom),
      width: randInt(100, display.width),
      height: randInt(100, display.height)
    };
    for (var i = 0; i < randInt(1, 10); i++){
      setTimeout(function (){
        chrome.windows.update(win.id, params, function (w){
          setTimeout(function (){
            var params = {
              left: win.left,
              top: win.top,
              width: win.width,
              height: win.height
            };
            chrome.windows.update(w.id, params);
          }, 10);
        });
      }, 20 * i);
    }
    setTimeout(function (){
      chrome.windows.get(win.id, {}, function (w){
        strobe(w);
      });
    }, randInt(1000, 5000));
  }
}

chrome.windows.onCreated.addListener(function (win){
  strobe(win);
});

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}