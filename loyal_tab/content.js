document.onmousemove = function(e){
  chrome.runtime.sendMessage(e.clientX);
};