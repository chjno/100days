$(window).keydown(function (e){
  var key = e.key.toLowerCase();
  chrome.runtime.sendMessage({type: 'keydown', key: key});
}).keyup(function (e){
  var key = e.key.toLowerCase();
  chrome.runtime.sendMessage({type: 'keyup', key: key});
});

window.onload = function () {
  var href = window.location.href;
  if (href.indexOf('itp.chino.kim/blankmark') >= 0){
    var parts = href.split('/');
    var letter = parts[parts.length - 1].split('.')[0];
    chrome.runtime.sendMessage({type: 'blank', letter: letter});
  }
};