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

var wins = {};
chrome.windows.getAll({}, function (winArr){
  for (var win of winArr){
    wins[win.id] = win;
    strobe(win);
  }
});

var here = true;
function strobe(win){
  if (!kill){
    if (here){
      here = false;
      chrome.windows.update(win.id, {top: display.bottom - 1, left: display.right - 1}, function (w){
        setTimeout(function (){
          strobe(w);
        }, 20);
      });
    } else {
      here = true;
      chrome.windows.update(win.id, {top: wins[win.id].top, left: wins[win.id].left}, function (w){
        setTimeout(function (){
          strobe(w);
        }, 10);
      });
    }
  }
}

chrome.windows.onCreated.addListener(function (win){
  wins[win.id] = win;
  strobe(win);
});