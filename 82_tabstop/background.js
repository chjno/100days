// 80 px leftBuffer
// 60 px rightBuffer
// 230 tab width
var winBuffer = 150;
var tabWidth = 230;

chrome.tabs.onCreated.addListener(function (tab){
  chrome.windows.get(tab.windowId, {populate: true}, function (win){
    var tabCount = win.tabs.length;
    if (win.width - winBuffer < tabCount * tabWidth){
      setTimeout(function (){
        chrome.tabs.remove(tab.id);
      }, 100);
    }
  });
});

chrome.windows.getAll({populate: true}, function (winArr){
  for (var win of winArr){
    var tabCount = win.tabs.length;
    var spaceForTabs = win.width - winBuffer;

    if (spaceForTabs < tabCount * tabWidth){
      var index = Math.floor(spaceForTabs / tabWidth);
      for (index; index < tabCount; index++){
        var tab = win.tabs[index];
        chrome.tabs.remove(tab.id);
      }
    }
  }
});