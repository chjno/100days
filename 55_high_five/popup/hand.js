var slap = document.getElementById('slap');
slap.onended = function(){
  chrome.runtime.sendMessage({type: 'close'});
};