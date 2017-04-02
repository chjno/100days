chrome.windows.getAll({}, function (winArr){
  for (var win of winArr){
    jitter(win);
  }
});

function jitter(win){
  var dl = Math.random() < 0.5 ? -1 : 1;
  var dt = Math.random() < 0.5 ? -1 : 1;
  chrome.windows.update(win.id, {left: win.left + dl, top: win.top + dt}, jitter);
}

chrome.windows.onCreated.addListener(function (win){
  jitter(win);
});