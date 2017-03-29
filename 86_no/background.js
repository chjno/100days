var delay = 500;
var no = true;

chrome.windows.onCreated.addListener(function (win){
  setTimeout(function (){
    if (no){
      chrome.windows.remove(win.id);
    }
  }, delay);
});

chrome.commands.onCommand.addListener(function (command){
  console.log(command);
  no = false;
});

chrome.windows.getAll({}, function (winArr){
  for (var win of winArr){
    chrome.windows.remove(win.id);
  }
});